"use client";

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => {
          getLat: () => number;
          getLng: () => number;
        };
        Size: new (width: number, height: number) => unknown;
        Point: new (x: number, y: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: {
            center: unknown;
            level: number;
            draggable?: boolean;
            scrollwheel?: boolean;
            disableDoubleClick?: boolean;
          },
        ) => {
          getCenter: () => {
            getLat: () => number;
            getLng: () => number;
          };
          setCenter: (latlng: unknown) => void;
          setDraggable: (draggable: boolean) => void;
          setZoomable: (zoomable: boolean) => void;
        };
        MarkerImage: new (src: string, size: unknown, options?: { offset?: unknown }) => unknown;
        Marker: new (options: {
          position: unknown;
          image?: unknown;
          map?: unknown;
          title?: string;
        }) => {
          setMap: (map: unknown) => void;
          setPosition: (position: unknown) => void;
        };
        CustomOverlay: new (options: {
          position: unknown;
          content: HTMLElement | string;
          xAnchor?: number;
          yAnchor?: number;
          zIndex?: number;
          map?: unknown;
        }) => {
          setMap: (map: unknown) => void;
        };
        event: {
          addListener: (target: unknown, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

let kakaoMapsPromise: Promise<NonNullable<Window["kakao"]>> | null = null;

export function loadKakaoMapsSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps can only load in the browser."));
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;

  if (!appKey) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_KAKAO_MAP_JS_KEY."));
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("kakao-maps-sdk") as HTMLScriptElement | null;

    const handleLoad = () => {
      if (!window.kakao?.maps) {
        reject(new Error("Kakao Maps SDK did not initialize."));
        return;
      }

      window.kakao.maps.load(() => {
        if (window.kakao) {
          resolve(window.kakao);
          return;
        }

        reject(new Error("Kakao Maps SDK is unavailable after load."));
      });
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Kakao Maps SDK.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load Kakao Maps SDK.")), { once: true });
    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}
