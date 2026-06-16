"use client"
import { useState } from "react"
import { Avatar, Box, Typography } from "@mui/material"
import { createComment } from "@/lib/actions/post"

export function TopLevelCommentInput({ postId }: { postId: string }) {
  const [value, setValue] = useState("")

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      await createComment({ content: value.trim(), postId, parentId: undefined })
      setValue("")
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        pt: 1.5,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar sx={{ width: 32, height: 32, fontSize: 13, flexShrink: 0 }}>U</Avatar>

      <Box
        component="input"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment…"
        sx={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 14,
          color: "text.primary",
          "&::placeholder": { color: "text.disabled" },
        }}
      />

      {/* "Post" button — only visible when typing */}
      {value.trim() && (
        <Typography
          component="button"
          onClick={() => {
            console.log("New top-level comment:", value.trim())
            setValue("")
          }}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "primary.main",
            fontWeight: 700,
            fontSize: 14,
            p: 0,
            flexShrink: 0,
          }}
        >
          Post
        </Typography>
      )}
    </Box>
  )
}
