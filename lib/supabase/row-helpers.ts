/**
 * Supabase DB row 파싱을 위한 내부 유틸 함수 모음.
 * lib/*-data.ts 파일에서만 사용합니다.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readString(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "string") {
    throw new Error(`[${scope}] Expected "${key}" to be a string`);
  }

  return value;
}

export function readNullableString(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`[${scope}] Expected "${key}" to be a string or null`);
  }

  return value;
}

export function readNumber(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`[${scope}] Expected "${key}" to be a number`);
  }

  return value;
}

export function readNullableNumber(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`[${scope}] Expected "${key}" to be a number or null`);
  }

  return value;
}

export function readNullableFloat(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  throw new Error(`[${scope}] Expected "${key}" to be a numeric value or null`);
}

export function readBoolean(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (typeof value !== "boolean") {
    throw new Error(`[${scope}] Expected "${key}" to be a boolean`);
  }

  return value;
}

export function readStringArrayOrNull(row: Record<string, unknown>, key: string, scope: string) {
  const value = row[key];

  if (value == null) {
    return null;
  }

  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`[${scope}] Expected "${key}" to be a string array or null`);
  }

  return value;
}

export function readStatus(row: Record<string, unknown>, key: string, scope: string): "active" | "reserved" | "sold" {
  const value = row[key];

  if (value === "active" || value === "reserved" || value === "sold") {
    return value;
  }

  throw new Error(`[${scope}] Expected "${key}" to be a valid item status`);
}

export function readSenderRole(row: Record<string, unknown>, key: string, scope: string): "buyer" | "seller" {
  const value = row[key];

  if (value === "buyer" || value === "seller") {
    return value;
  }

  throw new Error(`[${scope}] Expected "${key}" to be a valid sender role`);
}

export function parseRows<T>(values: unknown[], scope: string, parser: (value: unknown, rowScope: string) => T) {
  return values.map((value, index) => parser(value, `${scope}[${index}]`));
}

export function logSupabaseFallback(scope: string, error: unknown) {
  console.warn(`[supabase-fallback:${scope}]`, error);
}
