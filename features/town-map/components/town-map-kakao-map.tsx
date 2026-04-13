"use client";

import { useEffect, useRef, useState } from "react";
import { loadKakaoMapsSdk } from "@/lib/kakao-maps";
import { type TownMapCoordinate, type TownMapPin } from "@/lib/town-map";

export function TownMapKakaoMap({
  center,
  pins,
}: {
  center: TownMapCoordinate;
  pins: TownMapPin[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const overlays: Array<{ setMap: (map: unknown) => void }> = [];
    loadKakaoMapsSdk()
      .then((kakao) => {
        if (!containerRef.current) {
          return;
        }

        const mapCenter = new kakao.maps.LatLng(center.lat, center.lng);
        const map = new kakao.maps.Map(containerRef.current, {
          center: mapCenter,
          level: 4,
          draggable: true,
          scrollwheel: true,
          disableDoubleClick: false,
        });

        map.setCenter(mapCenter);
        map.setDraggable(true);
        map.setZoomable(true);

        for (const pin of pins) {
          const overlayPosition = new kakao.maps.LatLng(pin.lat, pin.lng);
          const overlayNode = createPinOverlay(pin);
          const overlay = new kakao.maps.CustomOverlay({
            map,
            position: overlayPosition,
            content: overlayNode,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 3,
          });

          overlays.push(overlay);
        }

        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });

    return () => {
      for (const overlay of overlays) {
        overlay.setMap(null);
      }
    };
  }, [center.lat, center.lng, pins]);

  return (
    <div className="absolute inset-0">
      <div className="h-full w-full bg-[#eef2f7]" ref={containerRef} />
      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75 text-sm font-medium text-[#4b5563]">
          {status === "loading" ? "지도를 불러오는 중..." : "지도를 불러오지 못했어요."}
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-white/12" />
    </div>
  );
}

function createPinOverlay(pin: TownMapPin) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "4px";
  wrapper.style.cursor = pin.href ? "pointer" : "default";

  const iconImage = document.createElement("img");
  iconImage.src = pin.icon;
  iconImage.alt = "";
  iconImage.width = 38;
  iconImage.height = 43;
  iconImage.draggable = false;
  iconImage.style.display = "block";
  iconImage.style.width = "38px";
  iconImage.style.height = "43px";
  iconImage.style.objectFit = "contain";
  iconImage.style.filter = "drop-shadow(0px 4px 12px rgba(0,0,0,0.16))";

  const label = document.createElement("div");
  label.textContent = pin.label;
  label.style.whiteSpace = "pre";
  label.style.borderRadius = "10px";
  label.style.background = "rgba(255,255,255,0.92)";
  label.style.padding = "4px 8px";
  label.style.textAlign = "center";
  label.style.fontSize = "11px";
  label.style.fontWeight = "600";
  label.style.lineHeight = "1.25";
  label.style.color = "#36393f";
  label.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.12)";

  wrapper.appendChild(iconImage);
  wrapper.appendChild(label);

  if (pin.href) {
    wrapper.addEventListener("click", () => {
      window.location.assign(pin.href!);
    });
  }

  return wrapper;
}
