import { PAGINATION } from "@/config/constants";
import { inngest } from "@/inngest/client";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  connections,
  nodes,
  workflows,
  type NodeType,
} from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";
import { eq, and, count, ilike, desc } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(workflows.userId, ctx.auth.user.id)
        ),
        with: {
          nodes: true,
          connections: true,
        },
      });
      await inngest.send({
        name: "workflows/execute.workflow",
        data: {
          workflowId: input.id,
        },
      });
      return workflow;
    }),
  create: premiumProcedure
    .input(
      z.object({
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await db.transaction(async (tx) => {
        const [workflow] = await tx
          .insert(workflows)
          .values({
            name: generateSlug(3),
            description: input.description || null,
            userId: ctx.auth.user.id,
          })
          .returning();

        if (!workflow) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        await tx.insert(nodes).values({
          workflowId: workflow.id,
          type: "INITIAL",
          position: { x: 0, y: 0 },
          name: "INITIAL",
        });

        return workflow;
      });
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [item] = await db
        .delete(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.auth.user.id)
          )
        )
        .returning();
      if (!item) {
        return new TRPCError({ code: "NOT_FOUND" });
      }
      return item;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [workflow] = await db
        .update(workflows)
        .set({
          name: input.name,
        })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.auth.user.id)
          )
        )
        .returning();
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return workflow;
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(workflows.userId, ctx.auth.user.id)
        ),
        with: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type ?? undefined,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z
          .number()
          .min(PAGINATION.DEFAULT_PAGE)
          .default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const offset = (page - 1) * pageSize;

      const [items, countResult] = await Promise.all([
        db
          .select()
          .from(workflows)
          .where(
            and(
              eq(workflows.userId, ctx.auth.user.id),
              ilike(workflows.name, `%${search}%`)
            )
          )
          .limit(pageSize)
          .offset(offset)
          .orderBy(desc(workflows.updatedAt)),
        db
          .select({ count: count() })
          .from(workflows)
          .where(
            and(
              eq(workflows.userId, ctx.auth.user.id),
              ilike(workflows.name, `%${search}%`)
            )
          ),
      ]);

      const totalItems = countResult[0]?.count ?? 0;
      const totalPages = Math.ceil(totalItems / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any().optional()),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes: nodeTypes, edges } = input;
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(workflows.userId, ctx.auth.user.id)
        ),
        with: {
          nodes: true,
          connections: true,
        },
      });
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return await db.transaction(async (tx) => {
        // Delete existing nodes (cascade deletes connections)
        await tx.delete(nodes).where(eq(nodes.workflowId, id));

        // Insert new nodes only if there are any
        if (nodeTypes.length > 0) {
          await tx.insert(nodes).values(
            nodeTypes.map((node) => ({
              id: node.id,
              workflowId: id,
              name: node.type || "unknown",
              type: node.type as (typeof NodeType)[keyof typeof NodeType],
              position: node.position,
              data: node.data || {},
            }))
          );
        }

        // Insert new connections only if there are any
        if (edges.length > 0) {
          await tx.insert(connections).values(
            edges.map((edge) => ({
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
            }))
          );
        }

        await tx
          .update(workflows)
          .set({
            updatedAt: new Date(),
          })
          .where(eq(workflows.id, id));

        return workflow;
      });
    }),
});
