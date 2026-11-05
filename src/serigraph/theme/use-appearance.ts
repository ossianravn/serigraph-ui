"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  APPEARANCE_ATTRIBUTES,
  apply,
  current,
  defaultAppearance,
  save,
  type Appearance,
} from "./appearance"

let cache: { key: string; value: Appearance } | undefined

function snapshot(): Appearance {
  const value = current()
  const key = JSON.stringify(value)
  if (cache?.key !== key) cache = { key, value }
  return cache.value
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: APPEARANCE_ATTRIBUTES,
  })
  return () => observer.disconnect()
}

/** The document's appearance and a setter that applies and saves a change. Server renders use the defaults. */
export function useAppearance(defaults: Appearance = defaultAppearance) {
  const appearance = useSyncExternalStore(subscribe, snapshot, () => defaults)
  const update = useCallback((change: Partial<Appearance>) => {
    const next = { ...current(), ...change }
    apply(next)
    save(next)
  }, [])
  return [appearance, update] as const
}
