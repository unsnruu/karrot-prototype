import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("@/components/ui/app-image", () => ({
  AppImage: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement("img", props),
}));

vi.mock("@/components/ui/experiments/seed-action-button", () => ({
  SeedActionButtonExperiment: ({
    children,
    href,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href
      ? React.createElement("a", { href, ...props }, children)
      : React.createElement("button", props, children),
}));

vi.mock("@/components/ui/experiments/seed-user-avatar", () => ({
  SeedUserAvatarExperiment: ({ alt, src }: { alt: string; src?: string | null }) =>
    React.createElement("img", { alt, src: src ?? undefined }),
}));
