<script setup lang="ts">
import { ref } from 'vue'
import RSVPForm from './components/RSVPForm.vue'
import locales from './locales/rsvp.json'

const supported = Object.keys(locales)
const defaultLang = (typeof navigator !== 'undefined' && navigator.language)
	? navigator.language.split('-')[0]
	: 'en'

const lang = ref(supported.includes(defaultLang) ? defaultLang : 'en')

const t = (key: string) => (locales as any)[lang.value]?.[key] || (locales as any)['en']?.[key] || key
</script>

<template>
	<header style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px">
		<h1>Invitation</h1>
		<label style="font-size:0.95rem">
			{{ t('language') }}
			<select v-model="lang">
				<option value="en">{{ t('english') }}</option>
				<option value="no">{{ t('norwegian') }}</option>
				<option value="ja">{{ t('japanese') }}</option>
			</select>
		</label>
	</header>

	<main>
		<RSVPForm :lang="lang" :locales="locales" />
	</main>
</template>

<style scoped>
main { padding:24px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial }
</style>
