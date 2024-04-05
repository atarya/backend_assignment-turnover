import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const userRouter = createTRPCRouter({

  register : publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      return user;
    }),

  verify: publicProcedure
    .input(z.object({
      email: z.string().email(),
      code: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const staticEmailOTP = '12345678'

      if (input.code === staticEmailOTP) {
        
        const user = await ctx.db.user.update({
          where: { email: input.email },
          data: { emailVerified: true },
        });

        return user;

      } else {
        
        throw new Error("Incorrect Code");

      }
    }),
    
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {

      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Incorrect Credentials');
      }

      if (!user.emailVerified) {
        throw new Error('Verify Email');
      }

      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '2h' });

      return { token, message: "Login successful" };
    }),
});
