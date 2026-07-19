"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, QrCode, Check } from "lucide-react";
import { LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

interface ShareModalProps {
  eventId: string;
  children: React.ReactNode;
}

export function ShareModal({ eventId, children }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shareUrl = `https://european-pay.vercel.app/dashboard/events/${eventId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const text = encodeURIComponent("Check out this event!");
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* @ts-ignore */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-surface rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center font-headline-sm text-on-surface mb-6">
            Share
          </DialogTitle>
        </DialogHeader>

        {!showQr ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-14 h-14 border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Copy className="w-6 h-6 text-on-surface" />
                  )}
                </Button>
                <span className="text-xs text-on-surface-variant font-medium">
                  {copied ? "Copied" : "Copy link"}
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-14 h-14 border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
                  onClick={handleShareLinkedIn}
                >
                  <LinkedInLogoIcon className="w-6 h-6 text-[#0A66C2]" />
                </Button>
                <span className="text-xs text-on-surface-variant font-medium">
                  LinkedIn
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-14 h-14 border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
                  onClick={handleShareX}
                >
                  {/* Using Radix Twitter logo */}
                  <TwitterLogoIcon className="w-6 h-6 text-on-surface" />
                </Button>
                <span className="text-xs text-on-surface-variant font-medium">
                  X
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-14 h-14 border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
                  onClick={() => setShowQr(true)}
                >
                  <QrCode className="w-6 h-6 text-on-surface" />
                </Button>
                <span className="text-xs text-on-surface-variant font-medium">
                  QR Code
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-outline-variant">
              <QRCodeCanvas
                value={shareUrl}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-center text-on-surface-variant max-w-[250px]">
              Scan this QR code to view the event details on your mobile device.
            </p>
            <Button
              variant="ghost"
              onClick={() => setShowQr(false)}
              className="text-primary font-semibold hover:bg-primary/10 rounded-xl"
            >
              Back to share options
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
