"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import { deletePost } from "@/lib/actions/post"

export type BlogPostListItem = {
  id: string
  heading: string
  content: string
  mediaUrl: string | null
  createdAt: Date
  slug?: string
  published: boolean,
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

export function BlogCardDetailed({ post }: BlogCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState({
    heading: post.heading,
    content: post.content,
    tags: post.tags.map((tag) => tag.name).join(", "),
    published: post.published,
  })

  const hasImage = Boolean(post.mediaUrl)
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const badgeColor = post.published ? "success" : "warning"
  const badgeLabel = post.published ? "Published" : "Draft"

  const buttons = (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        {isEditing ? "Done" : "Edit"}
      </Button>
      <form action={deletePost.bind(null, post.id)}>
        <Button
          type="submit"
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteOutlineRoundedIcon />}
        >
          Delete
        </Button>
      </form>
    </Box>
  )
  
  return (
    <Box sx={{ position: "relative" }}>
      <Card variant="outlined" sx={{ height: "100%", position: "relative" }}>
        <Chip
          label={badgeLabel}
          color={badgeColor}
          size="small"
          sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}
        />
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

          {isEditing ? (
            <Stack spacing={1.5} sx={{ mb: 1.5 }}>
              <TextField
                size="small"
                label="Heading"
                value={formValues.heading}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, heading: event.target.value }))
                }
              />
              <TextField
                size="small"
                label="Content"
                multiline
                minRows={3}
                value={formValues.content}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, content: event.target.value }))
                }
              />
              <TextField
                size="small"
                label="Tags (comma separated)"
                value={formValues.tags}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, tags: event.target.value }))
                }
              />
            </Stack>
          ) : (
            <>
              {post.slug ? <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.heading}
                </Typography>
              </Link> :
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.heading}
                </Typography>
              }

              {!hasImage && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {truncate(post.content)}
                </Typography>
              )}

              {post.tags.length > 0 && (
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                  {post.tags.map((tag) => (
                    <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </>
          )}
        </CardContent>
        {buttons}
      </Card>
    </Box>
  )
}

export default function BlogCard({ post }: BlogCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState({
    heading: post.heading,
    content: post.content,
    tags: post.tags.map((tag) => tag.name).join(", "),
    published: post.published,
  })

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

        {isEditing ? (
          <Stack spacing={1.5} sx={{ mb: 1.5 }}>
            <TextField
              size="small"
              label="Heading"
              value={formValues.heading}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, heading: event.target.value }))
              }
            />
            <TextField
              size="small"
              label="Content"
              multiline
              minRows={3}
              value={formValues.content}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, content: event.target.value }))
              }
            />
            <TextField
              size="small"
              label="Tags (comma separated)"
              value={formValues.tags}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, tags: event.target.value }))
              }
            />
            <Button
              size="small"
              variant={formValues.published ? "contained" : "outlined"}
              color={formValues.published ? "success" : "warning"}
              onClick={() =>
                setFormValues((prev) => ({ ...prev, published: !prev.published }))
              }
            >
              {formValues.published ? "Published" : "Draft"}
            </Button>
          </Stack>
        ) : (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              {post.heading}
            </Typography>

            {!hasImage && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {truncate(post.content)}
              </Typography>
            )}

            {post.tags.length > 0 && (
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {post.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />
                ))}
              </Stack>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  const editButton = (
    <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
      <Button size="small" variant="outlined" onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? "Done" : "Edit"}
      </Button>
      <form action={deletePost.bind(null, post.id)}>
        <Button
          type="submit"
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteOutlineRoundedIcon />}
        >
          Delete
        </Button>
      </form>
    </Box>
  )

  if (post.slug) {
    return (
      <Box>
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          {card}
        </Link>
        {editButton}
      </Box>
    )
  }

  return (
    <Box>
      {card}
      {editButton}
    </Box>
  )
}
