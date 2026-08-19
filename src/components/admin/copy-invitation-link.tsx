"use client";

import { useState } from "react";

import { admin } from "@/components/admin/admin-ui";
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
    <div
      className={cn(
        "flex flex-col gap-2 lg:flex-row lg:items-center",
        className,
      )}
    >
      <code className={`${admin.code} min-h-11 flex-1 overflow-x-auto`}>
        {url}
      </code>
      <button type="button" onClick={handleCopy} className={admin.btnPrimary}>
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
    </div>
  );
}
