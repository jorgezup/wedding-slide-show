"use client";

import { QRCodeSVG } from "qrcode.react";

const GOOGLE_DRIVE_SHARE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL ||
  "https://drive.google.com/drive/folders/YOUR_FOLDER_ID";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdf6f0] px-4 py-12">
      {/* Wedding Photo */}
      <div className="mb-8 h-64 w-64 overflow-hidden rounded-full border-4 border-amber-700/30 shadow-lg sm:h-80 sm:w-80">
        <div className="flex h-full w-full items-center justify-center bg-amber-100 text-6xl">
          💍
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-amber-900 sm:text-5xl md:text-6xl">
        Eiva e Jorge
      </h1>
      <p className="mb-8 text-center text-2xl font-light text-amber-700 sm:text-3xl">
        14/02/2026
      </p>

      {/* Divider */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px w-16 bg-amber-700/30" />
        <span className="text-amber-700/50">♥</span>
        <div className="h-px w-16 bg-amber-700/30" />
      </div>

      {/* Description */}
      <p className="mb-10 max-w-md text-center text-lg text-amber-800 sm:text-xl">
        Compartilhe sua foto conosco
      </p>

      {/* QR Code */}
      <div className="mb-6 rounded-2xl border border-amber-700/20 bg-white p-6 shadow-md">
        <QRCodeSVG
          value={GOOGLE_DRIVE_SHARE_URL}
          size={200}
          level="H"
          fgColor="#78350f"
          bgColor="#ffffff"
        />
      </div>

      <p className="mb-12 max-w-sm text-center text-sm text-amber-600">
        Escaneie o QR Code para enviar suas fotos do casamento
      </p>

      {/* Link to slideshow */}
      <a
        href="/slideshow"
        className="rounded-full bg-amber-800 px-8 py-3 text-lg font-medium text-white shadow transition-colors hover:bg-amber-900"
      >
        Ver Slideshow
      </a>
    </div>
  );
}
