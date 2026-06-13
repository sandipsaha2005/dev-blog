"use client"

import { createPost } from "@/lib/actions/post"
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

type PostPayload = {
  heading: string
  mediaUrl?: string
  content: string
  published?: boolean
  tags: string[]
}

export default function NewPostPage() {
  const router = useRouter();
  const [state, setState] = useState<PostPayload>({
    heading: "",
    mediaUrl: "",
    content: "",
    published: false,
    tags: [],
  })
  const [tagInput, setTagInput] = useState("")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target

    setState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      setState((prev) => ({ ...prev, mediaUrl: "" }))
      return
    }

    setState((prev) => ({
      ...prev,
      mediaUrl: URL.createObjectURL(file),
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload: PostPayload = {
      heading: state.heading.trim(),
      mediaUrl: state.mediaUrl || undefined,
      content: state.content.trim(),
      published: state.published,
      tags: tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    const res = await createPost(payload);

    if (res.success) {
      router.push("/dashboard");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: "1px solid", borderColor: "divider" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Create a post
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add your title, content, optional image, and tags in a minimal flow.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Heading"
            name="heading"
            value={state.heading}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Content"
            name="content"
            value={state.content}
            onChange={handleChange}
            required
            multiline
            minRows={5}
            fullWidth
          />

          <TextField
            label="Tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="tech, nextjs, writing"
            fullWidth
            helperText="Separate tags with commas"
          />

          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Optional image
            </Typography>
            <Button variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
              Upload image
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
            </Button>
            {state.mediaUrl ? (
              <Typography variant="body2" color="text.secondary">
                Selected image preview is ready.
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                You can skip this field if you do not want an image.
              </Typography>
            )}
          </Stack>

          <FormControlLabel
            control={<Checkbox checked={Boolean(state.published)} onChange={handleChange} name="published" />}
            label="Publish immediately"
          />

          <Button type="submit" variant="contained" size="large">
            Log post details
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}