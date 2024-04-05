import { createTRPCRouter, privateProcedure } from '../trpc';
import { z } from 'zod';

export const homeRouter = createTRPCRouter({

  getCategories: privateProcedure
  .input(z.object({
    page: z.number().default(1),
  }))
  .query(async ({ input, ctx }) => {
    const pageSize = 6;
    const skip = (input.page - 1) * pageSize;
    
    const categories = await ctx.db.category.findMany({
      take: pageSize,
      skip,
      orderBy: { name: 'asc' },
    });

    let interests = await ctx.db.interest.findMany({
        where: { userId: ctx.user!.id },
      });

    const interestSet = new Set(interests.map(interest => interest.categoryId));

    return categories.map(category => ({
      ...category,
      interested: interestSet.has(category.id),
    }));
  }),


  updateInterests: privateProcedure
  .input(z.object({
    categories: z.array(z.number()),
    action: z.enum(["add", "remove"]),
  }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      const categoryIds = await ctx.db.category.findMany({
        where: {
          id: { in: input.categories },
        },
        select: { id: true },
      });

      if (input.action === "add") {
        await Promise.all(categoryIds.map(({ id }) =>
          ctx.db.interest.create({
            data: {
              userId: user!.id,
              categoryId: id,
            },
          })
        ));
      }

      if (input.action === "remove"){
        await Promise.all(categoryIds.map(({ id }) =>
          ctx.db.interest.deleteMany({
            where: {
              userId: user!.id,
              categoryId: id,
            },
          })
        ));
      }

      return { message: "Interests updated successfully" };
    }),
})
