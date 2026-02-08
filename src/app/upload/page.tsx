"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Por favor, selecione apenas arquivos de imagem" });
        return;
      }
      setSelectedFile(file);
      setMessage(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setMessage({ type: "error", text: "Erro ao carregar preview da imagem" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Nenhum arquivo selecionado" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: "success", 
          text: `Foto "${data.file.name}" enviada com sucesso! ✅` 
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || "Erro ao enviar foto" 
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ 
        type: "error", 
        text: "Erro ao conectar com o servidor" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdf6f0] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <h1 className="mb-2 text-3xl font-bold text-amber-900">
            Enviar Foto
          </h1>
          <p className="text-amber-700">
            Compartilhe suas fotos do casamento
          </p>
        </div>

        {/* Upload Form */}
        <div className="rounded-2xl border border-amber-700/20 bg-white p-6 shadow-md">
          {/* File Input */}
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-amber-700/30 p-8 text-center transition hover:border-amber-700/50 hover:bg-amber-50/50"
            >
              {previewUrl ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg object-contain"
                  />
                  <p className="text-sm text-amber-700">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs text-amber-600">
                    Clique para escolher outra foto
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-4xl">📷</div>
                  <p className="font-medium text-amber-800">
                    Clique para selecionar uma foto
                  </p>
                  <p className="text-sm text-amber-600">
                    ou arraste e solte aqui
                  </p>
                </div>
              )}
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full rounded-lg bg-amber-800 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-900 disabled:cursor-not-allowed disabled:bg-amber-700/50"
          >
            {uploading ? "Enviando..." : "Enviar Foto"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 rounded-lg p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-amber-800/10 px-6 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-800/20"
          >
            ← Início
          </Link>
          <Link
            href="/slideshow"
            className="rounded-full bg-amber-800/10 px-6 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-800/20"
          >
            Ver Slideshow →
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg border border-amber-700/20 bg-amber-50/50 p-4 text-center">
          <p className="text-xs text-amber-700">
            ℹ️ As fotos enviadas aparecerão automaticamente no slideshow
          </p>
        </div>
      </div>
    </div>
  );
}
