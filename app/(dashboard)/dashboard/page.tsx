import { BlogItemDetailed } from "@/components/blog/BlogItem";
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";


export default async function page() {
  const session = await auth();

  const posts = await prisma.post.findMany({
    where: {
      userId: session!.user.id
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      heading: true,
      content: true,
      mediaUrl: true,
      createdAt: true,
      published: true,
      viewCount: true,
      user: {
        select: { username: true, imageUrl: true, fullName: true },
      },
      tags: {
        select: { id: true, name: true, slug: true }
      }
    }
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography>
          Your blogs are  {session!.user.email}
        </Typography>
        <Button variant="contained">
          <Link href="/new">
            New Post
          </Link>
        </Button>
      </Box>
      {posts.length === 0 ? (
        <Typography color="text.secondary">No posts yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {posts.map((post) => (
            <BlogItemDetailed key={post.id} post={post} /> // change it with more detailed component. (draft, published or not)
          ))}
        </Stack>
      )}
    </Container>
  )
}