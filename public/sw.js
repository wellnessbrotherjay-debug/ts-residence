const IMAGE_CACHE = "ts-residence-image-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isImageRequest =
    request.destination === "image" ||
    url.pathname === "/_next/image" ||
    /\.(?:avif|gif|ico|jpg|jpeg|png|svg|webp)$/i.test(url.pathname);

  if (!isImageRequest) return;

  event.respondWith(
    caches.open(IMAGE_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const networkResponsePromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkResponsePromise;
    }),
  );
});