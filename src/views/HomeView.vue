<template>
  <section class="home-view">
    <div class="hero-card">
      <p class="eyebrow">{{ t('home_eyebrow') }}</p>
      <h2>{{ t('home_title') }}</h2>
      <p class="lead">
        {{ t('home_lead') }}
      </p>
    </div>

    <img src="@/assets/starigrad.webp" alt="Starigrad" class="featured-image" />

    <RSVPForm :lang="lang" :locales="locales" />
  </section>
</template>

<script setup lang="ts">
import RSVPForm from '../components/RSVPForm.vue'

const props = defineProps<{ lang: string; locales: Record<string, any> }>()

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 1040px;
  margin: 0 auto;
}

.hero-card,
.info-card {
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

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 1.1rem 1.2rem;
  text-align: left;
}

.info-card.accent {
  background: linear-gradient(135deg, rgba(179, 95, 95, 0.12), rgba(233, 201, 172, 0.26));
}

.info-card h3 {
  margin: 0 0 0.4rem;
  color: var(--ink);
}

.info-card p {
  color: var(--muted-strong);
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
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
