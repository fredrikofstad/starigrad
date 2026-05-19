<template>
  <div class="rsvp-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <h2>{{ t('title') }}</h2>
    </div>

    <form @submit.prevent="onSubmit" class="rsvp-form">
      <label class="field">
        <span>{{ t('name') }}</span>
        <input v-model="form.name" type="text" :placeholder="t('name')" required />
      </label>

      <label class="field">
        <span>{{ t('attendance') }}</span>
        <select v-model="form.attending">
          <option :value="true">{{ t('attending') }}</option>
          <option :value="false">{{ t('not_attending') }}</option>
        </select>
      </label>

      <label class="field">
        <span>{{ t('planned_arrival') }}</span>
        <input v-model="form.arrival" type="date" :disabled="!form.attending" />
      </label>

      <label class="field">
        <span>{{ t('planned_departure') }}</span>
        <input v-model="form.departure" type="date" :disabled="!form.attending" />
      </label>

      <label class="field">
        <span>{{ t('allergy') }}</span>
        <input v-model="form.allergy" type="text" :placeholder="t('allergy')" />
      </label>

      <label class="field">
        <span>{{ t('notes') }}</span>
        <textarea v-model="form.notes" rows="4" :placeholder="t('notes')"></textarea>
      </label>

      <div class="actions">
        <button type="submit" :disabled="submitting">
          {{ props.submitLabel || t('send_rsvp') }}
        </button>
      </div>

      <p v-if="sent" class="success">{{ t('success_message') }}</p>
      <p v-if="submitError" class="error">{{ submitError }}</p>
    </form>

    <div v-if="showLinkModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <h3>RSVP saved</h3>
        <p>You can use this link to update your RSVP later:</p>
        <div class="link-row">
          <input readonly class="copy-input" :value="generatedLink" />
          <button @click="copyLink">Copy</button>
        </div>
        <div style="margin-top:12px;text-align:right">
          <button @click="closeModal">Close</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'

type PrefillData = {
  name?: string
  attending?: boolean
  arrival?: string
  departure?: string
  allergy?: string
  notes?: string
}

const props = defineProps<{
  lang: string
  locales: Record<string, any>
  prefill?: PrefillData | null
  submitLabel?: string
  sheetId?: string | null
}>()

const emit = defineEmits<{
  (e: 'saved', payload: { id: string; action?: string }): void
}>()

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}

import { SHEET_ENDPOINT } from '../lib/sheetEndpoint'

const form = reactive({
  name: '',
  attending: true,
  arrival: '',
  departure: '',
  allergy: '',
  notes: '',
})

const sent = ref(false)
const submitting = ref(false)
const submitError = ref('')
const showLinkModal = ref(false)
const generatedId = ref('')

const generatedLink = computed(() => {
  const base = window.location.origin + (import.meta.env.BASE_URL || '/')
  const root = base.replace(/\/$/, '')
  return `${root}/#/${generatedId.value}`
})

function normalizeDate(value?: string) {
  if (!value) return ''
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString().slice(0, 10)
}

function applyPrefill(prefill?: PrefillData | null) {
  if (!prefill) return
  form.name = prefill.name ?? form.name
  form.attending = prefill.attending ?? form.attending
  form.arrival = normalizeDate(prefill.arrival)
  form.departure = normalizeDate(prefill.departure)
  form.allergy = prefill.allergy ?? form.allergy
  form.notes = prefill.notes ?? form.notes
}

watch(
  () => props.prefill,
  (prefill) => {
    applyPrefill(prefill)
  },
  { immediate: true, deep: true },
)

