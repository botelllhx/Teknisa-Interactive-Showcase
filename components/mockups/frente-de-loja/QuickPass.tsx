"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  X,
  Edit3,
  Trash2,
  Plus,
  QrCode,
  Lock,
  ChevronLeft as Back,
  ChevronRight as Fwd,
  Share,
  BookOpen as Library,
  Copy,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  Type as Aa,
} from "lucide-react";

interface QuickPassProps {
  step: number;
}

// QuickPass is a mobile WEB APP (runs inside Safari). We frame each screen
// with the iOS status bar + Safari URL bar at the bottom per the references.

export function QuickPassMockup({ step }: QuickPassProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <StatusBar />
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 0 && <QrScannerView key="scan" />}
          {step === 1 && <ScannedItemView key="scanned" />}
          {step === 2 && <CartView key="cart" />}
          {step === 3 && <PixPaymentView key="pix" />}
          {step >= 4 && <CompraConcluidaView key="done" />}
        </AnimatePresence>
      </main>
      <SafariBottomBar />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-1.5 pb-1">
      <span className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
        09:41
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <span className="text-[10px] font-bold tracking-wide">5G</span>
        <span className="text-[10px] tabular-nums">94%</span>
      </div>
    </div>
  );
}

function AppHeader({ withMenu = true }: { withMenu?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
      <Image
        src="/logo-teknisa.svg"
        alt="Teknisa"
        width={42}
        height={8}
        className="select-none"
      />
      <div className="flex items-center gap-1.5">
        <span className="font-display text-[11px] font-bold italic text-neutral-800">
          HELL&apos;S
        </span>
        <span className="font-display text-[11px] font-bold tracking-wider text-neutral-900">
          BURGERS
        </span>
      </div>
      {withMenu ? (
        <button className="text-neutral-400">
          <MoreVertical size={14} strokeWidth={2.25} />
        </button>
      ) : (
        <span className="w-3.5" />
      )}
    </div>
  );
}

function QrScannerView() {
  return (
    <motion.div
      data-tour="qp-login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button className="text-brand">
          <X size={18} strokeWidth={2.25} />
        </button>
        <h1 className="font-display text-[16px] font-bold text-brand">
          Escanear QR Code
        </h1>
      </div>

      <div className="relative flex-1 overflow-hidden bg-[#222]">
        <div className="absolute inset-0 flex items-center justify-center">
          <ScannerFrame />
        </div>
      </div>
    </motion.div>
  );
}

function ScannedItemView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <button className="text-brand">
          <X size={18} strokeWidth={2.25} />
        </button>
        <h1 className="font-display text-[16px] font-bold text-brand">
          Escanear QR Code
        </h1>
      </div>

      <div className="relative flex-1 overflow-hidden bg-[#222]">
        <div className="absolute inset-0 flex items-center justify-center">
          <ScannerFrame />
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-frame"
        >
          <div
            className="h-10 w-10 flex-none rounded-md bg-gradient-to-br from-red-500 via-red-600 to-red-800"
            aria-hidden
          />
          <div className="flex-1">
            <p className="font-display text-[11px] font-bold text-neutral-900">
              Coca Cola Zero LT 350ml
            </p>
            <p className="font-display text-[14px] font-bold text-neutral-900">
              R$ 7,00
            </p>
          </div>
          <motion.button
            data-tour="qp-balance"
            whileTap={{ scale: 0.94 }}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-success text-white shadow-brand"
          >
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ScannerFrame() {
  return (
    <div className="relative h-56 w-56">
      {/* Corner brackets */}
      <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-white" />
      <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-white" />
      <span className="absolute left-0 bottom-0 h-8 w-8 border-l-2 border-b-2 border-white" />
      <span className="absolute right-0 bottom-0 h-8 w-8 border-r-2 border-b-2 border-white" />

      {/* QR Code placeholder */}
      <div className="absolute inset-4 flex items-center justify-center rounded bg-white p-3">
        <QrCode size={130} strokeWidth={0.5} className="text-neutral-900" />
      </div>
    </div>
  );
}

