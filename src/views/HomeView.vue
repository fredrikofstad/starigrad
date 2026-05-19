<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import RSVPForm from '../components/RSVPForm.vue'

type SheetRow = {
  ID?: string
  Name?: string
  'RSVP status'?: string
  Allergies?: string
  Notes?: string
  Arrival?: string | Date
  Departure?: string | Date
}

const props = defineProps<{ lang: string; locales: Record<string, any> }>()
const route = useRoute()

import { SHEET_ENDPOINT } from '../lib/sheetEndpoint'

const loading = ref(false)
const error = ref('')
const guest = ref<SheetRow | null>(null)

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}

const inviteCode = computed(() => {
  const raw = route.params.inviteCode
  return typeof raw === 'string' && /^[A-Za-z0-9]{4}$/.test(raw) ? raw : ''
})

async function loadGuest(code: string) {
  loading.value = true
  error.value = ''
  guest.value = null

  try {
    const response = await fetch(SHEET_ENDPOINT, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    const payload = await response.json()
    if (payload.status !== 'success' || !Array.isArray(payload.data)) {
      throw new Error(payload.message || 'Unexpected sheet response')
    }

    const match = payload.data.find((row: SheetRow) => String(row.ID || '').trim() === code)
    guest.value = match || null

    if (!match) {
      error.value = 'No invitation was found for that code.'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not load invitation data.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (inviteCode.value) {
    void loadGuest(inviteCode.value)
  }
})

watch(inviteCode, (code) => {
  if (code) {
    void loadGuest(code)
  } else {
    error.value = ''
    guest.value = null
    loading.value = false
  }
})

const rsvpStatusLabel = computed(() => {
  const status = guest.value?.['RSVP status']?.trim()
  return status || 'Pending'
})

const rsvpPrefill = computed(() => {
  const row = guest.value
  if (!row) return null

  const status = (row['RSVP status'] || '').toLowerCase()
  const attending = status ? !status.includes('declin') && !status.includes('no') : true

  return {
    name: row.Name || '',
    attending,
    arrival: row.Arrival ? String(row.Arrival) : '',
    departure: row.Departure ? String(row.Departure) : '',
    allergy: row.Allergies || '',
    notes: row.Notes || '',
  }
})

const invitationTitle = computed(() => {
  if (!inviteCode.value) {
    return t('home_title')
  }

  return guest.value?.Name ? `${guest.value.Name}'s invitation` : 'Invitation'
})
</script>

<template>
  <section class="home-view">
    <div class="hero-card">
      <p class="eyebrow">{{ t('home_eyebrow') }}</p>
      <h2>{{ invitationTitle }}</h2>
      <p v-if="!inviteCode" class="lead">
        {{ t('home_lead') }}
      </p>
    </div>

    <div v-if="inviteCode" class="invite-card">
      <div v-if="loading" class="state-card">Loading invitation…</div>

      <div v-else-if="guest" class="state-card guest-card">
        <div class="guest-header">
          <div>
            <p class="mini-label">Guest</p>
            <h3>{{ guest.Name || 'Unnamed guest' }}</h3>
          </div>
          <span class="badge">{{ rsvpStatusLabel }}</span>
        </div>

        <dl class="guest-grid">
          <div>
            <dt>ID</dt>
            <dd>{{ guest.ID || inviteCode }}</dd>
          </div>
          <div>
            <dt>Allergies</dt>
            <dd>{{ guest.Allergies || 'None listed' }}</dd>
          </div>
          <div class="full-span">
            <dt>Notes</dt>
            <dd>{{ guest.Notes || 'No notes' }}</dd>
          </div>
        </dl>
      </div>

      <div v-else-if="error" class="state-card error-card">
        {{ error }}
      </div>
    </div>

    <img src="@/assets/starigrad.webp" alt="Starigrad" class="featured-image" />

    <RSVPForm
      :lang="lang"
      :locales="locales"
      :prefill="rsvpPrefill"
      :sheet-id="inviteCode || null"
      :submit-label="inviteCode ? 'Update RSVP' : undefined"
      @saved="() => { if (inviteCode) void loadGuest(inviteCode) }"
    />
  </section>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 1040px;
  margin: 0 auto;
}

.hero-card,
.state-card,
.rsvp-card {
  border-radius: 28px;
  border: 1px solid rgba(194, 144, 126, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 247, 243, 0.92));
  box-shadow: 0 22px 50px rgba(123, 83, 67, 0.1);
}

.hero-card {
  padding: 1.8rem;
  text-align: left;
}

.eyebrow {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.75rem;
  color: var(--muted);
}

.hero-card h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.02;
}

.lead {
  margin-top: 0.85rem;
  color: var(--muted-strong);
  font-size: 1.04rem;
  line-height: 1.6;
}

.invite-card {
  display: grid;
  gap: 1rem;
}

.state-card {
  padding: 1.2rem 1.3rem;
  text-align: left;
}

.guest-card {
  background: linear-gradient(135deg, rgba(179, 95, 95, 0.12), rgba(233, 201, 172, 0.26));
}

.guest-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mini-label {
  margin: 0 0 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.72rem;
  color: var(--muted);
}

.guest-header h3 {
  margin: 0;
  font-size: 1.45rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  color: var(--ink);
  font-weight: 600;
  border: 1px solid rgba(194, 144, 126, 0.18);
}

.guest-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
}

.guest-grid dt {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  margin-bottom: 0.35rem;
}

.guest-grid dd {
  margin: 0;
  color: var(--ink);
  line-height: 1.5;
}

.full-span {
  grid-column: 1 / -1;
}

.error-card {
  color: #9a3d32;
  background: linear-gradient(135deg, rgba(255, 221, 214, 0.96), rgba(255, 245, 243, 0.98));
}

.featured-image {
  width: 100%;
  max-width: 1040px;
  border-radius: 28px;
  box-shadow: 0 22px 50px rgba(123, 83, 67, 0.1);
  display: block;
  margin: 0 auto;
}

@media (max-width: 820px) {
  .guest-grid {
    grid-template-columns: 1fr;
  }

  .guest-header {
    flex-direction: column;
  }
}
</style>