import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from 'next'
import { Container } from "@mui/material"
import { prisma } from "@/lib/prisma"
import BlogPostDetail from "@/components/blog/BlogPostDetail"

export const dynamicParams = true

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
  const blogs = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })

  return blogs
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;

  const blog = await prisma.post.findUnique({
    where: { slug },
    select: {
      heading: true,
      content: true
    }
  });

  return {
    title: blog?.heading,
    description: blog?.content
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const blog = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      heading: true,
      content: true,
      mediaUrl: true,
      createdAt: true,
      user: {
        select: {
          fullName: true,
          imageUrl: true,
          username: true,
        },
      },
      tags: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!blog) {
    notFound()
  }

  return (
    <Container sx={{ py: 4, maxWidth: "md" }}>
      <BlogPostDetail post={blog} />
    </Container >
  )
}


