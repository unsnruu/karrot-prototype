"use client";

import { useEffect } from "react";
import {
  createVisitorExperimentContextForVariant,
  isVisitorExperimentVariant,
  parseVisitorExperimentContext,
  VISITOR_EXPERIMENT_COOKIE_KEY,
  VISITOR_EXPERIMENT_STORAGE_KEY,
  type LegacyPreviewExperimentVariant,
  type VisitorExperimentVariant,
} from "@/lib/analytics/experiment-assignment";
import {
  COMMUNITY_INTEREST_TOPIC_COOKIE_KEY,
  COMMUNITY_INTEREST_TOPIC_STORAGE_KEY,
} from "@/lib/community-interest-preference";

type CommunityExperimentEntryScreenProps = {
  clearInterestPreference?: boolean;
  variant: VisitorExperimentVariant | LegacyPreviewExperimentVariant;
};

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookieContext() {
  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${VISITOR_EXPERIMENT_COOKIE_KEY}=`))
    ?.split("=")[1];

  try {
    return parseVisitorExperimentContext(cookieValue ? decodeURIComponent(cookieValue) : null);
  } catch {
    return null;
  }
}

function persistForcedVariant(variant: VisitorExperimentVariant | LegacyPreviewExperimentVariant) {
  const previousContext = readCookieContext();
  const activeVariant = isVisitorExperimentVariant(variant) ? variant : "control";
  const nextContext = createVisitorExperimentContextForVariant(activeVariant, previousContext?.userId);
  const serializedContext = JSON.stringify(nextContext);

  try {
    window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, serializedContext);
  } catch {
    // Storage can be unavailable in embedded research tools. Cookie remains the server-render source.
  }

  document.cookie = `${VISITOR_EXPERIMENT_COOKIE_KEY}=${encodeURIComponent(serializedContext)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

function clearCommunityInterestPreference() {
  try {
    window.localStorage.removeItem(COMMUNITY_INTEREST_TOPIC_STORAGE_KEY);
  } catch {
    // Ignore unavailable storage; clearing the cookie is enough for server-rendered control entry.
  }

  document.cookie = `${COMMUNITY_INTEREST_TOPIC_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
}

export function CommunityExperimentEntryScreen({ clearInterestPreference = false, variant }: CommunityExperimentEntryScreenProps) {
  useEffect(() => {
    persistForcedVariant(variant);

    if (clearInterestPreference) {
      clearCommunityInterestPreference();
    }

    const redirectTimer = window.setTimeout(() => {
      window.location.replace("/community");
    }, 80);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [clearInterestPreference, variant]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-[#111827]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#ff6f0f]" />
        <p className="text-[15px] font-medium tracking-[-0.02em] text-[#6b7280]">커뮤니티를 불러오는 중이에요</p>
      </div>
    </main>
  );
}
