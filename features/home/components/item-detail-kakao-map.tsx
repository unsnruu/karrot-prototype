"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ExpandIcon } from "lucide-react";
import { loadKakaoMapsSdk } from "@/lib/kakao-maps";

export function ItemDetailKakaoMap({
  title,
  meetupHint,
  meetupAddress,
  lat,
  lng,
  rounded = true,
  containerClassName,
  heightClassName = "h-[140px] sm:h-[170px]",
  showMapViewCta = true,
  showLocationLabel = true,
  mapViewCtaLabel = "지도 보기",
  showTownMapCta = false,
  townMapCtaLabel,
}: {
  title: string;
  meetupHint: string;
  meetupAddress?: string;
  lat?: number;
  lng?: number;
  rounded?: boolean;
  containerClassName?: string;
  heightClassName?: string;
  showMapViewCta?: boolean;
  showLocationLabel?: boolean;
  mapViewCtaLabel?: string;
  showTownMapCta?: boolean;
  townMapCtaLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (lat == null || lng == null || !containerRef.current) {
      setStatus("error");
      return;
    }

    let marker: { setMap: (map: unknown) => void; setPosition: (position: unknown) => void } | null = null;

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (!containerRef.current) {
          return;
        }

        const center = new kakao.maps.LatLng(lat, lng);
        const map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 4,
          draggable: false,
          scrollwheel: false,
          disableDoubleClick: true,
        });

        const markerImage = new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35),
          {
            offset: new kakao.maps.Point(12, 35),
          },
        );

        marker = new kakao.maps.Marker({
          map,
          position: center,
          image: markerImage,
        });

        map.setCenter(center);
        map.setDraggable(false);
        map.setZoomable(false);
        marker.setPosition(center);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });

    return () => {
      marker?.setMap(null);
    };
  }, [lat, lng]);

  if (lat == null || lng == null) {
    return (
      <div className={`overflow-hidden border border-black/10 bg-[#f7f7f8] p-4 ${rounded ? "rounded-[14px]" : ""}`}>
        <p className="text-sm font-medium text-black">거래 위치 좌표가 아직 없어요.</p>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#6b7280]">{meetupAddress ?? meetupHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className={containerClassName ?? `overflow-hidden border border-black/10 ${rounded ? "rounded-[14px]" : ""}`}>
        <div className="relative">
          <div className={`${heightClassName} w-full bg-[#eef2f7]`} ref={containerRef} />

          {status !== "ready" ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 text-sm font-medium text-[#4b5563]">
              {status === "loading" ? "지도를 불러오는 중..." : "지도를 불러오지 못했어요."}
            </div>
          ) : null}

          {showMapViewCta ? (
            <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.18)]">
              <span className="text-[12px] font-medium leading-none text-black">{mapViewCtaLabel}</span>
              <ExpandIcon aria-hidden="true" className="h-4 w-4 text-black" strokeWidth={1.8} />
            </div>
          ) : null}
        </div>

        {showTownMapCta && townMapCtaLabel ? (
          <div className="flex items-center justify-between bg-[#f2f4f5] p-2">
            <div className="flex min-w-0 items-center gap-1">
              <TownMapPinIcon />
              <p className="truncate text-[12px] font-medium leading-none text-black">{townMapCtaLabel}</p>
            </div>
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-black" strokeWidth={1.6} />
          </div>
        ) : null}
      </div>

      {showLocationLabel ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] leading-[1.5] text-[#4b5563]">{meetupAddress ?? meetupHint}</p>
        </div>
      ) : null}
    </div>
  );
}

function TownMapPinIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <path
        d="M8 1.5A5.25 5.25 0 0 0 2.75 6.75c0 3.62 4.34 7.3 4.72 7.62a.82.82 0 0 0 1.06 0c.38-.32 4.72-4 4.72-7.62A5.25 5.25 0 0 0 8 1.5Z"
        fill="#FF6F0F"
      />
      <circle cx="8" cy="6.75" fill="white" r="1.75" />
    </svg>
  );
}
