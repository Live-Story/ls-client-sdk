'use client';

import { useEffect, useState } from 'react';

export type LiveStoryEntry = {
    id: string;
    title: string;
    type: string;
    ssc?: string;
    sys?: { id: string };
    coverImg?: string;
    ssr?: string;
  };

export type LiveStoryProps = {
  language?: string;
  store?: string;
  entry: LiveStoryEntry;
};

export default function LiveStory({ entry, language, store }: LiveStoryProps) {

  if (!entry) return null;
  const { id, type, ssr } = entry;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    
    if (!id || !type || !mounted) return;

    const loadLiveStory = () => {

      const runLiveStory = () => {
        if ((window as any).LiveStory) {
          new (window as any).LiveStory(`ls-${id}`, { type });
          console.log("ls-client-sdk npm: LS initialized");
        }
      };

      runLiveStory();
    };

    loadLiveStory();
  }, [id, type, mounted]);

  return (
    <div>
      {mounted && (
        <div
          id={`ls-${id}`}
          data-id={id}
          data-lang={language ?? 'default'}
          data-store={store ?? 'default'}
          style={{ width: "100%" }}
          dangerouslySetInnerHTML={{ __html: ssr ?? '' }}>
        </div>
      )}
    </div>
  );
}