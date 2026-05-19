<template>
  <section class="page-view">
    <article class="page-card">
      <p class="eyebrow">{{ t('program_schedule_eyebrow') }}</p>
      <h2>{{ t('program_schedule_title') }}</h2>
      <p class="intro">{{ t('program_schedule_intro') }}</p>

      <div class="timeline">
        <section class="day-block">
          <h3>{{ t('program_day_thu') }}</h3>
          <div class="timeline-item">
            <span class="time">{{ t('program_thu_event1_time') }}</span>
            <div>
              <h4>{{ t('program_thu_event1_title') }}</h4>
              <p>
                {{ t('program_thu_event1_p1') }}
              </p>
            </div>
          </div>
        </section>

        <section class="day-block">
          <h3>{{ t('program_day_fri') }}</h3>
          <div class="timeline-item">
            <span class="time">{{ t('program_fri_event1_time') }}</span>
            <div>
              <h4>{{ t('program_fri_event1_title') }}</h4>
              <p>{{ t('program_fri_event1_p1') }}</p>
              <p>{{ t('program_fri_event1_p2') }}</p>
              <p>{{ t('program_fri_event1_p3') }}</p>
            </div>
          </div>

          <div class="timeline-item">
            <span class="time">{{ t('program_fri_event2_time') }}</span>
            <div>
              <h4>{{ t('program_fri_event2_title') }}</h4>
              <p>{{ t('program_fri_event2_p1') }}</p>
            </div>
          </div>
        </section>

        <section class="day-block">
          <h3>{{ t('program_day_sat') }}</h3>
          <div class="timeline-item">
            <span class="time">{{ t('program_sat_event1_time') }}</span>
            <div>
              <h4>{{ t('program_sat_event1_title') }}</h4>
              <p>{{ t('program_sat_event1_p1') }}</p>
            </div>
          </div>

          <div class="timeline-item">
            <span class="time">{{ t('program_sat_event2_time') }}</span>
            <div>
              <h4>{{ t('program_sat_event2_title') }}</h4>
            </div>
          </div>

          <div class="timeline-item">
            <span class="time">{{ t('program_sat_event3_time') }}</span>
            <div>
              <h4>{{ t('program_sat_event3_title') }}</h4>
              <p>{{ t('program_sat_event3_p1') }}</p>
            </div>
          </div>
        </section>

        <section class="day-block">
          <h3>{{ t('program_day_sun') }}</h3>
          <div class="timeline-item">
            <span class="time">{{ t('program_sun_event1_time') }}</span>
            <div>
              <h4>{{ t('program_sun_event1_title') }}</h4>
              <p>{{ t('program_sun_event1_p1') }}</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ lang: string; locales: Record<string, any> }>()

const t = (key: string) => {
  return props.locales?.[props.lang]?.[key] || props.locales?.['en']?.[key] || key
}
</script>

<style scoped>
.page-view {
  max-width: 860px;
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

.timeline {
  display: grid;
  gap: 1.35rem;
  margin-top: 1.4rem;
}

.day-block {
  display: grid;
  gap: 0.8rem;
}

.day-block h3 {
  margin: 0;
  font-size: 1.28rem;
  color: var(--ink);
}

.timeline-item {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 1rem;
  align-items: start;
  padding: 1rem 1.05rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(194, 144, 126, 0.12);
}

.time {
  font-weight: 700;
  color: #a64a4a;
}

.timeline-item h3 {
  margin: 0 0 0.25rem;
}

.timeline-item h4 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.timeline-item p {
  margin: 0.35rem 0 0;
  color: var(--muted-strong);
}

@media (max-width: 700px) {
  .timeline-item {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
