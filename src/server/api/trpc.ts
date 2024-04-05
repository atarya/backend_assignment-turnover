import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { verify } from 'jsonwebtoken';

import { db } from "@/server/db";

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  const { req, res } = _opts;
  return {
    req,
    res,
    db
  }
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const getUserFromToken = async (token: string) => {
  try {
    const tokenUser = await verify(token, process.env.JWT_SECRET!) as { userId: number; email: string; name: string };

    const user = await db.user.findUnique({
      where: { email: tokenUser.email }
    })

    if (!user) return null;

    return user as { id: number; email: string; name: string};

  } catch {
    return null;
  }
};

const auth = t.middleware(async ({ ctx, next }) => {
  const token = ctx.req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No token provided' });
  }

  const user = await getUserFromToken(token);
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});


export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const privateProcedure = t.procedure.use(auth);
export const publicProcedure = t.procedure;
