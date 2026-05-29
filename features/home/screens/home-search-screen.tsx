"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, Search, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { ArrowLeftIcon } from "@/features/home/components/item-detail-icons";

type HomeSearchScreenProps = {
  initialQuery: string;
};

const recommendedTerms = ["맛집", "에어컨 청소", "고유가 지원금", "강아지 병원"];
const experimentSearchTerm = "맛집";

export function HomeSearchScreen({ initialQuery }: HomeSearchScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function submitSearch(nextQuery = query) {
    const value = nextQuery.trim();

    if (!value) {
      return;
    }

    router.push(`/home/search/results?query=${encodeURIComponent(value)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch();
  }

  function fillExperimentSearchTerm() {
    setQuery(experimentSearchTerm);
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <div className="mobile-shell min-h-screen bg-white">
        <header className="border-b border-[#f2f3f5] px-4 pb-4 pt-8">
          <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            <Link aria-label="뒤로 가기" className="flex h-10 w-10 shrink-0 items-center justify-center text-black" href="/home">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>

            <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-[12px] bg-[#f2f3f5] px-4" onClick={fillExperimentSearchTerm}>
              <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#9ca3af]" strokeWidth={2} />
              <input
                className="min-w-0 flex-1 bg-transparent text-[17px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af]"
                onClick={fillExperimentSearchTerm}
                onFocus={fillExperimentSearchTerm}
                placeholder="검색어를 입력해주세요"
                readOnly
                value={query}
              />
              {query ? (
                <button
                  aria-label="검색어 지우기"
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-[#9ca3af] text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    setQuery("");
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="h-2.5 w-2.5" strokeWidth={2.5} />
                </button>
              ) : null}
            </label>

            <button className="shrink-0 text-[16px] font-medium text-[#111827]" type="submit">
              검색
            </button>
          </form>
        </header>

        <section className="px-5 py-6">
          <h1 className="text-[18px] font-bold tracking-[-0.02em] text-[#111827]">최근 검색</h1>
          <div className="mt-5 flex flex-col gap-4">
            {recommendedTerms.map((term) => (
              <button className="flex items-center gap-3 text-left" key={term} onClick={() => submitSearch(term)} type="button">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f4f6]">
                  <Clock3 aria-hidden="true" className="h-4 w-4 text-[#4b5563]" strokeWidth={1.7} />
                </span>
                <span className="text-[17px] text-[#111827]">{term}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
