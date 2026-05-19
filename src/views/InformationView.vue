<template>
  <section class="page-view">
    <article class="page-card">
      <p class="eyebrow">{{ t('information_eyebrow') }}</p>
      <h2>{{ t('information_title') }}</h2>
      <p class="intro">{{ t('information_intro') }}</p>

      <div class="info-grid key-grid">
        <div class="detail-card">
          <h3>{{ t('information_key_title') }}</h3>
          <ul class="facts-list">
            <li><strong>{{ t('information_key_date_label') }}:</strong> {{ t('information_key_date_value') }}</li>
            <li><strong>{{ t('information_key_location_label') }}:</strong> {{ t('information_key_location_value') }}</li>
            <li><strong>{{ t('information_key_airport_label') }}:</strong> {{ t('information_key_airport_value') }}</li>
            <li><strong>{{ t('information_key_house_label') }}:</strong> {{ t('information_key_house_value') }}</li>
          </ul>
        </div>

        <div class="detail-card">
          <h3>{{ t('information_getting_title') }}</h3>
          <p>{{ t('information_getting_intro') }}</p>
          <ul class="travel-list">
            <li>{{ t('information_getting_option_1') }}</li>
            <li>{{ t('information_getting_option_2') }}</li>
            <li>{{ t('information_getting_option_3') }}</li>
          </ul>
        </div>
      </div>

      <section class="map-section">
        <h3>{{ t('information_getting_map_title') }}</h3>
        <p class="map-intro">{{ t('information_getting_map_text') }}</p>

        <GoogleMap
          :api-key="mapsApiKey"
          :markers="gettingThereMarkers"
          :missing-key-message="t('information_map_missing_key')"
          :geocode-failed-message="t('information_map_geocode_failed')"
        />

        <ul class="location-list">
          <li v-for="marker in gettingThereMarkers" :key="marker.title">
            <strong>{{ marker.title }}:</strong> {{ marker.address }}
          </li>
        </ul>
      </section>

      <section class="ferry-section">
        <h3>{{ t('information_ferry_title') }}</h3>
        <p class="ferry-info">
          {{ t('information_ferry_intro') }}
          <a href="https://www.jadrolinija.hr/en/travel/split_-_stari_grad_hvar" target="_blank">{{ t('information_ferry_link_text') }}</a>
          {{ t('information_ferry_office') }}
        </p>

        <div class="table-wrap">
          <table class="ferry-table">
            <thead>
              <tr>
                <th>{{ t('information_ferry_col_route') }}</th>
                <th>{{ t('information_ferry_col_departure') }}</th>
                <th>{{ t('information_ferry_col_duration') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Split - Stari Grad</td>
                <td>05:30</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>07:45</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>11:30</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>14:00</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>17:30</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>20:00</td>
                <td>2h</td>
              </tr>
              <tr>
                <td>Split - Stari Grad</td>
                <td>23:00</td>
                <td>2h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="map-section">
        <h3>{{ t('information_map_title') }}</h3>
        <p class="map-intro">{{ t('information_map_text') }}</p>

        <GoogleMap
          :api-key="mapsApiKey"
          :markers="mapMarkers"
          :missing-key-message="t('information_map_missing_key')"
          :geocode-failed-message="t('information_map_geocode_failed')"
        />

        <ul class="location-list">
          <li v-for="marker in mapMarkers" :key="marker.title">
            <strong>{{ marker.title }}:</strong> {{ marker.address }}
          </li>
        </ul>
      </section>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GoogleMap from '../components/GoogleMap.vue'

const props = defineProps<{ lang: string; locales: Record<string, any> }>()

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const mapMarkers = computed(() => [
  {
    title: t('information_map_marker_home'),
    address: 'Vagonj 33, 21460 Stari Grad, Croatia',
  },
  {
    title: t('information_map_marker_meetup'),
    address: 'Trg Ploča Trg Stjepana Radića 21460, Stari Grad',
  },
  {
    title: t('information_map_marker_port'),
    address: 'Ferry Port Stari Grad, 21460 Stari Grad, Croatia',
  },
])

const gettingThereMarkers = computed(() => [
  {
    title: t('information_getting_map_marker_airport'),
    address: 'Split Airport, Cesta Dr. Franje Tuđmana 1270, Kaštel Štafilić, Croatia',
  },
  {
    title: t('information_getting_map_marker_ferry'),
    address: 'Port of Split, Gat Sv. Duje, Split, Croatia',
  },
])
</script>

<style scoped>
.page-view {
  max-width: 960px;
  margin: 0 auto;
}

.page-card {
  padding: 1.8rem;
  border-radius: 28px;
  border: 1px solid rgba(194, 144, 126, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 248, 244, 0.96));
  box-shadow: 0 22px 50px rgba(123, 83, 67, 0.1);
  text-align: left;
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.75rem;
  color: var(--muted);
}

.page-card h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 3rem);
}

.intro {
  margin-top: 0.75rem;
  max-width: 60ch;
  color: var(--muted-strong);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;
}

.detail-card {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(194, 144, 126, 0.12);
}

.detail-card h3 {
  margin: 0 0 0.25rem;
}

.detail-card p {
  margin: 0;
  color: var(--muted-strong);
}

.facts-list,
.travel-list {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: var(--muted-strong);
}

.facts-list li + li,
.travel-list li + li {
  margin-top: 0.35rem;
}

.ferry-section {
  margin-top: 1.4rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(194, 144, 126, 0.15);
}

.ferry-section h3 {
  margin: 0;
}

.ferry-intro {
  margin-top: 0.4rem;
  color: var(--muted-strong);
}

.table-wrap {
  margin-top: 0.85rem;
  overflow-x: auto;
}

.ferry-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.ferry-table th,
.ferry-table td {
  text-align: left;
  padding: 0.7rem 0.65rem;
  border-bottom: 1px solid rgba(194, 144, 126, 0.16);
  color: var(--muted-strong);
}

.ferry-table th {
  color: var(--ink);
  font-weight: 700;
}

.map-section {
  margin-top: 1.6rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(194, 144, 126, 0.15);
}

.map-section h3 {
  margin: 0;
}

.map-intro {
  margin-top: 0.35rem;
  color: var(--muted-strong);
}

.location-list {
  margin: 0.9rem 0 0;
  padding-left: 1.1rem;
  color: var(--muted-strong);
}

.location-list li + li {
  margin-top: 0.35rem;
}

@media (max-width: 700px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
