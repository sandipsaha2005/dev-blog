"use client";

import Link from "next/link";
import { ChangeEvent, useState } from "react";
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
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { deletePost, updatePost } from "@/lib/actions/post";

export type BlogPostListItem = {
  id: string;
  heading: string;
  content: string;
  mediaUrl: string | null;
  createdAt: Date;
  slug: string;
  viewCount: number;
  user: {
    username: string;
    fullName: string;
    imageUrl: string | null;
  };
  tags: { id: string; name: string; slug: string }[];
};

type BlogCardProps = {
  post: BlogPostListItem;
};

const truncate = (text: string, max = 200) => {
  return text.length <= max ? text : `${text.slice(0, max).trim()}…`;
};

export function BlogItemDetailed({ post }: { post: BlogPostListItem & { published: boolean } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    heading: post.heading,
    content: post.content,
    tags: post.tags.map((tag) => tag.name).join(","),
    published: post.published as boolean,
    mediaUrl: undefined,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const hasImage = Boolean(post.mediaUrl);
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const badgeColor = post.published ? "success" : "warning";
  const badgeLabel = post.published ? "Published" : "Draft";
  const tags = formValues.tags.split(",");

  const handleEdit = async () => {
    const payload = {
      id: post.id,
      heading: formValues.heading,
      mediaUrl: formValues.mediaUrl,
      content: formValues.content,
      published: formValues.published,
      tags, 
      slug: post.slug,
    };
    
    await updatePost(payload);

    setIsEditing((prev) => !prev);
  };

  const buttons = (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button size="small" variant="outlined" onClick={handleEdit}>
        {isEditing ? "Done" : "Edit"}
      </Button>
      <form action={() => deletePost(post.id)}>
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
  );

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
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mb: 1.5, alignItems: "center" }}
          >
            <Avatar
              src={post.user.imageUrl ?? undefined}
              alt={post.user.fullName}
            >
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
                name="heading"
                value={formValues.heading}
                onChange={handleChange}
              />
              <TextField
                size="small"
                label="Content"
                multiline
                minRows={3}
                value={formValues.content}
                name="content"
                onChange={handleChange}
              />
              <TextField
                size="small"
                label="Tags (comma separated)"
                value={formValues.tags}
                name="tags"
                onChange={handleChange}
              />
            </Stack>
          ) : (
            <>
              {post.slug ? (
                <Link
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {post.heading}
                  </Typography>
                </Link>
              ) : (
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.heading}
                </Typography>
              )}

              {!hasImage && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {truncate(post.content)}
                </Typography>
              )}

              {post.tags.length > 0 && (
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </>
          )}
        </CardContent>
        {buttons}
      </Card>
    </Box>
  );
}

export default function BlogItem({ post }: BlogCardProps) {
  const hasImage = Boolean(post.mediaUrl);
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ mb: 1.5, alignItems: "center" }}
        >
          <Avatar
            src={post.user.imageUrl ?? undefined}
            alt={post.user.fullName}
          >
            {post.user.fullName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{post.user.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">
              @{post.user.username} · {date}
            </Typography>
          </Box>
        </Stack>

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
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
        </>
      </CardContent>
    </Card>
  );

  if (post.slug) {
    return (
      <Box>
        <Link
          href={`/blog/${post.slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {card}
        </Link>
      </Box>
    );
  }

  return <Box>{card}</Box>;
}
