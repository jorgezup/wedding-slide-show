"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

interface Photo {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  demo?: boolean;
}

const POLL_INTERVAL = 15000; // Poll every 15 seconds for new photos
const SLIDE_DURATION = 6000; // Each slide shows for 6 seconds
const GOOGLE_DRIVE_SHARE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL ||
  "https://drive.google.com/drive/folders/YOUR_FOLDER_ID";

export default function SlideshowPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(true);

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

  // Initial fetch and polling for new photos
  useEffect(() => {
    fetchPhotos();
    const pollInterval = setInterval(fetchPhotos, POLL_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [fetchPhotos]);

  // Auto-advance slideshow
  useEffect(() => {
    if (photos.length <= 1) return;

    const slideInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
        setIsTransitioning(false);
      }, 1000);
    }, SLIDE_DURATION);

    return () => clearInterval(slideInterval);
  }, [photos.length]);

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
  const isDemo = currentPhoto?.demo;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light text-white/90">
            Eiva e Jorge{" "}
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
          <div
            className={`text-center transition-opacity duration-1000 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
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
          {/* Photo counter */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-sm text-white/40">
              {currentIndex + 1} / {photos.length} (Modo Demo)
            </p>
            <div className="mx-auto mt-3 flex justify-center gap-2">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white/80" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div
            className={`relative h-screen w-full transition-opacity duration-1000 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto.thumbnailUrl}
              alt={currentPhoto.name}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Photo name overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-end justify-between">
              <p className="text-sm text-white/40">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
            <div className="mx-auto mt-3 flex max-w-md justify-center gap-1.5">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white/80" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
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
