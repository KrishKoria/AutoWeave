import {
  createTRPCRouter,
  preminumProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { workflows } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
export const workflowsRouter = createTRPCRouter({
  create: preminumProcedure
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
  getMany: protectedProcedure.query(({ ctx }) => {
    return db
      .select()
      .from(workflows)
      .where(eq(workflows.userId, ctx.auth.user.id));
  }),
});
