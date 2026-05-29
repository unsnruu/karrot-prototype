"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import {
  createVisitorExperimentContextForVariant,
  parseVisitorExperimentContext,
  VISITOR_EXPERIMENT_COOKIE_KEY,
  VISITOR_EXPERIMENT_STORAGE_KEY,
  type VisitorExperimentVariant,
} from "@/lib/analytics/experiment-assignment";
import { trackEvent } from "@/lib/analytics/amplitude";
import { communityFilters } from "@/lib/community";
import {
  COMMUNITY_INTEREST_TOPIC_COOKIE_KEY,
  COMMUNITY_INTEREST_TOPIC_LIMIT,
  COMMUNITY_INTEREST_TOPIC_STORAGE_KEY,
  parseCommunityInterestTopicIds,
  serializeCommunityInterestTopicIds,
} from "@/lib/community-interest-preference";

type CommunityInterestEntryScreenProps = {
  variant: VisitorExperimentVariant;
};

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookieValue(key: string) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${key}=`))
    ?.split("=")[1];
}

function readExperimentUserId() {
  const cookieValue = readCookieValue(VISITOR_EXPERIMENT_COOKIE_KEY);

  try {
    return parseVisitorExperimentContext(cookieValue ? decodeURIComponent(cookieValue) : null)?.userId;
  } catch {
    return undefined;
  }
}

function persistExperimentVariant(variant: VisitorExperimentVariant) {
  const nextContext = createVisitorExperimentContextForVariant(variant, readExperimentUserId());
  const serializedContext = JSON.stringify(nextContext);

  try {
    window.localStorage.setItem(VISITOR_EXPERIMENT_STORAGE_KEY, serializedContext);
  } catch {
    // Cookie remains available for the server-rendered community page.
  }

  document.cookie = `${VISITOR_EXPERIMENT_COOKIE_KEY}=${encodeURIComponent(serializedContext)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

function readSavedTopicIds() {
  try {
    const storedTopicIds = parseCommunityInterestTopicIds(window.localStorage.getItem(COMMUNITY_INTEREST_TOPIC_STORAGE_KEY));

    if (storedTopicIds.length > 0) {
      return storedTopicIds;
    }
  } catch {
    // Storage may be unavailable in embedded research tools; cookie remains the fallback.
  }

  const cookieTopicIds = readCookieValue(COMMUNITY_INTEREST_TOPIC_COOKIE_KEY);
  const decodedTopicIds = cookieTopicIds ? decodeURIComponent(cookieTopicIds) : null;
  return parseCommunityInterestTopicIds(decodedTopicIds);
}

function persistInterestTopics(topicIds: string[]) {
  const serializedTopicIds = serializeCommunityInterestTopicIds(topicIds);

  try {
    window.localStorage.setItem(COMMUNITY_INTEREST_TOPIC_STORAGE_KEY, serializedTopicIds);
  } catch {
    // Cookie remains available for the server-rendered community page.
  }

  document.cookie = `${COMMUNITY_INTEREST_TOPIC_COOKIE_KEY}=${encodeURIComponent(serializedTopicIds)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function CommunityInterestEntryScreen({ variant }: CommunityInterestEntryScreenProps) {
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isCheckingPreference, setIsCheckingPreference] = useState(true);
  const topicOptions = useMemo(() => communityFilters.filter((filter) => Boolean(filter.topic)).slice(0, 12), []);

  useEffect(() => {
    persistExperimentVariant(variant);

    const savedTopicIds = readSavedTopicIds();

    if (savedTopicIds.length > 0) {
      window.location.replace("/community");
      return;
    }

    setIsCheckingPreference(false);
  }, [variant]);

  function toggleTopic(topicId: string) {
    setSelectedTopicIds((currentTopicIds) => {
      if (currentTopicIds.includes(topicId)) {
        return currentTopicIds.filter((currentTopicId) => currentTopicId !== topicId);
      }

      if (currentTopicIds.length >= COMMUNITY_INTEREST_TOPIC_LIMIT) {
        return currentTopicIds;
      }

      return [...currentTopicIds, topicId];
    });

    trackEvent("element_clicked", {
      screen_name: "community_interest_entry",
      target_type: "chip",
      target_name: "community_interest_topic_option",
      surface: "interest_topic_picker",
      target_id: topicId,
    });
  }

  function handleSubmit() {
    if (selectedTopicIds.length === 0) {
      return;
    }

    persistInterestTopics(selectedTopicIds);
    trackEvent("element_clicked", {
      screen_name: "community_interest_entry",
      target_type: "button",
      target_name: "community_interest_topic_submit",
      surface: "interest_topic_picker",
      target_id: selectedTopicIds.join(","),
      selected_topic_count: selectedTopicIds.length,
      destination_path: "/community",
    });
    window.location.replace("/community");
  }

  if (isCheckingPreference) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#111827]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#ff6f0f]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell-wide flex min-h-screen flex-col px-5 pb-6 pt-12">
        <section className="flex-1">
          <p className="text-[13px] font-semibold text-[#ff6f0f]">커뮤니티 추천 설정</p>
          <h1 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.03em] text-[#111827]">
            동네에서 어떤 이야기를
            <br />
            보고 싶나요?
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-[1.45] text-[#6b7280]">
            관심사를 고르면 우리 동네 글을 먼저 보여드려요.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {topicOptions.map((topic) => {
              const isSelected = selectedTopicIds.includes(topic.id);
              const isDisabled = !isSelected && selectedTopicIds.length >= COMMUNITY_INTEREST_TOPIC_LIMIT;

              return (
                <button
                  className={`flex h-[54px] items-center justify-between rounded-[14px] border px-4 text-left text-[16px] font-semibold tracking-[-0.02em] transition-colors ${
                    isSelected
                      ? "border-[#ff6f0f] bg-[#fff4ed] text-[#111827]"
                      : isDisabled
                        ? "border-[#eceef2] bg-[#f7f8fa] text-[#b0b6bf]"
                        : "border-[#eceef2] bg-[#f7f8fa] text-[#374151]"
                  }`}
                  disabled={isDisabled}
                  key={topic.id}
                  onClick={() => {
                    toggleTopic(topic.id);
                  }}
                  type="button"
                >
                  <span>{topic.label}</span>
                  {isSelected ? <Check aria-hidden="true" className="h-5 w-5 text-[#ff6f0f]" strokeWidth={2.4} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <button
          className={`mt-8 flex h-[56px] w-full items-center justify-center gap-1 rounded-[14px] text-[17px] font-bold transition-colors ${
            selectedTopicIds.length > 0 ? "bg-[#ff6f0f] text-white" : "bg-[#eef0f3] text-[#a3a8b0]"
          }`}
          disabled={selectedTopicIds.length === 0}
          onClick={handleSubmit}
          type="button"
        >
          선택 완료 ({selectedTopicIds.length}/{COMMUNITY_INTEREST_TOPIC_LIMIT})
          <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
    </main>
  );
}
