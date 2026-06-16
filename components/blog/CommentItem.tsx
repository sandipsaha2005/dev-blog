"use client"
import { useState } from "react"
import { Avatar, Box, Collapse, Stack, TextField, Typography } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import type { NestedComment } from "@/lib/helper/commentTree"
import { LikeButton } from "@/components/shared/LikeButton"


// ─── Inline reply input ───────────────────────────────────────────────────────
function ReplyInput({
  username,
  commentId,
  onClose,
}: {
  username: string
  commentId: string
  onClose: () => void
}) {
  const [value, setValue] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      console.log("Reply to comment", commentId, ":", value.trim())
      setValue("")
      onClose()
    }
    if (e.key === "Escape") onClose()
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, pl: "36px" }}>
      <TextField
        autoFocus
        fullWidth
        variant="standard"
        placeholder={`Reply to ${username}…`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            disableUnderline: false,
          },
        }}
        sx={{
          "& .MuiInput-root": { fontSize: 13 },
          "& .MuiInput-underline:before": { borderColor: "divider" },
        }}
      />
      {value.trim() && (
        <Typography
          component="button"
          onClick={() => {
            console.log("Reply to comment", commentId, ":", value.trim())
            setValue("")
            onClose()
          }}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "primary.main",
            fontWeight: 700,
            fontSize: 13,
            whiteSpace: "nowrap",
            p: 0,
          }}
        >
          Post
        </Typography>
      )}
    </Box>
  )
}

// ─── Single comment row ───────────────────────────────────────────────────────
export function CommentItem({ comment, depth = 0 }: { comment: NestedComment; depth?: number }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [repliesOpen, setRepliesOpen] = useState(false)

  const hasReplies = comment.replies.length > 0

  return (
    <Box sx={{ pl: depth > 0 ? "36px" : 0 }}>
      {/* Main comment row */}
      <Stack sx={{ direction: "row", alignItems: "flex-start" }} spacing={1.5}>
        {/* Avatar */}
        <Avatar
          src={comment.user.imageUrl ?? undefined}
          alt={comment.user.fullName}
          sx={{ width: 32, height: 32, fontSize: 13, flexShrink: 0, mt: "2px" }}
        >
          {comment.user.fullName.charAt(0)}
        </Avatar>

        {/* Content area */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Username + content inline */}
          <Typography variant="body2" sx={{ lineHeight: 1.5, wordBreak: "break-word" }}>
            <Box
              component="span"
              sx={{ fontWeight: 700, mr: 0.75, color: "text.primary" }}
            >
              {comment.user.username}
            </Box>
            {comment.content}
          </Typography>

          {/* Meta row: timestamp · likes · Reply */}
          <Stack spacing={1.5} sx={{ mt: 0.5, direction: "row", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              2h
            </Typography>
            <Typography
              component="button"
              onClick={() => setReplyOpen((p) => !p)}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: 12,
                p: 0,
                "&:hover": { color: "text.primary" },
              }}
            >
              Reply
            </Typography>
          </Stack>

          {/* Reply input */}
          <Collapse in={replyOpen} unmountOnExit>
            <ReplyInput
              username={comment.user.username}
              commentId={comment.id}
              onClose={() => setReplyOpen(false)}
            />
          </Collapse>

          {/* "View X replies" toggle */}
          {hasReplies && (
            <Stack

              spacing={0.5}
              sx={{ mt: 0.75, cursor: "pointer", width: "fit-content", direction: "row", alignItems: 'center' }}
              onClick={() => setRepliesOpen((p) => !p)}
            >
              <Box
                sx={{
                  width: 24,
                  height: "1.5px",
                  bgcolor: "text.disabled",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}
              >
                {repliesOpen
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
              </Typography>
              {repliesOpen ? (
                <KeyboardArrowUpIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              )}
            </Stack>
          )}

          {/* Nested replies */}
          {hasReplies && (
            <Collapse in={repliesOpen} unmountOnExit>
              <Stack spacing={2} sx={{ mt: 1.5 }}>
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </Stack>
            </Collapse>
          )}
        </Box>

        {/* Like button — reuses the shared LikeButton */}
        <LikeButton id={comment.id} />
      </Stack>
    </Box>
  )
}
