import BlogCard from "@/components/blog/BlogCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link"
import { Button, Container, Stack, Typography } from "@mui/material";
import { cache } from "react";

export const revalidate = 60;

const getBlogs = cache(async (tag: string) => {
  return prisma.post.findMany({
    where: {
      published: true,
      tags: {
        some: { slug: tag }
      }
    },

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
    }
  })
})

export const dynamicParams = true

export async function generateStaticParams() {
  const tags = await prisma.tag.findMany({
    select: { slug: true }
  })
  return tags.map(tag => ({ tag: tag.slug }))
}

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const blogs = await getBlogs(tag);
  
  if (!blogs || blogs.length === 0) {
    return (
      <Typography>No Blogs found for tag #{tag}</Typography>
    )
  }

  return (
    <Container sx={{ py: 4, maxWidth: "md" }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
          <Typography variant="h4">Posts tagged #{tag}</Typography>
          <Button variant="text" component={Link} href="/blog">
            Back
          </Button>
        </Stack>
        {blogs?.map(blog => (
          <BlogCard key={blog.id} post={blog} />
        ))}
      </Stack>
    </Container >
  )
}