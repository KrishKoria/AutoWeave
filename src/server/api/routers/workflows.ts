import { PAGINATION } from "@/config/constants";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { nodes, workflows } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";
import { eq, and, count, ilike, desc } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create workflow first
      const [workflow] = await db
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

      // Create initial node for the workflow
      await db.insert(nodes).values({
        workflowId: workflow.id,
        type: "INITIAL",
        position: { x: 0, y: 0 },
        name: "INITIAL",
      });

      return workflow;
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
});
