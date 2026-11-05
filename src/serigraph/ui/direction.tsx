"use client"

// Base UI's direction provider, unchanged: it tells menus, sliders, tabs and other primitives which way the page
// reads. Set `dir` on the same element so the layout mirrors with it; chevrons and arrows turn with `dir`.
export {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider"
