import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from 'next'
import { Container } from "@mui/material"
import { prisma } from "@/lib/prisma"
import BlogCard from "@/components/blog/BlogCard"
import ViewTracker from "@/components/shared/ViewTracker"
import { auth } from "@/lib/auth"
import { buildCommentTree } from "@/lib/helper/commentTree"

export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const blogs = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })

  return blogs;
}

const getBlogs = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      heading: true,
      content: true,
      mediaUrl: true,
      createdAt: true,
      viewCount: true,
      like: {
        select: {
          userId: true
        }
      },
      user: {
        select: {
          fullName: true,
          imageUrl: true,
          username: true,
        },
      },
      tags: { select: { id: true, name: true, slug: true } },
    }
  })
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const blog = await getBlogs(slug);

  if (!blog) return { title: "Post not found" }

  return {
    title: blog?.heading,
    description: blog?.content?.slice(0, 100),
    openGraph: {
      title: blog?.heading,
      description: blog?.content?.slice(0, 100),
      images: blog?.mediaUrl ? [blog.mediaUrl] : [],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const blog = await getBlogs(slug);

  const [likeCount, userLike] = await Promise.all([
    prisma.postLike.count({
      where: { postId: blog?.id }
    }),

    prisma.postLike.findFirst({
      where: { postId: blog?.id, userId: session.user.id }
    })
  ])

  const comments = await prisma.comment.findMany({
    where: { postId: blog?.id },
    select: {
      userId: true,
      content: true,
      id: true,
      parentId: true,
      user: {
        select: {
          id: true,
          username: true,
          imageUrl: true,
          fullName: true
        }
      }
    }
  });

  const commentTree = buildCommentTree(comments);

  console.log({commentTree});
  
  
  if (!blog) {
    notFound();
  }

  return (
    <Container sx={{ py: 4, maxWidth: "md" }}>
      <ViewTracker slug={slug} />
      <BlogCard post={blog} likeProp={{ count: likeCount, isLiked: !!userLike }} comments={commentTree}/>
    </Container >
  )
}