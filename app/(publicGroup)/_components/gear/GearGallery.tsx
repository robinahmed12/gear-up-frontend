// Image gallery/carousel for gear detail page
// app/(publicGroup)/_components/gear/GearGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GearGalleryProps {
  mainImage: string;
  images: string[];
  name: string;
}

export default function GearGallery({ mainImage, images, name }: GearGalleryProps) {
  const allImages = [mainImage, ...images.filter((img) => img !== mainImage)];
  const [activeImage, setActiveImage] = useState(allImages[0]);

  return (
    <div className="space-y-3">
      <div className="relative h-72 w-full overflow-hidden rounded-xl bg-muted sm:h-96">
        <Image src={activeImage} alt={"name"} fill priority className="object-cover" />
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.slice(0, 4).map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-20 overflow-hidden rounded-lg ring-offset-2 transition-all sm:h-24 ${
                activeImage === image ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={image} alt={`${name} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}