"use client";

import { useEffect, useState } from "react";

/**
 * v13.18 — auto-fit corrigido: bounding box bate com visual content.
 *
 * Bug da v13.17: usava `transformOrigin: center center` num main com
 * width:1920 height:1080. O CSS transform NÃO muda o bounding box —
 * ele continua 1920×1080 mesmo escalado. Com flex center no parent, o
 * box virtual era centralizado, mas como ele era MAIOR que o viewport,
 * suas bordas ficavam fora da view → os filhos do topo (header) caíam
 * ACIMA do viewport e ficavam cortados (a queixa "header cortado").
 *
 * Fix: main vira position:absolute, transform-origin:top left,
 * e nós calculamos `offsetX` e `offsetY` para posicionar o canto
 * top-left do CONTEÚDO VISUAL (não do bounding box) onde queremos
 * — centralizado no viewport. Resultado: header sempre visível,
 * margens balanceadas, zero crop em qualquer monitor.
 */
export function useViewportFit() {
  const TARGET_W = 1920;
  const TARGET_H = 1080;

  const [state, setState] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    vw: TARGET_W,
    vh: TARGET_H,
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
        vw,
        vh,
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
