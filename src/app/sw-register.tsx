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
          reg.addEventListener?.("updatefound", () => {});

          // Segurança: desregistrar qualquer Service Worker antigo que não seja o nosso /sw.js
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            const ours = new URL("/sw.js", location.origin).toString();
            await Promise.all(
              regs.map(async (r) => {
                const urls = [
                  r.active?.scriptURL,
                  r.waiting?.scriptURL,
                  r.installing?.scriptURL,
                ].filter(Boolean) as string[];
                const isOurs = urls.some((u) => u === ours);
                if (!isOurs) {
                  try {
                    await r.unregister();
                  } catch {}
                }
              }),
            );
          } catch {}
        } catch (err) {
          console.warn("Service worker registration failed", err);
        }
      };
      register();
    }
  }, []);

  return null;
}
