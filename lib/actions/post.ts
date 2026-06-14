"use server"

import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { randomBytes } from "crypto";

type PostPayload = {
  heading: string,
  mediaUrl?: string,
  content: string,
  published?: boolean, 
  tags: string[],
}

export const createPost = async (payload: PostPayload) => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  // slug generation depends on heading so what happens if there are same heading for multiple posts.
  
  const uid = randomBytes(4).toString("hex");
  const slug = `${payload.heading.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${uid}`;

  try {
    await prisma.post.create({
      data: {
        heading: payload.heading,
        mediaUrl: undefined,
        content: payload.content,
        published:payload.published ?? false,
        slug,
        user: {
          connect: {
            id: session.user.id
          }
        },
        tags: {
          connectOrCreate: payload.tags.map(tag => ({
            where: { slug: tag.toLowerCase().replace(/\s+/g, '-') },
            create: {
              name: tag.trim(),
              slug: tag.toLowerCase().replace(/\s+/g, '-')
            }
          }))
        }
      }
    })

    return { success: true, message: "Post created" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: error };   
  }
}

export const updatePost = async (payload: PostPayload & {id: string, slug: string}) => {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const tags = payload.tags.map(tag => tag.trim()).filter(Boolean).map(tag => ({
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }))

  await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: payload.id,
        userId: session.user.id
      },
      data: {
        heading: payload.heading,
        mediaUrl: payload.mediaUrl,
        content: payload.content,
        published: payload.published,
        tags: {
          set: []
        }
      }
    })


    await tx.post.update({
      where: {
        id: payload.id,
        userId: session.user.id
      },

      data: {
        heading: payload.heading,
        mediaUrl: payload.mediaUrl,
        content: payload.content,
        published: payload.published,
        tags: {
          connectOrCreate: tags.map(tag => ({
            where: { slug: tag.slug },
            create: tag
          }))
        }
      }
    })
  })

  revalidatePath("/blog");
  revalidatePath(`/blog/${payload.slug}`);
  revalidatePath("/dashboard");
}

export const deletePost = async (postId: string) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      userId: session.user.id
    }
  })

  if (!post) {
    throw new Error("Something went wrong");  
  }

  await prisma.post.deleteMany({
    where: {
      id: postId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/blog/${post?.id}`)
  revalidatePath("/dashboard");
  revalidatePath("/blog");
};