async function onSubmit() {
  const payload: Record<string, any> = {
    ID: props.sheetId || undefined,
    name: form.name.trim(),
    attending: !!form.attending,
    arrival: form.arrival || null,
    departure: form.departure || null,
    allergy: form.allergy || null,
    notes: form.notes || null,
    lang: props.lang,
    timestamp: new Date().toISOString(),
    Name: form.name.trim(),
    'RSVP status': form.attending ? 'Attending' : 'Declined',
    Allergies: form.allergy || '',
    Notes: form.notes || '',
    Arrival: form.arrival || '',
    Departure: form.departure || '',
  }

    try {
      submitting.value = true
      submitError.value = ''
      console.log('Posting RSVP to sheet endpoint:', SHEET_ENDPOINT)

    // If no sheetId present, generate a new unique 4-char alphanumeric ID and include it
    if (!props.sheetId) {
      const id = await generateUniqueId(4)
      payload.ID = id
      payload.id = id
    }

    // Use form-encoded POST (no JSON) to avoid CORS preflight blocking on Apps Script
    const formBody = new URLSearchParams()
    Object.keys(payload).forEach((k) => {
      const v = payload[k]
      formBody.append(k, v == null ? '' : String(v))
    })

    const response = await fetch(SHEET_ENDPOINT, {
      method: 'POST',
      body: formBody,
    })

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`)
    }

    const raw = await response.text()
    let result: any
    try {
      result = JSON.parse(raw)
    } catch (err) {
      console.error('Failed to parse JSON response from sheet endpoint:', raw)
      const short = raw ? String(raw).slice(0, 1000) : ''
      submitError.value = 'Invalid JSON response from server: ' + short
      throw new Error('Invalid JSON response from server: ' + short)
    }

    if (result.status !== 'success') {
      throw new Error(result.message || 'Submission failed')
    }

    console.log('RSVP submitted', { action: result.action || 'unknown', payload })

    // Notify parent that we've saved (updated or appended)
    try {
      const savedId = String(payload.ID || payload.id || '')
      emit('saved', { id: savedId, action: result.action })
    } catch (err) {
      // ignore emit errors
    }

    // If we appended (no prior ID), show the shareable link modal
    if (!props.sheetId) {
      generatedId.value = payload.ID
      try { window.location.hash = `#/${generatedId.value}` } catch (e) {}
      showLinkModal.value = true
    }

    sent.value = true
    setTimeout(() => (sent.value = false), 4000)
    if (!props.sheetId) {
      form.name = ''
      form.allergy = ''
      form.notes = ''
      form.arrival = ''
      form.departure = ''
      form.attending = true
    }
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Failed to submit RSVP.'
    console.error('Failed to save RSVP', e)
  } finally {
    submitting.value = false
  }
}

function generateId(length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < length; i++) out += chars.charAt(Math.floor(Math.random() * chars.length))
  return out
}

async function generateUniqueId(length = 4, attempts = 8) {
  for (let i = 0; i < attempts; i++) {
    const id = generateId(length)
    try {
      const resp = await fetch(SHEET_ENDPOINT, { cache: 'no-store' })
      if (!resp.ok) return id
      const payload = await resp.json()
      if (payload && payload.status === 'success' && Array.isArray(payload.data)) {
        const exists = payload.data.some((r: any) => String(r.ID || '').trim() === id)
        if (!exists) return id
        // else continue loop
      } else {
        // if sheet response unexpected, return id to avoid blocking
        return id
      }
    } catch (e) {
      // network error; return generated id as fallback
      return id
    }
  }
  // fallback: return a generated id even if duplicates may exist
  return generateId(length)
}

function copyLink() {
  const text = generatedLink.value
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
  } else {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function closeModal() {
  showLinkModal.value = false
}
</script>

<style scoped>
.rsvp-card {

  width: min(1040px, 100%);
  margin: 24px auto;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  background: #fff;
}
.rsvp-form { display:flex; flex-direction:column; gap:12px }
.field { display:flex; flex-direction:column }
.field span { font-weight:600; margin-bottom:6px }
.field input[type="text"], .field select, .field input[type="date"], .field textarea {
  padding:8px 10px; border:1px solid #ddd; border-radius:4px; font-family:inherit
}
.field textarea { resize:vertical }
.actions { margin-top:8px }
.actions button { padding:10px 14px; background:#0077cc; color:#fff; border:none; border-radius:6px }
.actions button:disabled { opacity: 0.7; cursor: wait }
.success { color:green; margin-top:8px }
.error { color:#9a3d32; margin-top:8px }

/* modal */
.modal-overlay { position:fixed; inset:0; display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.32);z-index:1200 }
.modal {
  background:#fff;
  border-radius:12px;
  padding:18px;
  min-width:320px;
  width: min(760px, calc(100vw - 2rem));
  max-width: 760px;
  box-shadow:0 20px 60px rgba(0,0,0,0.2)
}
.link-row { display:flex;gap:8px;align-items:center }
.copy-input { flex:1;padding:8px;border:1px solid #ddd;border-radius:6px }
.actions button {
  transition: transform 0.08s ease, box-shadow 0.12s ease, background-color 0.12s ease;
}
.actions button:hover:not(:disabled) {
  background: #005fa3;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}
.actions button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}

.modal button {
  padding:8px 12px;border-radius:8px;border:none;background:#3b82f6;color:#fff;
  transition: transform 0.08s ease, box-shadow 0.12s ease, background-color 0.12s ease;
}
.modal button:hover {
  background:#2b6fda; box-shadow:0 6px 18px rgba(0,0,0,0.12); transform: translateY(-1px);
}
.modal button:active { transform: translateY(0); box-shadow:0 3px 10px rgba(0,0,0,0.12) }

</style>
