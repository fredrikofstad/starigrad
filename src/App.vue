<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<div class="app-shell">
		<header class="topbar">
			<h1>Starigrad</h1>
			<nav>
				<RouterLink to="/">Home</RouterLink>
				<RouterLink to="/about">About</RouterLink>
			</nav>
		</header>

		<main>
			<RouterView />
		</main>
	</div>
</template>

<style scoped>
.app-shell {
	width: 100%;
}

.topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.5rem;
	border-bottom: 1px solid var(--border);
}

h1 {
	margin: 0;
	font-size: 1.5rem;
}

nav {
	display: flex;
	gap: 0.8rem;
}

a {
	text-decoration: none;
	color: var(--text-h);
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
}

a.router-link-active {
	background: var(--accent-bg);
	color: var(--accent);
}

main {
	padding: 1.5rem;
	text-align: left;
}
</style>
