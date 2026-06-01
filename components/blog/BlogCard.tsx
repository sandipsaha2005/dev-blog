import Link from "next/link"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material"

export type BlogPostListItem = {
  id: string
  heading: string
  content: string
  mediaUrl: string | null
  createdAt: Date
  slug?: string
  user: {
    username: string
    fullName: string
    imageUrl: string | null
  }
  tags: { id: string; name: string; slug: string }[]
}

type BlogCardProps = {
  post: BlogPostListItem
}

function truncate(text: string, max = 200) {
  return text.length <= max ? text : `${text.slice(0, max).trim()}…`
}

export default function BlogCard({ post }: BlogCardProps) {
  const hasImage = Boolean(post.mediaUrl)
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const card = (
    <Card variant="outlined" sx={{ height: "100%" }}>
      {hasImage && (
        <CardMedia
          component="img"
          image={post.mediaUrl!}
          alt={post.heading}
          sx={{ height: 200, objectFit: "cover" }}
        />
      )}

      <CardContent>
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center" }}>
          <Avatar src={post.user.imageUrl ?? undefined} alt={post.user.fullName}>
            {post.user.fullName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{post.user.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">
              @{post.user.username} · {date}
            </Typography>
          </Box>
        </Stack>

        <Typography variant="h6" component="h2" gutterBottom>
          {post.heading}
        </Typography>

        {!hasImage && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {truncate(post.content)}
          </Typography>
        )}

        {post.tags.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }} >
            {post.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )

  if (post.slug) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        {card}
      </Link>
    )
  }

  return card
}
