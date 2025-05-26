"use client";
import Icons from "@/common/icons/icons";
import cn from "@/common/utils/cn";
import { devLogger } from "@/common/utils/dev-logger";
import { useQRCode } from "next-qrcode";
import { useState } from "react";
import toast from "react-hot-toast";



export default function ShareFileComponent({ shareUrl }: { shareUrl: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const { SVG } = useQRCode();


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      devLogger.error("Failed to copy link:", err);
      toast.error("Failed to copy link");
    }
  };


  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared File",
          text: "Check out this file I'm sharing with you!",
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        devLogger.error("Failed to share via Web Share API:", err);
        toast.error("Failed to share");
      }
    } else {
      toast.error("Web Share API is not supported on this device");
    }
  };


  return (
    <>
      <div className="min-h-screen w-[99vw] sm:w-[700px] lg:w-[900px] xl:w-[1200px] py-8 px-4 sm:px-6 lg:px-8 mt-28">
        <div className="mx-auto">
          <div className="text-center mb-7">
            <h1 className="text-4xl lg:text-5xl font-black italic mb-4">
              Share Your File
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 lg:gap-12 items-center">
            <div>
              <div className="rounded-2xl shadow-xl p-8 lg:p-12">
                <h2 className="text-2xl font-semibold text-center mb-4">
                  Scan QR Code
                </h2>

                <div className="flex justify-center">
                  <div className="border border-border">
                    <SVG
                      text={shareUrl}
                      options={{
                        width: 240,
                        margin: 2,
                        color: {
                          dark: "#000000ff",
                          light: "#ffffffff",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-2">
                  Share Options
                </h2>

                <div className="mb-4">
                  <label className="text-muted-text text-sm font-semibold">
                    Direct Link
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="input h-10!"
                    />
                    <button
                      onClick={handleCopy}
                      className={cn("button", isCopied ? "bg-success/30! border-success! text-success!" : "bg-transparent")}
                      title="Copy to clipboard"
                    >
                      <Icons.Copy className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleWebShare}
                    className="button-accent flex items-center justify-center gap-2 w-full">
                    <span>Share via Apps</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className={cn("button flex items-center justify-center gap-2 w-full", isCopied ? "bg-success/30! border-success! text-success!" : "bg-transparent")}
                  >
                    <Icons.Copy className="size-4" />
                    <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-sm text-muted-text font-semibold mt-8">
          <span>Note: </span>
          <ul className="list-disc pl-5">
            <li>Large files may take a few minutes to fully process.</li>
            <li>If the download doesn&apos;t start, please refresh and try again.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
