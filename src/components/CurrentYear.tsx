"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * With Cache Components, reading `new Date()` during prerender is a build
 * error. The server snapshot is empty; the year is filled in on hydration.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span>{year}</span>;
}
