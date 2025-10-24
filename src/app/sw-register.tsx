"use client";

import { useEffect } from "react";

export default function SWRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");
          // Optional: listen for updates
          reg.addEventListener?.("updatefound", () => {
          });
        } catch (err) {
          console.warn("Service worker registration failed", err);
        }
      };
      register();
    }
  }, []);

  return null;
}
