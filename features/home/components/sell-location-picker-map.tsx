"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "@/lib/kakao-maps";
import { SELL_FLOW_DEFAULT_LOCATION } from "@/lib/sell-flow";

declare global {
  interface Window {
    kakao?: {
      maps: {
        LatLng: new (lat: number, lng: number) => {
          getLat: () => number;
          getLng: () => number;
        };
        Map: new (
          container: HTMLElement,
          options: {
            center: unknown;
            level: number;
          },
        ) => {
          setCenter: (latLng: unknown) => void;
          getCenter: () => {
            getLat: () => number;
            getLng: () => number;
          };
        };
        event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

type SellLocationPickerMapProps = {
  initialLat?: number;
  initialLng?: number;
  onCenterChange: (coords: { lat: number; lng: number }) => void;
};

export function SellLocationPickerMap({
  initialLat = SELL_FLOW_DEFAULT_LOCATION.lat,
  initialLng = SELL_FLOW_DEFAULT_LOCATION.lng,
  onCenterChange,
}: SellLocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<{
    setCenter: (latLng: unknown) => void;
    getCenter: () => { getLat: () => number; getLng: () => number };
  } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const center = new kakao.maps.LatLng(initialLat, initialLng);
        const map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 4,
        });

        mapRef.current = map;
        onCenterChange({ lat: initialLat, lng: initialLng });
        kakao.maps.event.addListener(map, "idle", () => {
          const nextCenter = map.getCenter();
          onCenterChange({
            lat: nextCenter.getLat(),
            lng: nextCenter.getLng(),
          });
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialLat, initialLng, onCenterChange]);

  const recenter = () => {
    if (!mapRef.current || !window.kakao) {
      return;
    }

    const center = new window.kakao.maps.LatLng(SELL_FLOW_DEFAULT_LOCATION.lat, SELL_FLOW_DEFAULT_LOCATION.lng);
    mapRef.current.setCenter(center);
    onCenterChange({
      lat: SELL_FLOW_DEFAULT_LOCATION.lat,
      lng: SELL_FLOW_DEFAULT_LOCATION.lng,
    });
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-[#eef2f7]">
      <div className="h-full w-full" ref={containerRef} />

      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#eef2f7] text-sm font-medium text-[#6b7280]">
          {status === "loading" ? "지도를 불러오는 중..." : "지도를 불러오지 못했어요."}
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#ff6f0f] shadow-[0_8px_18px_rgba(255,111,15,0.35)]">
          <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ff6f0f]" />
        </div>
        <div className="mx-auto -mt-2 h-4 w-4 rotate-45 bg-[#ff6f0f]" />
      </div>

      <button
        className="absolute bottom-8 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
        onClick={recenter}
        type="button"
      >
        <CrosshairIcon />
      </button>
    </div>
  );
}

function CrosshairIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="12" cy="12" fill="currentColor" r="1.3" />
    </svg>
  );
}
