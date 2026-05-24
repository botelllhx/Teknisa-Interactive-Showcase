"use client";

import { useEffect, useState } from "react";

/**
 * v13.20 — ULTRAREVIEW da responsividade.
 *
 * Cliente: "antes tinhamos tudo bem grande e sendo bem exibido… algumas
 * telas menores que outras… preciso de tamanhos reais".
 *
 * Decisão: REMOVER o auto-fit por altura (que comprimia tudo visualmente).
 * Manter scale APENAS quando a largura do monitor é menor que 1920.
 *
 * Comportamento:
 * - Monitor TV 1920×1080+:           scale = 1, render 1:1 nativo
 * - Monitor laptop 1600×900:         scale = 0.833 por largura
 * - Monitor laptop 1366×768:         scale = 0.711 por largura
 * - Monitor 1920×800 (chrome alto):  scale = 1, scroll vertical
 *
 * Em monitores menores em largura, escalamos por largura. Em monitores
 * com altura insuficiente, o page tem overflowY auto — usuário scrolla.
 * Antes (v13.18): escalava por altura também → tudo ficava menor que
 * o necessário.
 */
export function useViewportFit() {
  const TARGET_W = 1920;

  const [state, setState] = useState({
    scale: 1,
    offsetX: 0,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const s = Math.min(vw / TARGET_W, 1);
      const visualW = TARGET_W * s;
      setState({
        scale: s,
        offsetX: (vw - visualW) / 2,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    scale: state.scale,
    offsetX: state.offsetX,
    width: TARGET_W,
  };
}
