const CACHE_NAME = "lawnlink-v1"

const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/chat.html",
  "/payments.html",
  "/gallery.html",
  "/before-after.html",
  "/ai-estimator.html",
  "/manifest.json"
]

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(urlsToCache)
    })
  )

})

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
    .then(response => {

      return response || fetch(event.request)

    })

  )

})
