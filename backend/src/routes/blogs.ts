import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";


export const blogsRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string;
    },
    Variables: {
        userId?: string;
    }
}>();

blogsRouter.use("/*", async(c,next) => {
    const authHeader = c.req.header("authorization") || ""; 
    const user = await verify(authHeader, c.env.JWT_SECRET)
    if(user){
        c.set("userId", user.id as string );
        next();
    }else{
        c.status(403);
        return c.json({
            message: "not logged in"
        })
    }
    
});


blogsRouter.post('/blog', async(c) => {
   
    const auhtorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate)


    const body = await c.req.json();  
    const blogs = await prisma.Post.create({
        data: {
            title:body.title,
            content: body.content,
            auhtorId: Number(auhtorId)
        }
    });
    return c.json({
        id: blogs.id
    })
  })


blogsRouter.put('/api/v1/blog', (c) => {
    return c.text('Hello Hono!')
  })
  
blogsRouter.get('/api/v1/blog/:id', (c) => {
    return c.text('Hello Hono!')
  })  