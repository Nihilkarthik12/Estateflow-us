"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  bucket?: string;
}

export default function ImageUpload({
  value,
  onChange,
  maxFiles = 6,
  bucket = "property-images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (value.length >= maxFiles) return;

    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (value.length + newUrls.length >= maxFiles) break;

      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Upload zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className={cn(
          "border-2 border-dashed border-[var(--border-strong)] rounded-xl p-6 text-center transition-colors duration-150",
          value.length < maxFiles
            ? "cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]"
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading || value.length >= maxFiles}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
            <p className="text-sm text-[var(--foreground-muted)]">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={22} className="text-[var(--foreground-muted)]" />
            <p className="text-sm text-[var(--foreground-muted)]">
              Drop images here or <span className="text-[var(--accent)]">click to upload</span>
            </p>
            <p className="text-xs text-[var(--foreground-subtle)]">
              {value.length}/{maxFiles} images · PNG, JPG, WEBP
            </p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative group aspect-video rounded-lg overflow-hidden border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Property image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="p-1 bg-[var(--danger)] rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ImageIcon size={9} /> Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
