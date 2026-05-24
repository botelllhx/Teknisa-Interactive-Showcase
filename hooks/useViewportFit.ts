"use client";

import { useEffect, useState } from "react";

/**
 * v13.21 — scale fit nos DOIS eixos (largura E altura), nunca scroll.
 *
 * Cliente reportou: v13.20 ficou tamanho bom MAS agora vaza vertical
 * e precisa scrollar. Solução: usar min(vw/1920, vh/1080, 1) pra
 * SEMPRE caber em 100vh × 100vw. Canonical sizes dos devices ficam
 * grandes (940 mobile etc), então mesmo com scale 0.9 o mockup
 * continua com presença visual.
 *
 * - Monitor 1920×1080:                scale=1, offset=(0,0)
 * - Monitor 1920×980 (chrome):        scale=0.907, offsetX=89
 * - Monitor 1600×900:                 scale=0.833, offsetX=0
 * - Monitor 1366×768:                 scale=0.711, offsetX=0
 *
 * Resultado: NUNCA scroll horizontal nem vertical. Conteúdo sempre
 * centralizado se ratios diferentes do 16:9.
 */
export function useViewportFit() {
  const TARGET_W = 1920;
  const TARGET_H = 1080;

  const [state, setState] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / TARGET_W, vh / TARGET_H, 1);
      const visualW = TARGET_W * s;
      const visualH = TARGET_H * s;
      setState({
        scale: s,
        offsetX: (vw - visualW) / 2,
        offsetY: (vh - visualH) / 2,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    scale: state.scale,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    width: TARGET_W,
    height: TARGET_H,
  };
}
