"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { X, Upload, Link2, ImageIcon, Loader2 } from "lucide-react";

interface Props {
  onInsert: (url: string) => void;
  onClose:  () => void;
}

type Tab = "upload" | "url";

export default function ImageUploadModal({ onInsert, onClose }: Props) {
  const [tab,        setTab]        = useState<Tab>("upload");
  const [url,        setUrl]        = useState("");
  const [dragging,   setDragging]   = useState(false);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [file,       setFile]       = useState<File | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const inputRef       = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.courses.generateImageUploadUrl);
  const saveImageUrl      = useMutation(api.courses.saveUploadedImage);

  /* ── File helpers ────────────────────────────────────────────────────────── */

  function acceptFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Only image files are supported (PNG, JPG, GIF, WebP).");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("Image must be under 8 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  }

  /* ── Upload ──────────────────────────────────────────────────────────────── */

  async function uploadAndInsert() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // 1. Get a short-lived upload URL from Convex storage
      const uploadUrl = await generateUploadUrl();

      // 2. PUT the file directly to Convex storage
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed — try again.");

      const { storageId } = await res.json();

      // 3. Exchange storageId for a permanent public URL
      const publicUrl = await saveImageUrl({ storageId });
      if (!publicUrl) throw new Error("Could not get image URL.");

      onInsert(publicUrl);
    } catch (err: any) {
      setError(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  /* ── URL insert ──────────────────────────────────────────────────────────── */

  function insertUrl() {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please enter a URL."); return; }
    try { new URL(trimmed); } catch { setError("Invalid URL."); return; }
    onInsert(trimmed);
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-(--border-subtle) bg-(--bg-elevated) shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-subtle) bg-(--bg-input)">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-(--brand-subtle) border border-(--brand-border) flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-(--brand)" />
            </div>
            <h2 className="text-sm font-semibold text-(--text-primary)">Insert Image</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-(--text-faint) hover:text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-px p-1.5 mx-5 mt-4 rounded-lg bg-(--bg-input) border border-(--border-subtle)">
          {(["upload", "url"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-(--bg-active) text-(--text-primary)"
                  : "text-(--text-muted) hover:text-(--text-secondary)"
              }`}
            >
              {t === "upload" ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
              {t === "upload" ? "Upload file" : "From URL"}
            </button>
          ))}
        </div>

        <div className="px-5 pb-5 pt-4 space-y-4">

          {/* ── Upload tab ── */}
          {tab === "upload" && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  dragging
                    ? "border-(--brand) bg-(--brand-subtle)"
                    : preview
                    ? "border-(--border-medium) bg-(--bg-hover)"
                    : "border-(--border-subtle) hover:border-(--border-medium) hover:bg-(--bg-hover)"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileInputChange}
                />

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      className="max-h-36 max-w-full rounded-lg object-contain border border-(--border-subtle)"
                    />
                    <p className="text-xs text-(--text-faint)">
                      {file?.name} · {((file?.size ?? 0) / 1024).toFixed(0)} KB
                    </p>
                    <p className="text-[10px] text-(--text-disabled)">Click or drop to replace</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-(--bg-hover) border border-(--border-subtle) flex items-center justify-center">
                      <Upload className="w-5 h-5 text-(--text-disabled)" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-(--text-secondary)">
                        {dragging ? "Drop it here!" : "Click or drag & drop"}
                      </p>
                      <p className="text-xs text-(--text-disabled) mt-0.5">PNG, JPG, GIF, WebP · max 8 MB</p>
                    </div>
                  </>
                )}
              </div>

              {/* Upload button */}
              <button
                onClick={uploadAndInsert}
                disabled={!file || uploading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</>
                ) : (
                  <><Upload className="w-4 h-4" />Insert image</>
                )}
              </button>
            </>
          )}

          {/* ── URL tab ── */}
          {tab === "url" && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-(--text-disabled) block">
                  Image URL
                </label>
                <input
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && insertUrl()}
                  placeholder="https://example.com/image.png"
                  autoFocus
                  className="w-full bg-(--bg-input) border border-(--border-subtle) rounded-lg px-3 py-2.5 text-sm text-(--text-secondary) placeholder:text-(--text-disabled) outline-none focus:border-(--brand-border) transition-colors"
                />
              </div>

              {/* Live preview */}
              {url && (
                <div className="flex items-center justify-center h-28 rounded-lg border border-(--border-subtle) bg-(--bg-hover) overflow-hidden">
                  <img
                    src={url}
                    alt="preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              <button
                onClick={insertUrl}
                disabled={!url.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-(--brand) hover:bg-(--brand-hover) text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Link2 className="w-4 h-4" />Insert image
              </button>
            </>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/15">
              <X className="w-3 h-3 shrink-0" />
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}