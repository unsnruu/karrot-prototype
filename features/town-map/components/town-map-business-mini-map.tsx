"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "@/lib/kakao-maps";

export function TownMapBusinessMiniMap({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let marker: { setMap: (map: unknown) => void } | null = null;

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

        marker = new kakao.maps.CustomOverlay({
          map,
          position: center,
          content: createMarker(label),
          xAnchor: 0.5,
          yAnchor: 1,
          zIndex: 2,
        });

        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });

    return () => {
      marker?.setMap(null);
    };
  }, [label, lat, lng]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-[#eef2f7]">
      <div className="h-full w-full" ref={containerRef} />
      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-medium text-[#6b7280]">
          {status === "loading" ? "지도를 불러오는 중..." : "지도를 불러오지 못했어요."}
        </div>
      ) : null}
    </div>
  );
}

function createMarker(label: string) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "6px";

  const bubble = document.createElement("div");
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.height = "32px";
  bubble.style.width = "32px";
  bubble.style.borderRadius = "999px";
  bubble.style.background = "#ff8a3d";
  bubble.style.boxShadow = "0 4px 10px rgba(255,138,61,0.35)";
  bubble.style.color = "white";
  bubble.style.fontSize = "16px";
  bubble.textContent = "•";

  const pill = document.createElement("div");
  pill.textContent = label;
  pill.style.padding = "4px 10px";
  pill.style.borderRadius = "999px";
  pill.style.background = "rgba(17,24,39,0.92)";
  pill.style.color = "white";
  pill.style.fontSize = "11px";
  pill.style.fontWeight = "700";
  pill.style.lineHeight = "1.2";
  pill.style.whiteSpace = "nowrap";

  wrapper.appendChild(pill);
  wrapper.appendChild(bubble);

  return wrapper;
}
