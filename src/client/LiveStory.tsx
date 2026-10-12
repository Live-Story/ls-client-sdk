'use client';

import { useEffect, useRef, useState } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!id || !type || !mounted || !container) return;

    let cancelled = false;

    const loadLiveStory = () => {
      if (cancelled || !(window as any).LiveStory) return;
      new (window as any).LiveStory(`ls-${id}`, { type });
      console.log(`ls-client-sdk: ${type} ${id} initialized`);
    };

    const executeScripts = async () => {
      // Re-create scripts because scripts inserted via innerHTML
      // are inert and do not execute.
      const scripts = Array.from(
        container.querySelectorAll('script')
      );

      for (const oldScript of scripts) {
        if (cancelled) return;

        const newScript = document.createElement('script');

        // Preserve script attributes such as src, type, and nonce.
        for (const attr of Array.from(oldScript.attributes)) {
          newScript.setAttribute(attr.name, attr.value);
        }
        if (oldScript.src) {
          // Wait for external scripts before continuing.
          await new Promise((resolve, reject) => {
            newScript.onload = () => resolve(null);
            newScript.onerror = () =>
              reject(new Error(`Failed to load ${oldScript.src}`));

            oldScript.replaceWith(newScript);
          });
        } else {
          newScript.textContent = oldScript.textContent;
          oldScript.replaceWith(newScript);
        }
      }

      if (cancelled) return;

      // Initialize the client SDK after inserting the HTML/scripts.
      loadLiveStory();
    }

    void executeScripts().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [id, type, mounted]);

  return (
    <div
      ref={containerRef}  
      id={`ls-${id}`}
      data-id={id}
      data-type={type}
      data-lang={language ?? 'default'}
      data-store={store ?? 'default'}
      style={{ width: "100%" }}
      dangerouslySetInnerHTML={{ __html: ssr ?? '' }}
      suppressHydrationWarning
    />
  );
}
