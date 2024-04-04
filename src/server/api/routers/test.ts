import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';

export const testRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { id: input.id },
      });
      return category;
    }),
});
