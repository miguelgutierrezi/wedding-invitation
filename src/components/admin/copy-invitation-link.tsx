"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type CopyInvitationLinkProps = {
  url: string;
  className?: string;
};

export function CopyInvitationLink({
  url,
  className,
}: CopyInvitationLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center", className)}>
      <code className="min-h-11 flex-1 overflow-x-auto rounded-xl border border-[color:var(--ring)] bg-cream px-3 py-2 text-xs break-all text-foreground sm:text-sm">
        {url}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-on-dark transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      >
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
    </div>
  );
}
