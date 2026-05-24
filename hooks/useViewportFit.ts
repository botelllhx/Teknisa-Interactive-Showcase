"use client";

import { useEffect, useState } from "react";

/**
 * v13.16 — auto-fit-to-viewport, fix do bug "espaço gigantesco na direita".
 *
 * Antes (v13.15): scale = min(vw/1920, vh/1080). Quando o viewport é mais
 * "baixo" que 16:9 (laptop com browser chrome comendo altura), o scale era
 * limitado pela ALTURA, fazendo a largura visual ser MENOR que o viewport
 * → espaço vazio na direita.
 *
 * Agora: scale APENAS por largura. Se a altura do conteúdo escalado for
 * maior que o viewport, scroll vertical. Nunca scroll horizontal.
 */
export function useViewportFit() {
  const TARGET_W = 1920;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const s = Math.min(vw / TARGET_W, 1);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { scale, width: TARGET_W };
}
