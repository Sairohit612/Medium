import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string;
    }
}>();

userRouter.post('signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
  
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      }
    })
  
    const token = sign({id: user.id}, "secret")
    return c.json({
      jwt: token
    })
})
  
userRouter.post('/api/v1/signin', (c) => {
    return c.text('Hello Hono!')
})  