"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "@/lib/kakao-maps";

export function ItemDetailKakaoMap({
  title,
  meetupHint,
  meetupAddress,
  lat,
  lng,
  rounded = true,
  heightClassName = "h-[140px] sm:h-[170px]",
}: {
  title: string;
  meetupHint: string;
  meetupAddress?: string;
  lat?: number;
  lng?: number;
  rounded?: boolean;
  heightClassName?: string;
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
      <div className={`relative overflow-hidden border border-black/10 ${rounded ? "rounded-[14px]" : ""}`}>
        <div className={`${heightClassName} w-full bg-[#eef2f7]`} ref={containerRef} />

        {status !== "ready" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm font-medium text-[#4b5563]">
            {status === "loading" ? "지도를 불러오는 중..." : "지도를 불러오지 못했어요."}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] leading-[1.5] text-[#4b5563]">{meetupAddress ?? meetupHint}</p>
      </div>
    </div>
  );
}