function CartView() {
  return (
    <motion.div
      data-tour="qp-restaurant"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader />

      <div className="flex-1 overflow-y-auto">
        <h1 className="px-4 pt-3 font-display text-[18px] font-bold text-brand">
          Carrinho
        </h1>

        <div className="mt-3 space-y-3 px-4">
          <div className="flex items-start gap-3 border-b border-neutral-100 pb-3">
            <div
              className="h-12 w-12 flex-none rounded-md bg-gradient-to-br from-red-500 via-red-600 to-red-800"
              aria-hidden
            />
            <div className="flex-1">
              <p className="font-display text-[12px] font-medium text-neutral-700">
                Coca Cola Zero LT 350ml
              </p>
              <button className="mt-1 flex items-center gap-1 rounded-md bg-[#eef0f7] px-2 py-0.5 text-[10px] font-medium text-neutral-700">
                <Edit3 size={9} strokeWidth={2.25} />
                Editar
              </button>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="font-display text-[14px] font-bold text-brand">
                R$ 7,00
              </span>
              <div className="flex items-center gap-1.5">
                <button className="text-neutral-400">
                  <Trash2 size={12} strokeWidth={2} />
                </button>
                <span className="w-3 text-center font-display text-[12px] font-bold">
                  1
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded bg-[#dee3f2] text-brand">
                  <Plus size={11} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2 px-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-[12px] font-bold text-neutral-700">
              Descontos
            </span>
            <button className="text-[11px] font-bold text-brand underline">
              Adicionar cupom
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display text-[12px] font-bold text-neutral-700">
              Subtotal
            </span>
            <span className="font-display text-[12px] font-bold text-brand">
              R$ 7,00
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 bg-white px-4 py-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-600">
            <span>Descontos:</span>
            <span className="font-mono tabular-nums">R$ 00,00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display text-[13px] font-bold text-neutral-800">
              Total a pagar:
            </span>
            <span className="font-display text-[15px] font-bold text-brand tabular-nums">
              R$ 7,00
            </span>
          </div>
        </div>
        <button
          type="button"
          data-tour="qp-access"
          className="mt-2 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
        >
          Finalizar Compra
        </button>
        <button
          type="button"
          className="mt-1.5 w-full rounded-md border border-brand bg-white py-2 text-center font-display text-[11px] font-bold text-brand"
        >
          Continuar Comprando
        </button>
      </div>
    </motion.div>
  );
}

function PixPaymentView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader />

      <div className="flex items-center gap-1 px-4 py-2.5">
        <button className="text-brand">
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <h1 className="font-display text-[16px] font-bold text-brand">
          Pagamento
        </h1>
      </div>

      <div className="bg-[#eef0f7] px-4 py-2.5">
        <p className="font-display text-[15px] font-bold text-brand">
          Forma de Pagamento
        </p>
        <p className="text-[10px] text-neutral-500">
          Selecione uma forma de pagamento
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-neutral-200">
        <button className="py-3 text-center font-display text-[12px] font-bold text-neutral-500">
          Cartão
        </button>
        <button
          data-tour="qp-updated"
          className="border-b-2 border-brand py-3 text-center font-display text-[12px] font-bold text-brand"
        >
          Pix
        </button>
      </div>

      <div className="bg-[#eef0f7] px-4 py-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-600">Subtotal:</span>
          <span className="font-mono tabular-nums">R$ 50,00</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-[13px] font-bold text-brand">
            Total do pedido:
          </span>
          <span className="font-display text-[14px] font-bold text-brand tabular-nums">
            R$ 50,00
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 py-4">
        <button
          type="button"
          className="w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
        >
          Copiar código Pix
        </button>

        <div className="mx-auto mt-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white">
          <QrCode size={150} strokeWidth={0.5} className="text-neutral-900" />
        </div>
      </div>
    </motion.div>
  );
}

function CompraConcluidaView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      <AppHeader />

      <div className="flex items-center gap-1 px-4 py-2.5">
        <button className="text-brand">
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <h1 className="font-display text-[16px] font-bold text-brand">
          Compra concluída
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="rounded-lg bg-[#e8f3d8] p-4"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2
              size={18}
              strokeWidth={2}
              className="text-success"
            />
            <div>
              <p className="font-display text-[13px] font-bold text-success">
                Agradecemos pela sua compra
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
                Você poderá evitar filas no estádio e resgatar seus produtos
                com mais facilidade.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-600">
                O cupom fiscal será enviado para o seu e-mail.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 rounded-lg bg-[#eef0f7] p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 flex-none items-center justify-center rounded-md bg-white p-1.5">
              <QrCode
                size={48}
                strokeWidth={0.5}
                className="text-neutral-900"
              />
            </div>
            <div className="flex-1">
              <p className="font-display text-[14px] font-bold text-brand">
                Pedido #320108
              </p>
              <p className="mt-0.5 text-[11px] text-neutral-600">
                <span>Válido até: </span>
                <span className="font-display font-bold text-neutral-900">
                  19/05/2025 17:00
                </span>
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1.5 text-[10px] font-bold text-white"
              >
                Enviar cupom fiscal por e-mail
                <ExternalLink size={10} strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </div>

        <button className="mt-3 block w-full text-center font-display text-[12px] font-bold text-brand underline">
          Ver todos os pedidos
        </button>

        <button
          type="button"
          className="mt-3 w-full rounded-md bg-brand py-2.5 text-center font-display text-[12px] font-bold text-white shadow-brand"
        >
          Comprar novamente
        </button>
      </div>
    </motion.div>
  );
}

function SafariBottomBar() {
  return (
    <div className="border-t border-neutral-200 bg-[#f5f5f7]">
      <div className="mx-3 my-1.5 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <span className="font-display text-[11px] font-bold text-neutral-500">
          <Aa size={13} strokeWidth={2.25} />
        </span>
        <span className="text-neutral-400">
          <Lock size={10} strokeWidth={2.25} />
        </span>
        <span className="flex-1 text-center text-[11px] text-neutral-700">
          quickpass.teknisa.com
        </span>
        <span className="text-neutral-400">
          <Copy size={11} strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex items-center justify-around px-4 pb-2 text-[#007aff]">
        <button>
          <Back size={18} strokeWidth={2} />
        </button>
        <button className="opacity-40">
          <Fwd size={18} strokeWidth={2} />
        </button>
        <button>
          <Share size={16} strokeWidth={2} />
        </button>
        <button>
          <Library size={16} strokeWidth={2} />
        </button>
        <button>
          <span className="grid h-4 w-4 grid-cols-2 gap-px">
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
          </span>
        </button>
      </div>
    </div>
  );
}
