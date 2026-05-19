<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import locales from './locales/rsvp.json'

const supported = Object.keys(locales)
const defaultLang = (typeof navigator !== 'undefined' && navigator.language)
	? navigator.language.split('-')[0]
	: 'en'

const lang = ref(supported.includes(defaultLang) ? defaultLang : 'en')
const route = useRoute()

const t = (key: string) => (locales as any)[lang.value]?.[key] || (locales as any)['en']?.[key] || key

const inviteBase = computed(() => {
	const raw = route.params.inviteCode
	return typeof raw === 'string' && /^[A-Za-z0-9]{4}$/.test(raw) ? `/${raw}` : ''
})

const navItems = computed(() => [
	{ to: inviteBase.value || '/', label: t('home') },
	{ to: inviteBase.value ? `${inviteBase.value}/program` : '/program', label: t('program') },
	{ to: inviteBase.value ? `${inviteBase.value}/information` : '/information', label: t('information') },
])
</script>

<template>
	<div class="app-shell">
		<header class="topbar">
			<div class="brand">
				<p class="eyebrow">Wedding Invitation</p>
				<h1>Starigrad</h1>
			</div>

			<div class="top-controls">
				<nav class="nav">
					<RouterLink
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						class="nav-link"
						active-class="is-active"
					>
						{{ item.label }}
					</RouterLink>
				</nav>

				<label class="language-picker">
					<span>{{ t('language') }}</span>
					<select v-model="lang">
						<option value="en">{{ t('english') }}</option>
						<option value="no">{{ t('norwegian') }}</option>
						<option value="ja">{{ t('japanese') }}</option>
					</select>
				</label>
			</div>
		</header>

		<main class="page-shell">
			<RouterView v-slot="{ Component }">
				<component :is="Component" :lang="lang" :locales="locales" />
			</RouterView>
		</main>
	</div>
</template>

<style scoped>
.app-shell {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.topbar {
	display: grid;
	grid-template-columns: 1fr auto auto;
	gap: 1rem;
	align-items: center;
	padding: 1.25rem 1.5rem;
	position: sticky;
	top: 0;
	z-index: 10;
	backdrop-filter: blur(14px);
	background: rgba(255, 250, 247, 0.78);
	border-bottom: 1px solid rgba(194, 144, 126, 0.18);
}

.brand {
	text-align: left;
}

.eyebrow {
	margin: 0 0 0.25rem;
	font-size: 0.76rem;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: var(--muted);
}

.brand h1 {
	margin: 0;
	font-size: 1.75rem;
	line-height: 1;
}

.nav {
	display: flex;
	gap: 0.6rem;
	justify-content: center;
	flex-wrap: wrap;
}

.nav-link {
	padding: 0.65rem 1rem;
	border-radius: 999px;
	text-decoration: none;
	color: var(--muted-strong);
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(194, 144, 126, 0.15);
	transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.nav-link:hover {
	transform: translateY(-1px);
	box-shadow: 0 12px 24px rgba(135, 93, 77, 0.12);
}

.nav-link.is-active {
	background: linear-gradient(135deg, rgba(179, 95, 95, 0.14), rgba(233, 201, 172, 0.3));
	color: var(--ink);
	border-color: rgba(179, 95, 95, 0.24);
}

.language-picker {
	display: inline-flex;
	align-items: center;
	gap: 0.55rem;
	padding: 0.4rem 0.65rem;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(194, 144, 126, 0.15);
	color: var(--muted-strong);
}

.language-picker span {
	font-size: 0.85rem;
}

.language-picker select {
	border: 0;
	background: transparent;
	color: var(--ink);
	font: inherit;
	outline: none;
}

.top-controls {
	display: flex;
	align-items: center;
	gap: 0.6rem;
	flex-wrap: wrap;
	width: 100%;
}

.nav {
	flex: 1 1 auto;
}

.language-picker {
	flex: 0 0 auto;
}

.page-shell {
	flex: 1;
	padding: 1.5rem;
}

@media (max-width: 900px) {
	.topbar {
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}

	.brand {
		grid-column: 1 / -1;
	}

	.top-controls {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
