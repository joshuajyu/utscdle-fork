'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PixelatedImageProps {
  src: string;
  desiredBlocks?: number;
  alt?: string;
  className?: string;
  guessNumber?: number; // New prop to control visible quarters
}

const PixelatedImage: React.FC<PixelatedImageProps> = ({
  src,
  desiredBlocks = 50,
  alt = 'Pixelated Image',
  className = '',
  guessNumber = 1, // Default to 1 quarter visible
}) => {
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  useEffect(() => {
    const img1 = new window.Image();
    img1.crossOrigin = 'anonymous';
    img1.onload = () => {
      const w = img1.width;
      const h = img1.height;
      setImageWidth(w);
      setImageHeight(h);

      // If all quarters are visible, return the original image
      if (guessNumber >= 4) {
        setProcessedImageSrc(src);
        return;
      }

      // Calculate sampleSize based on desired number of blocks
      const sampleSize = Math.max(Math.floor(w / desiredBlocks), 1);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img1, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const pixelArr = imageData.data;

      // Loop over blocks
      for (let y = 0; y < h; y += sampleSize) {
        for (let x = 0; x < w; x += sampleSize) {
          if (shouldPixelate(x, y, w, h, guessNumber)) {
            const p = (x + y * w) * 4;
            const r = pixelArr[p];
            const g = pixelArr[p + 1];
            const b = pixelArr[p + 2];
            const a = pixelArr[p + 3];

            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
            ctx.fillRect(x, y, sampleSize, sampleSize);
          }
          // Else, leave the block unpixelated
        }
      }

      const dataURL = canvas.toDataURL('image/jpeg');
      setProcessedImageSrc(dataURL);
    };
    img1.src = src;
  }, [src, desiredBlocks, guessNumber]);

  // Function to determine if a block should be pixelated
  function shouldPixelate(
    x: number,
    y: number,
    w: number,
    h: number,
    visibleQuarters: number
  ): boolean {
    const halfW = w / 2;
    const halfH = h / 2;

    // Quarters:
    // 1: Top-left
    // 2: Top-right
    // 3: Bottom-left
    // 4: Bottom-right

    let quarter = 0;

    if (x < halfW && y < halfH) {
      quarter = 1; // Top-left
    } else if (x >= halfW && y < halfH) {
      quarter = 2; // Top-right
    } else if (x < halfW && y >= halfH) {
      quarter = 3; // Bottom-left
    } else {
      quarter = 4; // Bottom-right
    }

    // If the quarter is within the visible quarters, do not pixelate
    if (quarter <= visibleQuarters) {
      return false; // Do not pixelate
    } else {
      return true; // Pixelate
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {processedImageSrc && imageWidth && imageHeight && (
        <Image
          src={processedImageSrc}
          alt={`Processed ${alt}`}
          width={imageWidth}
          height={imageHeight}
          unoptimized
          className="w-full h-auto"
        />
      )}
    </div>
  );
};

export default PixelatedImage;
