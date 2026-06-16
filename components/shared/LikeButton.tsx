"use client"
import { startTransition, useOptimistic } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { disLikePost, likePost } from "@/lib/actions/post";

type LikeButtonProps = {
  isLiked?: boolean;
  count?: number;
  id: string;
  likeFn: (id: string) => Promise<void>;
  disLikeFn: (id: string) =>Promise<void>;
};

export const LikeButton = ({
  isLiked = false,
  count = 0,
  id,
  likeFn,
  disLikeFn
}: LikeButtonProps) => {
  const [optimisticState, addOptimistic] = useOptimistic(
    { count, isLiked },
    (current, _) => ({
      count: current.isLiked ? current.count - 1 : current.count + 1,
      isLiked: !current.isLiked
    })
  )

  const handleClick = () => {
    startTransition(async () => {
      addOptimistic(null);

      if (optimisticState.isLiked) {
        await disLikeFn(id);
      } else {
        await likeFn(id)
      }
    })
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleClick}>
        {optimisticState.isLiked ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      <Typography variant="body2">{optimisticState.count}</Typography>
    </Box>
  );
};
