import Link from "next/link"
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import type { BlogPostListItem } from "@/components/blog/BlogItem"
import { LikeButton } from "../shared/LikeButton"
import { NestedComment } from "@/lib/helper/commentTree"
import { TopLevelCommentInput } from "./TopLevelCommentInput"
import { CommentItem } from "./CommentItem"
import { disLikePost, likePost } from "@/lib/actions/post"

export type BlogPostDetailItem = BlogPostListItem & { slug: string }

type BlogPostDetailProps = {
  post: BlogPostDetailItem,
  likeProp: {
    count: number,
    isLiked: boolean,
  },
  comments: NestedComment[]
}

// ── Dummy data to demonstrate two-level nesting ──────────────────────────────
const DUMMY_COMMENTS: NestedComment[] = [
  {
    id: "c1",
    userId: "u1",
    content: "Really insightful post! The explanation of comment trees was crystal clear.",
    parentId: null,
    user: { id: "u1", username: "alice_dev", fullName: "Alice Johnson", imageUrl: null },
    replies: [
      {
        id: "c1r1",
        userId: "u2",
        content: "Totally agree — especially the part about the O(N) tree builder!",
        parentId: "c1",
        user: { id: "u2", username: "bob_codes", fullName: "Bob Smith", imageUrl: null },
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    userId: "u3",
    content: "Would love to see a follow-up on optimistic UI updates for nested replies.",
    parentId: null,
    user: { id: "u3", username: "carol_ux", fullName: "Carol Lee", imageUrl: null },
    replies: [],
  },
]

export default function BlogCard({ post, likeProp, comments }: BlogPostDetailProps) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Use real comments if available; fall back to dummy data for demo
  const displayComments = comments.length > 0 ? comments : DUMMY_COMMENTS

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

      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        <LikeButton
          isLiked={likeProp.isLiked}
          count={likeProp.count}
          id={post.id}
          likeFn={likePost}
          disLikeFn={disLikePost}
        />
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          views {post.viewCount}
        </Typography>
      </Box>

      <Divider />

      <Stack spacing={0}>
        <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
          Comments
        </Typography>

        {displayComments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          <Stack spacing={2.5} sx={{ mb: 1 }}>
            {displayComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </Stack>
        )}

        <TopLevelCommentInput postId={post.id} />
      </Stack>
    </Stack>
  )
}
