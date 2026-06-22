"use client";

import { useState } from "react";
import { TopBar } from "./TopBar";
import { MobileSheet } from "./MobileSheet";
import { BottomTabBar } from "./BottomTabBar";

export function ShellClient() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <TopBar onMenuOpen={() => setMobileOpen(true)} />
      <MobileSheet isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <BottomTabBar onMoreOpen={() => setMobileOpen(true)} />
    </>
  );
}
