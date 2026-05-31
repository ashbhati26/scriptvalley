"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Link2, ImageIcon, Loader2 } from "lucide-react";

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

  const generateUploadUrl = useMutation(api.courses.generateImageUploadUrl);
  const saveImageUrl      = useMutation(api.courses.saveUploadedImage);

  function acceptFile(f: File) {
    if (!f.type.startsWith("image/")) { setError("Only image files are supported."); return; }
    if (f.size > 8 * 1024 * 1024)    { setError("Image must be under 8 MB."); return; }
    setError(null); setFile(f); setPreview(URL.createObjectURL(f));
  }

  async function uploadAndInsert() {
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      if (!res.ok) throw new Error("Upload failed — try again.");
      const { storageId } = await res.json();
      const publicUrl = await saveImageUrl({ storageId });
      if (!publicUrl) throw new Error("Could not get image URL.");
      onInsert(publicUrl);
    } catch (err: any) { setError(err?.message ?? "Upload failed."); }
    finally { setUploading(false); }
  }

  function insertUrl() {
    const t = url.trim();
    if (!t) { setError("Please enter a URL."); return; }
    try { new URL(t); } catch { setError("Invalid URL."); return; }
    onInsert(t);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-[440px] card shadow-xl rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle bg-hover">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 icon-badge icon-badge-brand flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-brand" />
            </div>
            <p className="text-[15px] font-semibold text-primary tracking-[-0.018em]">Insert Image</p>
          </div>
          <button onClick={onClose} className="btn-ghost w-[30px] h-[30px] flex items-center justify-center rounded-md bg-active">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0.5 px-4 pt-3">
          {(["upload", "url"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] cursor-pointer ${
                tab === t
                  ? "filter-tab-active font-semibold"
                  : "filter-tab-inactive font-normal"
              }`}
            >
              {t === "upload" ? <Upload className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
              {t === "upload" ? "Upload file" : "From URL"}
            </button>
          ))}
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {tab === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) acceptFile(f); }}
                  onClick={() => inputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2.5 px-4 py-7 rounded-xl border-[1.5px] border-dashed cursor-pointer ${
                    dragging ? "border-brand bg-brand-subtle" : preview ? "border-medium bg-hover" : "border-medium bg-input"
                  }`}
                >
                  <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) acceptFile(f); }} />
                  {preview ? (
                    <>
                      <img src={preview} alt="preview" className="max-h-[140px] max-w-full rounded-md object-contain border border-subtle" />
                      <p className="text-[12px] text-faint">{file?.name} · {((file?.size ?? 0) / 1024).toFixed(0)} KB</p>
                      <p className="text-[11px] text-disabled">Click or drop to replace</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-elevated border border-subtle flex items-center justify-center">
                        <Upload className="w-5 h-5 text-disabled" />
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-medium text-secondary tracking-[-0.016em]">
                          {dragging ? "Drop it here!" : "Click or drag & drop"}
                        </p>
                        <p className="text-[12px] text-disabled mt-0.5">PNG, JPG, GIF, WebP · max 8 MB</p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={uploadAndInsert}
                  disabled={!file || uploading}
                  className={`btn-primary flex items-center justify-center gap-1.5 w-full py-[11px] rounded-lg text-[14px] font-semibold ${(!file || uploading) ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</> : <><Upload className="w-4 h-4" />Insert image</>}
                </button>
              </motion.div>
            )}

            {tab === "url" && (
              <motion.div key="url" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
                <div>
                  <p className="section-label mb-1.5">Image URL</p>
                  <input
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(null); }}
                    onKeyDown={(e) => e.key === "Enter" && insertUrl()}
                    placeholder="https://example.com/image.png"
                    autoFocus
                    className="input-base input-focus w-full px-3 py-2.5 text-[14px] tracking-[-0.016em]"
                  />
                </div>
                {url && (
                  <div className="flex items-center justify-center h-[120px] rounded-lg border border-subtle bg-hover overflow-hidden">
                    <img src={url} alt="preview" className="max-h-full max-w-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <button
                  onClick={insertUrl}
                  disabled={!url.trim()}
                  className={`btn-primary flex items-center justify-center gap-1.5 w-full py-[11px] rounded-lg text-[14px] font-semibold ${!url.trim() ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <Link2 className="w-4 h-4" />Insert image
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-danger-bg border border-danger mt-3">
              <X className="w-3.5 h-3.5 shrink-0 text-danger" />
              <p className="text-[13px] text-danger">{error}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}