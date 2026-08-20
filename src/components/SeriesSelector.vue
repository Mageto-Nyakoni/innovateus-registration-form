<script setup>
import { computed } from 'vue'

const model = defineModel({ required: true })

const props = defineProps({
  series: {
    type: Array,
    required: true
  }
})

const selectedCount = computed(() => model.value.length)

function toggleSeries(id) {
  if (model.value.includes(id)) {
    model.value = model.value.filter((entry) => entry !== id)
    return
  }

  model.value = [...model.value, id]
}

function selectAll() {
  model.value = props.series.map((entry) => entry.id)
}

function clearAll() {
  model.value = []
}

function isChecked(id) {
  return model.value.includes(id)
}
</script>

<template>
  <section class="series-selector" aria-labelledby="series-title">
    <div class="series-selector__header">
      <div>
        <h3 id="series-title" class="series-selector__title">Selected Event Series</h3>
        <p class="series-selector__summary">
          You are registering for {{ selectedCount }} event
          {{ selectedCount === 1 ? 'series' : 'series entries' }}.
        </p>
      </div>
    </div>

    <div class="series-selector__toolbar">
      <button type="button" class="button button--secondary button--small" @click="selectAll">
        Select All Series
      </button>
      <p class="series-selector__toolbar-copy">Select at least one series to continue.</p>
      <button
        v-if="selectedCount"
        type="button"
        class="series-selector__clear"
        @click="clearAll"
      >
        Clear
      </button>
    </div>

    <ul class="series-selector__list">
      <li v-for="entry in series" :key="entry.id" class="series-selector__item">
        <label class="series-card">
          <input
            class="series-card__checkbox"
            type="checkbox"
            :checked="isChecked(entry.id)"
            @change="toggleSeries(entry.id)"
          />
          <span class="series-card__badge" aria-hidden="true">{{ entry.badge }}</span>
          <span class="series-card__title">{{ entry.title }}</span>
        </label>
      </li>
    </ul>
  </section>
</template>
