import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.token.create({
        data: {
          key: input.key,
          createdAt: new Date(),
          updatedAt: new Date(),
          value: new Date().getTime().toString(36),
        },
      });
    }),
  getById: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.token.findFirst({
        where: {
          key: input.tokenId,
        },
      });
    }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
