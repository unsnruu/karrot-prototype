"use client";

const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100] as const;

export function calculateScrollDepthPercent() {
  const documentElement = document.documentElement;
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const scrollableHeight = documentElement.scrollHeight - viewportHeight;

  if (scrollableHeight <= 0) {
    return 100;
  }

  return Math.min(100, Math.round(((scrollTop + viewportHeight) / documentElement.scrollHeight) * 100));
}

export function resolveScrollDepthBucket(percent: number) {
  for (const milestone of SCROLL_DEPTH_MILESTONES) {
    if (percent <= milestone) {
      return milestone;
    }
  }

  return 100;
}

export function getScrollDepthMilestones() {
  return SCROLL_DEPTH_MILESTONES;
}
