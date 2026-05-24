"use client";

import { useEffect, useState } from "react";

/**
 * v13.15 — auto-fit-to-viewport.
 *
 * O showcase foi desenhado pra rodar em TV touch 1920×1080. Em monitores
 * menores (laptops, desktops 1366/1600), companions e elementos extras
 * ficavam off-screen porque o layout assume 1920px de largura.
 *
 * Esse hook computa um scale factor para encolher TODO o conteúdo
 * mantendo aspect ratio, de modo que SEMPRE cabe no viewport real
 * (até em 1366×768) sem horizontal-scroll nem coisas vazando.
 *
 * Em TV 1920×1080 ou maior, retorna scale = 1 (sem redução).
 *
 * Uso:
 *   const { scale, width, height } = useViewportFit();
 *   <div style={{ width, height, transform: `scale(${scale})`,
 *                 transformOrigin: "top left" }}>
 *     ...
 *   </div>
 */
export function useViewportFit() {
  const TARGET_W = 1920;
  const TARGET_H = 1080;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / TARGET_W;
      const scaleY = vh / TARGET_H;
      // Use the smaller scale to ensure both axes fit. Never up-scale (max 1).
      const s = Math.min(scaleX, scaleY, 1);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { scale, width: TARGET_W, height: TARGET_H };
}
