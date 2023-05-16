import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tweets = await ctx.prisma.tweet.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return tweets;
  }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const tweet = await ctx.prisma.tweet.create({
        data: {
          userId,
          content: input.content,
        },
      });
      return tweet;
    }),
});
