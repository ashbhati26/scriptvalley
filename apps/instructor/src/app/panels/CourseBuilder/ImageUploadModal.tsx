"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Link2, ImageIcon, Loader2 } from "lucide-react";
import { useUploadThing } from "../../utils/uploadthing";

interface Props { onInsert: (url: string) => void; onClose: () => void; }
type Tab = "upload" | "url";

export default function ImageUploadModal({ onInsert, onClose }: Props) {
  const [tab,       setTab]       = useState<Tab>("upload");
  const [url,       setUrl]       = useState("");
  const [dragging,  setDragging]  = useState(false);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [file,      setFile]      = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("imageUploader");

  

  function acceptFile(f: File) {
    if (!f.type.startsWith("image/")) { setError("Only image files are supported."); return; }
    if (f.size > 8 * 1024 * 1024)    { setError("Image must be under 8 MB."); return; }
    setError(null); setFile(f); setPreview(URL.createObjectURL(f));
  }

  async function uploadAndInsert() {
  if (!file) return;

  setUploading(true);
  setError(null);

  try {
    const res = await startUpload([file]);

    const url = res?.[0]?.url;

    if (!url) throw new Error("Upload failed");

    onInsert(url); // THIS inserts into editor
  } catch (err: any) {
    setError(err?.message ?? "Upload failed.");
  } finally {
    setUploading(false);
  }
}

  function insertUrl() {
    const t = url.trim();
    if (!t) { setError("Please enter a URL."); return; }
    try { new URL(t); } catch { setError("Invalid URL."); return; }
    onInsert(t);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full sv-rounded-xl overflow-hidden"
        style={{ maxWidth: 440, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xl)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-hover)" }}
        >
          <div className="flex items-center gap-2.5">
            {/* Icon badge */}
            <div
              className="flex items-center justify-center sv-rounded-md"
              style={{ width: 32, height: 32, background: "var(--brand-subtle)", border: "1px solid var(--brand-border)" }}
            >
              <ImageIcon className="w-4 h-4 sv-text-brand" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.018em" }}>Insert Image</p>
          </div>
          <button
            onClick={onClose}
            className="sv-btn-ghost flex items-center justify-center sv-rounded-md"
            style={{ width: 30, height: 30 }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1" style={{ padding: "12px 16px 0" }}>
          {(["upload", "url"] as Tab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null); }}
                className="flex-1 flex items-center justify-center gap-1.5 sv-rounded-md"
                style={{
                  padding: "6px 12px", fontSize: 13, cursor: "pointer",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? "var(--bg-base)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  border: isActive ? "1px solid var(--border-subtle)" : "1px solid transparent",
                  boxShadow: isActive ? "var(--shadow-xs)" : "none",
                }}
              >
                {t === "upload" ? <Upload className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                {t === "upload" ? "Upload file" : "From URL"}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          <AnimatePresence mode="wait">
            {tab === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) acceptFile(f); }}
                  onClick={() => inputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 sv-rounded-xl"
                  style={{
                    padding: "28px 16px", cursor: "pointer",
                    border: `1.5px dashed ${dragging ? "var(--brand)" : "var(--border-medium)"}`,
                    background: dragging ? "var(--brand-subtle)" : preview ? "var(--bg-hover)" : "var(--bg-input)",
                  }}
                >
                  <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) acceptFile(f); }} />
                  {preview ? (
                    <>
                      <img src={preview} alt="preview" className="sv-rounded-md object-contain" style={{ maxHeight: 140, maxWidth: "100%", border: "1px solid var(--border-subtle)" }} />
                      <p style={{ fontSize: 12, color: "var(--text-faint)" }}>{file?.name} · {((file?.size ?? 0) / 1024).toFixed(0)} KB</p>
                      <p style={{ fontSize: 11, color: "var(--text-disabled)" }}>Click or drop to replace</p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center sv-rounded-xl" style={{ width: 48, height: 48, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
                        <Upload className="w-5 h-5" style={{ color: "var(--text-disabled)" }} />
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "-0.016em" }}>
                          {dragging ? "Drop it here!" : "Click or drag & drop"}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-disabled)", marginTop: 2 }}>PNG, JPG, GIF, WebP · max 8 MB</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Upload button */}
                <button
                  onClick={uploadAndInsert}
                  disabled={!file || uploading}
                  className="sv-btn-primary flex items-center justify-center gap-1.5 w-full sv-rounded-lg"
                  style={{ padding: "11px", fontSize: 14, fontWeight: 600, opacity: (!file || uploading) ? 0.4 : 1, cursor: (!file || uploading) ? "not-allowed" : "pointer" }}
                >
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</> : <><Upload className="w-4 h-4" />Insert image</>}
                </button>
              </motion.div>
            )}

            {tab === "url" && (
              <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                <div>
                  <p className="sv-section-label" style={{ marginBottom: 6 }}>Image URL</p>
                  <input
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(null); }}
                    onKeyDown={(e) => e.key === "Enter" && insertUrl()}
                    placeholder="https://example.com/image.png"
                    autoFocus
                    className="sv-input"
                    style={{ padding: "8px 12px", fontSize: 14, letterSpacing: "-0.016em" }}
                  />
                </div>

                {url && (
                  <div className="flex items-center justify-center sv-rounded-lg overflow-hidden" style={{ height: 120, border: "1px solid var(--border-subtle)", background: "var(--bg-hover)" }}>
                    <img src={url} alt="preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}

                <button
                  onClick={insertUrl}
                  disabled={!url.trim()}
                  className="sv-btn-primary flex items-center justify-center gap-1.5 w-full sv-rounded-lg"
                  style={{ padding: "11px", fontSize: 14, fontWeight: 600, opacity: !url.trim() ? 0.4 : 1, cursor: !url.trim() ? "not-allowed" : "pointer" }}
                >
                  <Link2 className="w-4 h-4" />Insert image
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 sv-rounded-md"
              style={{ marginTop: 12, padding: "10px 12px", background: "var(--danger-bg)", border: "1px solid var(--danger-border)" }}
            >
              <X className="w-3.5 h-3.5 shrink-0 sv-text-danger" />
              <p style={{ fontSize: 13, color: "var(--danger)" }}>{error}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}