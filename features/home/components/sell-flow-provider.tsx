"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  emptySellFlowDraft,
  isSellFlowReady,
  normalizeSellPriceInput,
  SELL_FLOW_MAX_PHOTOS,
  SELL_FLOW_STORAGE_KEY,
  type SellFlowDraft,
  type SellLocation,
  type SellTradeType,
} from "@/lib/sell-flow";

type SellFlowContextValue = {
  draft: SellFlowDraft;
  hydrated: boolean;
  isReadyToSubmit: boolean;
  togglePhoto: (photo: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTradeType: (tradeType: SellTradeType) => void;
  setPriceText: (priceText: string) => void;
  setAcceptPriceSuggestion: (acceptPriceSuggestion: boolean) => void;
  setLocation: (location: SellLocation | null) => void;
  resetDraft: () => void;
};

const SellFlowContext = createContext<SellFlowContextValue | null>(null);

function parseStoredDraft(value: string | null): SellFlowDraft | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed !== "object" || parsed == null) {
      return null;
    }

    const nextDraft = emptySellFlowDraft();

    nextDraft.photos = Array.isArray(parsed.photos)
      ? parsed.photos.filter((photo): photo is string => typeof photo === "string").slice(0, SELL_FLOW_MAX_PHOTOS)
      : [];
    nextDraft.title = typeof parsed.title === "string" ? parsed.title : "";
    nextDraft.description = typeof parsed.description === "string" ? parsed.description : "";
    nextDraft.tradeType = parsed.tradeType === "sell" || parsed.tradeType === "share" ? parsed.tradeType : null;
    nextDraft.priceText = typeof parsed.priceText === "string" ? normalizeSellPriceInput(parsed.priceText) : "";
    nextDraft.acceptPriceSuggestion = parsed.acceptPriceSuggestion === true;
    nextDraft.location =
      typeof parsed.location === "object"
      && parsed.location != null
      && typeof parsed.location.label === "string"
      && typeof parsed.location.address === "string"
      && typeof parsed.location.lat === "number"
      && typeof parsed.location.lng === "number"
      && typeof parsed.location.distanceLabel === "string"
        ? {
            label: parsed.location.label,
            address: parsed.location.address,
            lat: parsed.location.lat,
            lng: parsed.location.lng,
            distanceLabel: parsed.location.distanceLabel,
          }
        : null;

    return nextDraft;
  } catch {
    return null;
  }
}

export function SellFlowProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SellFlowDraft>(emptySellFlowDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem(SELL_FLOW_STORAGE_KEY) : null;
    const parsed = parseStoredDraft(stored);

    if (parsed) {
      setDraft(parsed);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(SELL_FLOW_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const value = useMemo<SellFlowContextValue>(() => ({
    draft,
    hydrated,
    isReadyToSubmit: isSellFlowReady(draft),
    togglePhoto: (photo) => {
      setDraft((current) => {
        const exists = current.photos.includes(photo);

        if (exists) {
          return {
            ...current,
            photos: current.photos.filter((currentPhoto) => currentPhoto !== photo),
          };
        }

        if (current.photos.length >= SELL_FLOW_MAX_PHOTOS) {
          return current;
        }

        return {
          ...current,
          photos: [...current.photos, photo],
        };
      });
    },
    setTitle: (title) => {
      setDraft((current) => ({ ...current, title }));
    },
    setDescription: (description) => {
      setDraft((current) => ({ ...current, description }));
    },
    setTradeType: (tradeType) => {
      setDraft((current) => ({ ...current, tradeType }));
    },
    setPriceText: (priceText) => {
      setDraft((current) => ({ ...current, priceText: normalizeSellPriceInput(priceText) }));
    },
    setAcceptPriceSuggestion: (acceptPriceSuggestion) => {
      setDraft((current) => ({ ...current, acceptPriceSuggestion }));
    },
    setLocation: (location) => {
      setDraft((current) => ({ ...current, location }));
    },
    resetDraft: () => {
      const nextDraft = emptySellFlowDraft();
      setDraft(nextDraft);

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SELL_FLOW_STORAGE_KEY);
      }
    },
  }), [draft, hydrated]);

  return <SellFlowContext.Provider value={value}>{children}</SellFlowContext.Provider>;
}

export function useSellFlow() {
  const context = useContext(SellFlowContext);

  if (!context) {
    throw new Error("useSellFlow must be used within SellFlowProvider");
  }

  return context;
}
