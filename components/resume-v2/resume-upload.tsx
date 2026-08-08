/**
 * resume-upload.tsx — Resume upload primitive (P11-WB..WD, T041..T140).
 *
 * Drag-and-drop / file-picker for resume documents. Shows processing status
 * (queued → extracting → parsing → analyzing → ready/failed) and surfaces
 * validation errors inline. Used by the resume dashboard.
 */

"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { ResumeDocument, ProcessingStatus } from "@/lib/resume";

export interface ResumeUploadProps {
  /** Active resume doc, if any — drives the status display. */
  activeResume?: ResumeDocument | null;
  /** Called with the selected file; the parent owns the upload network call. */
  onUpload: (file: File) => void | Promise<void>;
  /** Disable the input while an upload is in flight. */
  busy?: boolean;
}

const ACCEPTED = ".pdf,.docx,.txt,.md,.html";

export function ResumeUpload({ activeResume, onUpload, busy }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !["pdf", "docx", "txt", "md", "html"].includes(ext)) {
        setError("Unsupported file type. Use PDF, DOCX, TXT, MD, or HTML.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum size is 10 MB.");
        return;
      }
      setError(null);
      void onUpload(file);
    },
    [onUpload],
  );

  const status = activeResume?.status;
  const statusMeta = STATUS_META[status ?? "queued"] ?? STATUS_META.queued;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Drop your resume here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT, MD, or HTML · 10 MB max</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <XCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {activeResume && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <statusMeta.icon
            className={`h-5 w-5 ${statusMeta.color} ${status === "extracting" || status === "parsing" || status === "analyzing" ? "animate-spin" : ""}`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
              <FileText className="h-4 w-4 shrink-0" />
              {activeResume.originalFilename}
            </p>
            <p className={`text-xs ${statusMeta.color}`}>{statusMeta.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_META: Record<ProcessingStatus, { label: string; icon: typeof UploadCloud; color: string }> = {
  queued: { label: "Queued for processing", icon: Loader2, color: "text-muted-foreground" },
  extracting: { label: "Extracting text…", icon: Loader2, color: "text-blue-600 dark:text-blue-400" },
  parsing: { label: "Parsing structure…", icon: Loader2, color: "text-blue-600 dark:text-blue-400" },
  analyzing: { label: "Analyzing claims…", icon: Loader2, color: "text-blue-600 dark:text-blue-400" },
  ready: { label: "Ready", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
  failed: { label: "Processing failed", icon: XCircle, color: "text-red-600 dark:text-red-400" },
};
