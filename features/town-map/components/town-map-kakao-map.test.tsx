import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TownMapKakaoMap } from "@/features/town-map/components/town-map-kakao-map";

const trackEventMock = vi.hoisted(() => vi.fn());
const loadKakaoMapsSdkMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics/amplitude", () => ({
  trackEvent: trackEventMock,
}));

vi.mock("@/lib/kakao-maps", () => ({
  loadKakaoMapsSdk: loadKakaoMapsSdkMock,
}));

describe("TownMapKakaoMap", () => {
  it("tracks pan, zoom, and tap interactions as component_interacted", async () => {
    const handlers = new Map<string, (event?: { latLng?: { getLat: () => number; getLng: () => number } }) => void>();
    const mapInstance = {
      getCenter: () => ({
        getLat: () => 37.5,
        getLng: () => 127.03,
      }),
      getLevel: () => 4,
      getBounds: () => ({
        getSouthWest: () => ({
          getLat: () => 37.45,
          getLng: () => 126.98,
        }),
        getNorthEast: () => ({
          getLat: () => 37.55,
          getLng: () => 127.08,
        }),
      }),
      setCenter: vi.fn(),
      setDraggable: vi.fn(),
      setZoomable: vi.fn(),
    };

    function MapConstructor() {
      return mapInstance;
    }

    function CustomOverlayConstructor() {
      return {
        setMap: vi.fn(),
      };
    }

    const kakao = {
      maps: {
        LatLng: function LatLng(lat: number, lng: number) {
          return {
            getLat: () => lat,
            getLng: () => lng,
          };
        },
        Map: MapConstructor,
        CustomOverlay: CustomOverlayConstructor,
        event: {
          addListener: vi.fn((_: unknown, type: string, handler: (event?: { latLng?: { getLat: () => number; getLng: () => number } }) => void) => {
            handlers.set(type, handler);
          }),
        },
      },
    };

    loadKakaoMapsSdkMock.mockResolvedValue(kakao);

    render(
      <TownMapKakaoMap
        center={{ lat: 37.5, lng: 127.03 }}
        pins={[
          {
            href: "/town-map/businesses/pin-1",
            icon: "/pin.svg",
            id: "pin-1",
            label: "테스트 핀",
            lat: 37.5,
            lng: 127.03,
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(loadKakaoMapsSdkMock).toHaveBeenCalled();
      expect(handlers.has("dragend")).toBe(true);
      expect(handlers.has("zoom_changed")).toBe(true);
      expect(handlers.has("click")).toBe(true);
    });

    handlers.get("dragend")?.();

    expect(trackEventMock).toHaveBeenCalledWith("component_interacted", {
      component_name: "town_map_map",
      interaction_type: "pan",
      path: "/town-map",
      screen_name: "town_map",
      surface: "map",
    });

    handlers.get("zoom_changed")?.();

    expect(trackEventMock).toHaveBeenCalledWith("component_interacted", {
      component_name: "town_map_map",
      interaction_type: "zoom",
      path: "/town-map",
      screen_name: "town_map",
      surface: "map",
    });

    handlers.get("click")?.();

    expect(trackEventMock).toHaveBeenCalledWith("component_interacted", {
      component_name: "town_map_map",
      interaction_type: "tap",
      path: "/town-map",
      screen_name: "town_map",
      surface: "map",
    });
  });
});
