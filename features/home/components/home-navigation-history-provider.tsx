"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "karrot:home-navigation-history";

type HomeNavigationHistoryContextValue = {
  getPreviousPath: () => string | null;
};

const HomeNavigationHistoryContext = createContext<HomeNavigationHistoryContextValue | null>(null);

export function HomeNavigationHistoryProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedHistory = window.sessionStorage.getItem(STORAGE_KEY);

    if (!storedHistory) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(storedHistory);
      setHistory(Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : []);
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (isHomeTabPath(pathname)) {
      const currentPath = buildPath(pathname, searchParams);

      setHistory((previousHistory) => {
        if (previousHistory[previousHistory.length - 1] === currentPath) {
          return previousHistory;
        }

        return [...previousHistory, currentPath];
      });
      return;
    }

    if (isOtherTabPath(pathname)) {
      setHistory([]);
    }
  }, [isHydrated, pathname, searchParams]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (history.length === 0) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history, isHydrated]);

  const getPreviousPath = useCallback(() => {
    if (history.length <= 1) {
      return null;
    }

    const previousPath = history[history.length - 2];
    setHistory(history.slice(0, -1));
    return previousPath;
  }, [history]);

  const value = useMemo(
    () => ({
      getPreviousPath,
    }),
    [getPreviousPath],
  );

  return <HomeNavigationHistoryContext.Provider value={value}>{children}</HomeNavigationHistoryContext.Provider>;
}

export function useHomeNavigationHistory() {
  const context = useContext(HomeNavigationHistoryContext);

  if (!context) {
    return {
      getPreviousPath: () => null,
    };
  }

  return context;
}

function buildPath(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function isHomeTabPath(pathname: string) {
  return pathname === "/home" || /^\/home\/items\/[^/]+$/.test(pathname);
}

function isOtherTabPath(pathname: string) {
  return ["/community", "/town-map", "/chat", "/my-karrot"].some((tabPath) => pathname === tabPath || pathname.startsWith(`${tabPath}/`));
}
