const cacheName = 'gymbit-0'
const cacheP = self.caches.open(cacheName)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('fetch', ev => {
  // serve cached / and /assets/. Refresh / after serving from cache.
  const path = new URL(ev.request.url).pathname
  if (path !== '/' && !path.startsWith('/assets/')) return

  ev.respondWith((async () => {
    const cache = await cacheP

    let res = await cache.match(ev.request)
    if (res) {
      if (path === '/') { // refersh index for next time
        self.fetch(ev.request).then(res => {
          if (res.ok) cache.put(ev.request, res)
        })
      }
      return res
    }

    res = await self.fetch(ev.request)
    if (res.ok) cache.put(ev.request, res.clone())
    return res
  })())
})
