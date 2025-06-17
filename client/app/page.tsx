'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageData {
  id: number;
  title: string;
  description: string;
  date_taken: string;
  cloudinary_id: string;
  source_url: string;
}

export default function Home() {
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialImage = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server.');
      }

      const data: ImageData = await response.json();

      if (data && data.id) {
        setImage(data);
        setError(null);
      } else {
        setError('No images found in the database.');
        setImage(null);
      }
    } catch (err: any) {
      setError(err.message);
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialImage();
  }, []);

  return (
    <main className="flex h-screen flex-col items-center p-4 sm:p-8">
      <div className="flex flex-col items-center text-center w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-4 flex-shrink-0">Liverpool Visual Archive</h1>
      </div>

      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        {error ? (
          <p className="text-lg text-red-500">Error: {error}</p>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-4 h-full transition-opacity duration-666 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {image && (
              <>
                <h2 className="text-3xl font-semibold flex-shrink-0">{image.title}</h2>

                <div className="relative w-full flex-1">
                  <Image
                    src={`/images/${image.cloudinary_id}`}
                    alt={image.description || image.title || 'A photograph from the Liverpool archive'}
                    fill
                    className="object-contain"
                    priority
                    key={image.id}
                  />
                </div>

                <div className="flex-shrink-0">
                  <p className="text-lg mt-2">{image.description}</p>
                  <p className="text-sm text-gray-500">
                    Taken on: {new Date(image.date_taken).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
