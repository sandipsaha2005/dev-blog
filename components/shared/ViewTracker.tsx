"use client"

import { useEffect, useRef } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;

    hasTrackedRef.current = true;
    fetch(`/api/blogs/${slug}/view`, { method: "POST" });
  }, [slug]);

  return null;
}