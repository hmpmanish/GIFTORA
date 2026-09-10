"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon } from "lucide-react";

export function ShareProductButton({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this product: ${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2 mt-6">
      <span className="text-sm font-medium mr-2">Share:</span>
      <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
        <LinkIcon className="w-4 h-4" />
        {copied ? "Copied!" : "Copy Link"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200">
        <Share2 className="w-4 h-4" />
        WhatsApp
      </Button>
    </div>
  );
}
