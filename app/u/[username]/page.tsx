import BlogItem from "@/components/blog/BlogItem";
import { prisma } from "@/lib/prisma";
import { Container, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export const revalidate = 60;

const getBlogs = async (username: string) => {
  return prisma.post.findMany({
    where: {
      published: true,
      user: { username },
    },

    select: {
      id: true,
      slug: true,
      heading: true,
      content: true,
      mediaUrl: true,
      createdAt: true,
      user: {
        select: { username: true, imageUrl: true, fullName: true },
      },
      tags: { select: { id: true, name: true, slug: true } },
    },

    orderBy: {
      createdAt: "desc"
    }
  })
}

const getUser = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
    select: { username: true, fullName: true, bio: true, imageUrl: true }
  })
}

export const dynamicParams = true

export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    select: {
      username: true
    }
  })

  return users.map(user => ({ username: user.username }))
};

export default async function page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const [blogs, user] = await Promise.all([getBlogs(username), getUser(username)])

  if (!user) notFound();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {user.fullName}
      </Typography>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog
      </Typography>

      <Stack spacing={2}>
        {blogs.length <= 0 ? (
          <Typography>No post yet.</Typography>
        ) : (

          blogs.map((post) => (
            <BlogItem key={post.id} post={post} />
          ))
        )}
      </Stack>
    </Container>
  )
}