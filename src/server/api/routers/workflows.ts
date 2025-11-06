import { PAGINATION } from "@/config/constants";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
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
      const [workflow] = await db
        .insert(workflows)
        .values({
          name: generateSlug(3),
          description: input.description || null,
          userId: ctx.auth.user.id,
        })
        .returning();

      return workflow;
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return db
        .delete(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.auth.user.id)
          )
        );
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return db
        .update(workflows)
        .set({
          name: input.name,
        })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.auth.user.id)
          )
        );
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [workflow] = await db
        .select()
        .from(workflows)
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.auth.user.id)
          )
        );

      return workflow;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
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
