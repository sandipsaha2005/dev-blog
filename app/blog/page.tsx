import BlogItem from "@/components/blog/BlogItem"
import { prisma } from "@/lib/prisma"
import { Container, Stack, Typography } from "@mui/material"

export const revalidate = 60

const BlogPage = async () => {
  const blogs = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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
  })

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog
      </Typography>

      {blogs.length === 0 ? (
        <Typography color="text.secondary">No posts yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {blogs.map((post) => (
            <BlogItem key={post.id} post={post} />
          ))}
        </Stack>
      )}
    </Container>
  )
}

export default BlogPage;