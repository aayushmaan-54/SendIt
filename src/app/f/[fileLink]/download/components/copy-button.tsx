"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type CopyLinkButtonProps = {
  shareableLink: string;
  className?: string;
};

export default function CopyLinkButton({ shareableLink, className }: CopyLinkButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className || "px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors"}
    >
      {isCopied ? 'Copied!' : 'Copy Shareable Link'}
    </button>
  );
}
