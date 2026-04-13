"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";

// ─── Canvas utility ───────────────────────────────────────────────────────────

export async function getCroppedWebP(
  imageSrc: string,
  pixelCrop: Area,
  outputSize = 256
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d")!;

  // Circular clip
  ctx.beginPath();
  ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      "image/webp",
      0.9
    );
  });
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────

export function CropModal({
  imageSrc,
  onConfirm,
  onCancel,
}: {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixelCrop: Area) => {
    setCroppedArea(pixelCrop);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) return;
    const blob = await getCroppedWebP(imageSrc, croppedArea);
    onConfirm(blob);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <p className="text-sm font-semibold text-neutral-900">Crop photo</p>
          <p className="text-xs text-neutral-400 mt-0.5">Drag to reposition · Pinch or scroll to zoom</p>
        </div>

        {/* Crop area */}
        <div className="relative bg-neutral-900" style={{ height: 280 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#171717" },
              cropAreaStyle: { border: "2px solid white" },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="px-5 pt-4 pb-1">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-neutral-900 h-1"
          />
        </div>

        <div className="flex items-center justify-end gap-2 p-4">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-neutral-500" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" className="h-8 text-xs bg-neutral-900 hover:bg-neutral-700" onClick={handleConfirm}>
            Use photo
          </Button>
        </div>
      </div>
    </div>
  );
}
