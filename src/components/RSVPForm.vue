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

      <label class="field inline">
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
        <button type="submit">{{ t('send_rsvp') }}</button>
      </div>

      <p v-if="sent" class="success">{{ t('success_message') }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{ lang: string; locales: Record<string, any> }>()

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}

const form = reactive({
  name: '',
  attending: true,
  arrival: '',
  departure: '',
  allergy: '',
  notes: ''
})

const sent = ref(false)

function onSubmit() {
  const payload = {
    name: form.name.trim(),
    attending: !!form.attending,
    arrival: form.arrival || null,
    departure: form.departure || null,
    allergy: form.allergy || null,
    notes: form.notes || null,
    lang: props.lang,
    timestamp: new Date().toISOString()
  }

  try {
    const listRaw = localStorage.getItem('rsvps') || '[]'
    const list = JSON.parse(listRaw)
    list.push(payload)
    localStorage.setItem('rsvps', JSON.stringify(list))
    console.log('RSVP saved', payload)
    sent.value = true
    setTimeout(() => (sent.value = false), 4000)
    form.name = ''
    form.allergy = ''
    form.notes = ''
  } catch (e) {
    console.error('Failed to save RSVP', e)
  }
}
</script>

<style scoped>
.rsvp-card {
  max-width: 520px;
  margin: 24px auto;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  background: #fff;
}
.rsvp-form { display:flex; flex-direction:column; gap:12px }
.field { display:flex; flex-direction:column }
.field.inline { flex-direction:row; align-items:center; gap:12px }
.field span { font-weight:600; margin-bottom:6px }
.field input[type="text"], .field select, .field input[type="date"], .field textarea {
  padding:8px 10px; border:1px solid #ddd; border-radius:4px; font-family:inherit
}
.field textarea { resize:vertical }
.actions { margin-top:8px }
.actions button { padding:10px 14px; background:#0077cc; color:#fff; border:none; border-radius:6px }
.success { color:green; margin-top:8px }
</style>
