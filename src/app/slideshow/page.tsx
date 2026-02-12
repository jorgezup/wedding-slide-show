"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  demo?: boolean;
}

const POLL_INTERVAL = 15000;
const SLIDE_DURATION = 6000;
const TRANSITION_DURATION = 1200;
const GOOGLE_DRIVE_SHARE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL ||
  "https://drive.google.com/drive/folders/YOUR_FOLDER_ID";

export default function SlideshowPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(true);
  const kenBurnsKey = useRef(0);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch("/api/photos");
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setPhotos(data.photos);
        setError(data.error || null);
      }
    } catch (err) {
      console.error("Error fetching photos:", err);
      setError("Erro ao carregar fotos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
    const pollInterval = setInterval(fetchPhotos, POLL_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [fetchPhotos]);

  // Auto-advance slideshow with crossfade
  useEffect(() => {
    if (photos.length <= 1) return;

    let swapTimeout: NodeJS.Timeout;

    const slideInterval = setInterval(() => {
      const next = (currentIndex + 1) % photos.length;
      setNextIndex(next);

      // After transition completes, swap
      swapTimeout = setTimeout(() => {
        kenBurnsKey.current += 1;
        setCurrentIndex(next);
        setNextIndex(null);
      }, TRANSITION_DURATION);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(slideInterval);
      clearTimeout(swapTimeout);
    };
  }, [photos.length, currentIndex]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-6xl">💍</div>
          <p className="text-xl text-white/70">Carregando fotos...</p>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const nextPhoto = nextIndex !== null ? photos[nextIndex] : null;
  const isDemo = currentPhoto?.demo;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-transparent p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light text-white/90">
            Casamento Eiva e Jorge{" "}
            <span className="text-white/60">• 14/02/2026</span>
          </h1>
          <Link
            href="/"
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/20"
          >
            ← Início
          </Link>
        </div>
      </div>

      {/* Photo display */}
      {photos.length === 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <div className="mb-6 text-8xl">📷</div>
            <p className="mb-2 text-2xl font-light text-white/80">
              Aguardando fotos...
            </p>
            <p className="text-lg text-white/50">
              Escaneie o QR Code na tela inicial para compartilhar suas fotos
            </p>
          </div>
        </div>
      ) : isDemo ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center animate-slide-fade-in">
            <div className="mb-6 text-8xl">
              {currentIndex === 0 ? "📸" : currentIndex === 1 ? "💒" : "🥂"}
            </div>
            <p className="mb-2 text-2xl font-light text-white/80">
              {currentPhoto.name}
            </p>
            <p className="text-lg text-white/50">
              Configure as credenciais do Google Drive para exibir fotos reais
            </p>
          </div>
        </div>
      ) : (
        <div className="relative h-screen w-full">
          {/* Current photo (base layer) */}
          <div
            key={`current-${currentIndex}-${kenBurnsKey.current}`}
            className="absolute inset-0 animate-ken-burns"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto.thumbnailUrl}
              alt={currentPhoto.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Next photo (crossfade layer) */}
          {nextPhoto && (
            <div
              key={`next-${nextIndex}`}
              className="absolute inset-0 animate-slide-fade-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nextPhoto.thumbnailUrl}
                alt={nextPhoto.name}
                className="h-full w-full object-cover animate-ken-burns"
              />
            </div>
          )}

          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute top-20 right-6 z-10 rounded-lg bg-amber-900/80 px-4 py-2 text-sm text-amber-200 backdrop-blur">
          ⚠ {error}
        </div>
      )}

      {/* QR Code Modal - Small Bottom Right Corner */}
      {showQRModal && (
        <div className="absolute bottom-6 right-6 z-20">
          <div className="relative rounded-xl border border-white/20 bg-black/90 p-3 shadow-2xl backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-black hover:bg-white transition-colors shadow-lg"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* QR Code - Centered and Small */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center rounded-lg bg-white p-2 mb-2">
                <QRCodeSVG
                  value={GOOGLE_DRIVE_SHARE_URL}
                  size={100}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                  className="block"
                />
              </div>
              <p className="text-xs font-medium text-white/90 text-center">
                Compartilhe fotos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
