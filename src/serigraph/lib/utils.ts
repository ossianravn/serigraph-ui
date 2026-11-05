import { createCn } from "cn/config"

// Class merging that knows Serigraph's theme. Without this, cn reads `text-small` or `text-lead` as a text colour and
// drops it when a colour class such as `text-ink` follows; the same goes for the φ spacing names and the faces.
// Every kit component imports cn from here, not from "cn".
export const cn = createCn({
  extend: {
    theme: {
      text: ["small", "body", "lead", "h2", "h1", "title", "display"],
      leading: ["small", "body", "lead", "h2", "h1", "title", "display", "ui"],
      spacing: [
        "hair",
        "tight",
        "snug",
        "line",
        "section",
        "page",
        "control",
        "control-compact",
      ],
      font: ["read", "sans", "mono"],
      radius: ["plane", "box"],
    },
  },
})
