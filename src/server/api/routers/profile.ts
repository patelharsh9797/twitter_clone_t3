// import type { Prisma } from "@prisma/client";
// import type { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";
// import type { createTRPCContext } from "~/server/api/trpc";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              follows: true,
              tweets: true,
            },
          },
          followers:
            currentUserId == null
              ? undefined
              : {
                  where: {
                    id: currentUserId,
                  },
                },
        },
      });

      if (profile == null) return;

      return {
        name: profile.name,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        tweetsCount: profile._count.tweets,
        isFollowing: profile.followers.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserID = ctx.session.user.id;

      const exisitingFollow = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          followers: {
            some: { id: currentUserID },
          },
        },
      });

      let addedFollow;

      if (exisitingFollow == null) {
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            followers: {
              connect: {
                id: currentUserID,
              },
            },
          },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            followers: {
              disconnect: {
                id: currentUserID,
              },
            },
          },
        });
        addedFollow = false;
      }

      void ctx.revalidateSSG?.(`/profiles/${userId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserID}`);

      return { addedFollow };
    }),
});
