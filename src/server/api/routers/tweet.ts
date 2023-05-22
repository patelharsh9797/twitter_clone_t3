import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   const tweets = await ctx.prisma.tweet.findMany({
  //     take: 100,
  //     orderBy: [{ createdAt: "desc" }],
  //   });

  //   return tweets;
  // }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.tweet.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
          user: {
            select: { name: true, id: true, image: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      return {
        tweets: data.map((tweet) => {
          return {
            id: tweet.id,
            content: tweet.content,
            createdAt: tweet.createdAt,
            likeCount: tweet._count.likes,
            user: tweet.user,
            likedByMe: tweet.likes?.length > 0,
          };
        }),
        nextCursor,
      };
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

  toggleLike: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const data = { twwetId: id, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_twwetId: data,
        },
      });

      if (existingLike == null) {
        await ctx.prisma.like.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.like.delete({
          where: {
            userId_twwetId: data,
          },
        });
        return { addedLike: false };
      }
    }),
});
