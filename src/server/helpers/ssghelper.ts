import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
// import { prisma } from "~/server/db";
import superJson from "superjson";
import { createInnerTRPCContext } from "../api/trpc";

export function ssgHelper() {
  return createServerSideHelpers({
    router: appRouter,
    // ctx: { prisma, userId: null },
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superJson,
  });
}
