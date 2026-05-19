<template>
  <div class="map-wrap">
    <div ref="mapEl" class="map" role="region" aria-label="Google map"></div>
    <p v-if="error" class="map-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type MarkerInput = {
  title: string
  address: string
}

const props = defineProps<{
  apiKey?: string
  markers: MarkerInput[]
  missingKeyMessage: string
  geocodeFailedMessage: string
}>()

const mapEl = ref<HTMLElement | null>(null)
const error = ref('')

async function loadGoogleMaps(apiKey: string): Promise<void> {
  const w = window as any
  if (w.google?.maps) return

  if (w.__googleMapsLoadPromise) {
    await w.__googleMapsLoadPromise
    return
  }

  w.__googleMapsLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-maps-script') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  await w.__googleMapsLoadPromise
}

function geocodeAddress(geocoder: any, address: string): Promise<any | null> {
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results: any, status: string) => {
      if (status === 'OK' && results?.[0]) {
        resolve(results[0].geometry.location)
      } else {
        resolve(null)
      }
    })
  })
}

onMounted(async () => {
  if (!props.apiKey) {
    error.value = props.missingKeyMessage
    return
  }

  try {
    await loadGoogleMaps(props.apiKey)
    const w = window as any
    const google = w.google

    if (!google?.maps || !mapEl.value) {
      error.value = props.geocodeFailedMessage
      return
    }

    const map = new google.maps.Map(mapEl.value, {
      center: { lat: 43.184, lng: 16.595 },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    const bounds = new google.maps.LatLngBounds()
    const geocoder = new google.maps.Geocoder()

    let successCount = 0
    for (const marker of props.markers) {
      const location = await geocodeAddress(geocoder, marker.address)
      if (!location) continue

      new google.maps.Marker({
        position: location,
        map,
        title: marker.title,
      })

      bounds.extend(location)
      successCount += 1
    }

    if (successCount > 0) {
      map.fitBounds(bounds, 56)
    } else {
      error.value = props.geocodeFailedMessage
    }
  } catch {
    error.value = props.geocodeFailedMessage
  }
})
</script>

<style scoped>
.map-wrap {
  margin-top: 1rem;
}

.map {
  width: 100%;
  height: 420px;
  border-radius: 18px;
  border: 1px solid rgba(194, 144, 126, 0.2);
  box-shadow: 0 12px 34px rgba(123, 83, 67, 0.12);
}

.map-error {
  margin-top: 0.75rem;
  color: #a64a4a;
  font-size: 0.95rem;
}
</style>
