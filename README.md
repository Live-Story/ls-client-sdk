
# 🚀 Live Story - Client SDK

The **Live Story Client SDK** makes it easy to embed **Live Stories** in **Next.js** and **Shopify Hydrogen** apps, supporting **SSR** and **client-side initialization** out of the box.

It's designed to work seamlessly with **App Router**, `use client` components, and server-rendered content.

---

## ✨ Features

- ✅ Compatible with **Next.js App Router**
- ✅ Supports **SSR + Client Hydration**
- ✅ Works with **Shopify Hydrogen**
- ✅ Safe client-side initialization
- ✅ Multi-language and multi-store support
- ✅ Zero complex setup

---

## 📦 Installation

```bash
npm install ls-client-sdk
# or
yarn add ls-client-sdk
```

## 🧩 Types
The Live Story SDK exports TypeScript types to help you work with entries safely.

```ts
import type { LiveStoryEntry, LiveStoryProps } from 'ls-client-sdk/client';

// LiveStoryEntry type
{
  id: string;
  title: string;
  type: string;
  ssc?: string;           // Optional server-side content URL
  sys?: { id: string };    // Contentful system metadata
  coverImg?: string;      // Optional cover image URL
  ssr?: string;           // Optional pre-rendered SSR content
};

// LiveStoryProps type
{
  language?: string;      // Optional language code (default: "default")
  store?: string;         // Optional store context (default: "default")
  entry: LiveStoryEntry;  // The live story entry to render
};
```

## 🚀 Usage 

### Hydrogen (Remix)

```ts
export default function LiveStoryPage(){
  const {entry} = useLoaderData<typeof loader>();

  if (!entry) {
    return null;
  }

  return (
    <main>
        <LiveStory entry={entry} language="en" store="default" />
    </main>
  );
}
```

###  Next.js (App Router)

In Next.js App Router, `LiveStory` must be rendered from a **Client Component**, while data fetching and SSR happen in a **Server Component**.

---
#### Server Component (`page.tsx`)
```tsx
import LiveStoryClient from './LiveStoryClient';

export default async function Page({ params }: { params: { id: string } }) {
  const entry = await fetchLiveStoryEntry(params.id);

  // Fetch SSR HTML (critical data)
  if (entry?.ssc) {
    entry.ssr = await fetch(entry.ssc).then(res => res.text());
  }

  return (
    <main>
      <LiveStoryClient entry={entry} />
    </main>
  );
}
```

#### Client Component (`LiveStoryClient.tsx`)

```tsx
'use client';

import { LiveStory } from 'ls-client-sdk/client';
import type { LiveStoryEntry, LiveStoryProps } from 'ls-client-sdk/client';

export default function LiveStoryClient({ entry }: LiveStoryProps ) {
  if (!entry) return null;

  return (
    <LiveStory
      entry={entry}
      language="en"
      store="default"
    />
  );
}
```

## 🌐 Language & Store codes

You can customize the language and store for your Live Story by passing the optional `language` and `store` props to the `LiveStory` component.  

- **`language`** – sets the display language (default: `"default"`). Optional.
- **`store`** – sets the store context (default: `"default"`). Optional.

### Example

```tsx
<LiveStory
  entry={entry}
  language="en"   // e.g., "en", "it", "fr"
  store="default" // e.g., "default", "us-store", "eu-store"
/>
````

## 🧾 Example: Fetching SSR Content for Live Story

Sometimes, you want to render the Live Story content on the server first (SSR) and then hydrate it on the client.  
Here's an example of how you can fetch the `ssc` content (from a Contentful entry, or any other CMS you have) and attach it to your entry.

### Server-side Fetch (Hydrogen)

```ts
// Example: fetch Live Story SSR content from Contentful entry in Hydrogen
async function loadCriticalData(args: Route.LoaderArgs) {
  const entry = await fetchLiveStoryEntry(args.params.id);

  let liveStorySSR = '';

  // Fetch SSR HTML if available
  if (entry?.ssc) {
    liveStorySSR = await fetch(entry.ssc)
      .then(res => res.text())
      .catch(err => {
        console.error('Failed to fetch Live Story SSR:', err);
        return '';
      });
  }

  // Enhance entry with SSR content
  entry.ssr = liveStorySSR;

  return {
    entry
  };
}
```

### Server-side Fetch (Next.js)

```ts
// Example: fetch Live Story SSR content from Contentful entry in Next.js
export async function getServerSideProps(context) {
  const entry = await fetchLiveStoryEntry(context.params.id);

  let liveStorySSR = '';

  // Fetch SSR content if available
  if (entry?.ssc) {
    liveStorySSR = await fetch(entry.ssc)
      .then(res => res.text())
      .catch(err => {
        console.error('Failed to fetch Live Story SSR:', err);
        return '';
      });
  }

  // Enhance entry with SSR content
  entry.ssr = liveStorySSR;

  return {
    props: {
      entry
    },
  };
}
```
