"use client";

import { useEffect, useState } from "react";

/**
 * v13.17 — auto-fit por LARGURA + ALTURA, centralizado.
 *
 * Cliente: "tenho que scrollar para ver, pq tem mt espaço em volta do
 * mockup, a ideia é sempre visualizar os 100vh da tela".
 *
 * Solução: scale = min(vw/1920, vh/1080, 1). Conteúdo SEMPRE cabe
 * no viewport sem scroll. Wrapper aplica flex center pra que o
 * eventual espaço sobrando (quando ratios não batem) fique balanceado
 * (top/bottom ou left/right), não tudo de um lado.
 *
 * Não use widht ou height isolados — qualquer um deles individualmente
 * obriga scroll no eixo limitado.
 */
export function useViewportFit() {
  const TARGET_W = 1920;
  const TARGET_H = 1080;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / TARGET_W, vh / TARGET_H, 1);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { scale, width: TARGET_W, height: TARGET_H };
}
