"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

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

export default function JantarSlideshowPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const kenBurnsKey = useRef(0);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch("/api/jantar-photos");
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
            Nossos momentos{" "}
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
            <p className="mb-2 text-2xl font-light text-white/80">
              Aguardando fotos...
            </p>
          </div>
        </div>
      ) : isDemo ? (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center animate-slide-fade-in">
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
                className="h-full w-full object-contain animate-ken-burns"
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
    </div>
  );
}
