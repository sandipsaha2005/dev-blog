import Link from "next/link"
import {
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material"
import type { BlogPostListItem } from "@/components/blog/BlogItem"

export type BlogPostDetailItem = BlogPostListItem & { slug: string }

type BlogPostDetailProps = {
  post: BlogPostDetailItem
}

export default function BlogCard({ post }: BlogPostDetailProps) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Stack spacing={3}>
      <Box>
        <Link href="/blog" style={{ textDecoration: "none" }}>
          <Button size="small" variant="text">
            ← Back to blog
          </Button>
        </Link>
      </Box>

      <Stack sx={{ justifyContent: "flex-end", alignItems: "center" }} direction="row" spacing={1.5}>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="subtitle2">{post.user.fullName}</Typography>
          <Typography variant="caption" color="text.secondary">
            @{post.user.username} · {date}
          </Typography>
        </Box>
        <Avatar src={post.user.imageUrl ?? undefined} alt={post.user.fullName}>
          {post.user.fullName.charAt(0)}
        </Avatar>
      </Stack>

      <Typography variant="h4" component="h1">
        {post.heading}
      </Typography>

      {post.mediaUrl && (
        <Box
          component="img"
          src={post.mediaUrl}
          alt={post.heading}
          sx={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 1,
            display: "block",
          }}
        />
      )}

      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
        {post.content}
      </Typography>

      {post.tags.length > 0 && (
        <Stack sx={{ flexWrap: "wrap", gap: 0.5 }} direction="row">
          {post.tags.map((tag) => (
            <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
