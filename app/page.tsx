"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageItem {
  id: string;
  src: string;
  alt: string;
  title?: string;
  date?: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pinnedImageIds");
    if (saved) {
      setPinnedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pinnedImageIds", JSON.stringify(Array.from(pinnedIds)));
  }, [pinnedIds]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/images");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || "Failed to fetch images");
      }
      setImages(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const sortedImages = [...images].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id);
    const bPinned = pinnedIds.has(b.id);
    if (aPinned === bPinned) return 0;
    return aPinned ? -1 : 1;
  });

  const togglePin = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = new Set(pinnedIds);
    if (newPinned.has(imageId)) {
      newPinned.delete(imageId);
    } else {
      newPinned.add(imageId);
    }
    setPinnedIds(newPinned);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Task Gallery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Preview images from your Notion tasks
            </p>
          </div>
          <button
            onClick={fetchImages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
            title="Refresh images"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading images...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <p className="text-red-800 dark:text-red-200 font-semibold">
              Error loading images:
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-2 font-mono break-words">
              {error}
            </p>
            <div className="text-red-700 dark:text-red-300 text-sm mt-4">
              <p className="font-semibold mb-2">Troubleshooting:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Check that your Notion token is valid</li>
                <li>Verify the database ID is correct</li>
                <li>Ensure the integration has access to the database</li>
                <li>Check browser console (F12) for more details</li>
              </ul>
            </div>
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No images found in your Notion database.
            </p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="grid grid-cols-3 gap-4" style={{ gridAutoRows: "1fr", aspectRatio: "auto" }}>
            {sortedImages.slice(0, 15).map((image) => {
              const isPinned = pinnedIds.has(image.id);
              return (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="relative group overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  <button
                    onClick={(e) => togglePin(image.id, e)}
                    className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title={isPinned ? "Unpin image" : "Pin image"}
                  >
                    {isPinned ? (
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a.75.75 0 00-1.788 0l-7 140a.75.75 0 001.721.813l1.07-4.275h4.994l1.07 4.275a.75.75 0 001.721-.813l-7-140zm1.747-5.423a.75.75 0 00-1.282-.602l-5.883 7.130A1.25 1.25 0 004.25 5h11.5a1.25 1.25 0 00-.876-2.177l-5.883-7.13z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                      </svg>
                    )}
                  </button>

                  {isPinned && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                      Pinned
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full p-2 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="relative w-full bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-lg">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="p-6">
                {selectedImage.title && (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedImage.title}
                  </h2>
                )}
                {selectedImage.date && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedImage.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}