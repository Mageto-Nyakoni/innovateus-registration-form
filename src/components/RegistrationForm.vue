<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import {
  countryOptions,
  governmentLevelOptions,
  governmentOrganizationOptions,
  usStateOptions,
  workshopSeries
} from '../data/registrationOptions'
import FormField from './FormField.vue'
import FormSelect from './FormSelect.vue'
import NewsletterOptIn from './NewsletterOptIn.vue'
import SectionHeading from './SectionHeading.vue'
import SeriesSelector from './SeriesSelector.vue'

const formRef = ref(null)
const submissionNotice = ref('')
const submissionError = ref('')
const isSubmitting = ref(false)
const hasAttemptedSubmit = ref(false)
const validationErrors = reactive({
  email: '',
  first_name: '',
  last_name: '',
  country: '',
  state: '',
  non_us_country: '',
  gov_org: '',
  gov_level: '',
  workshop_series: ''
})

const form = reactive({
  email: '',
  first_name: '',
  last_name: '',
  country_mode: '',
  non_us_country: '',
  state: '',
  gov_org: '',
  gov_level: '',
  workshop_series: [],
  newsletter: false,
  website: ''
})

const requiresState = computed(() => form.country_mode === 'United States')
const requiresNonUsCountry = computed(() => form.country_mode === 'Outside the United States')
const requiresGovLevel = computed(() => form.gov_org.startsWith('Yes'))
const resolvedCountry = computed(() =>
  requiresState.value ? 'United States' : form.non_us_country.trim()
)

const selectedSeriesTitles = computed(() =>
  workshopSeries
    .filter((entry) => form.workshop_series.includes(entry.id))
    .map((entry) => entry.title)
)

const directusPayload = computed(() => {
  const payload = {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    email: form.email.trim(),
    country: resolvedCountry.value,
    gov_org: form.gov_org,
    workshop_series: selectedSeriesTitles.value.join(', '),
    newsletter: Boolean(form.newsletter)
  }

  if (requiresState.value && form.state) {
    payload.state = form.state
  }

  if (requiresGovLevel.value && form.gov_level) {
    payload.gov_level = form.gov_level
  }

  return payload
})

const validationFieldOrder = computed(() => {
  const fields = ['email', 'first_name', 'last_name', 'country']

  if (requiresState.value) {
    fields.push('state')
  } else if (requiresNonUsCountry.value) {
    fields.push('non_us_country')
  }

  fields.push('gov_org')

  if (requiresGovLevel.value) {
    fields.push('gov_level')
  }

  fields.push('workshop_series')

  return fields
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function setValidationError(field, message) {
  validationErrors[field] = message
  return false
}

function clearValidationError(field) {
  validationErrors[field] = ''
  return true
}

function validateField(field) {
  switch (field) {
    case 'email': {
      const value = normalizeText(form.email)

      if (!value) {
        return setValidationError('email', 'Email is required.')
      }

      if (!emailPattern.test(value)) {
        return setValidationError('email', 'Enter a valid email address.')
      }

      return clearValidationError('email')
    }

    case 'first_name':
      return normalizeText(form.first_name)
        ? clearValidationError('first_name')
        : setValidationError('first_name', 'First name is required.')

    case 'last_name':
      return normalizeText(form.last_name)
        ? clearValidationError('last_name')
        : setValidationError('last_name', 'Last name is required.')

    case 'country':
      return form.country_mode
        ? clearValidationError('country')
        : setValidationError('country', 'Select a country.')

    case 'state':
      if (!requiresState.value) {
        return clearValidationError('state')
      }

      return normalizeText(form.state)
        ? clearValidationError('state')
        : setValidationError('state', 'Select a state.')

    case 'non_us_country':
      if (!requiresNonUsCountry.value) {
        return clearValidationError('non_us_country')
      }

      return normalizeText(form.non_us_country)
        ? clearValidationError('non_us_country')
        : setValidationError('non_us_country', 'Enter your country.')

    case 'gov_org':
      return form.gov_org
        ? clearValidationError('gov_org')
        : setValidationError('gov_org', 'Select whether you support a government organization.')

    case 'gov_level':
      if (!requiresGovLevel.value) {
        return clearValidationError('gov_level')
      }

      return form.gov_level
        ? clearValidationError('gov_level')
        : setValidationError('gov_level', 'Select the government level.')

    case 'workshop_series':
      return form.workshop_series.length > 0
        ? clearValidationError('workshop_series')
        : setValidationError('workshop_series', 'Select at least one event series before continuing.')

    default:
      return true
  }
}

function validateForm() {
  let isValid = true

  validationFieldOrder.value.forEach((field) => {
    isValid = validateField(field) && isValid
  })

  return isValid
}

function shouldValidateField(field) {
  return hasAttemptedSubmit.value || Boolean(validationErrors[field])
}

function handleFieldInput(field) {
  if (shouldValidateField(field)) {
    validateField(field)
  }
}

function handleFieldChange(field) {
  if (shouldValidateField(field)) {
    validateField(field)
  }
}

async function focusFirstInvalidField() {
  await nextTick()

  for (const field of validationFieldOrder.value) {
    if (!validationErrors[field]) {
      continue
    }

    const selector =
      field === 'country'
        ? '#country'
        : field === 'workshop_series'
          ? '.series-card__checkbox'
          : `#${field}`

    const element = formRef.value?.querySelector(selector)

    if (element instanceof HTMLElement) {
      element.focus()
      break
    }
  }
}

watch(
  () => form.country_mode,
  (mode) => {
    if (mode === 'United States') {
      form.non_us_country = ''
    } else if (mode === 'Outside the United States') {
      form.state = ''
    } else {
      form.state = ''
      form.non_us_country = ''
    }

    clearValidationError('state')
    clearValidationError('non_us_country')

    if (hasAttemptedSubmit.value) {
      validateField('country')
      validateField('state')
      validateField('non_us_country')
    }
  }
)

watch(
  () => form.gov_org,
  (value) => {
    if (!value.startsWith('Yes')) {
      form.gov_level = ''
    }

    clearValidationError('gov_level')

    if (hasAttemptedSubmit.value) {
      validateField('gov_org')
      validateField('gov_level')
    }
  }
)

watch(
  () => form.workshop_series.length,
  () => {
    if (shouldValidateField('workshop_series')) {
      validateField('workshop_series')
    }
  }
)

async function handleSubmit() {
  if (isSubmitting.value) {
    return
  }

  hasAttemptedSubmit.value = true
  submissionNotice.value = ''
  submissionError.value = ''

  if (!validateForm()) {
    await focusFirstInvalidField()
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('/.netlify/functions/submit-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...directusPayload.value,
        newsletter: Boolean(form.newsletter),
        website: form.website
      })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(result.error || 'Registration submission failed.')
    }

    submissionNotice.value = 'Registration submitted successfully.'
  } catch (error) {
    submissionError.value =
      error instanceof Error ? error.message : 'Registration submission failed.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="registration-wrap">
    <div class="registration-card">
      <SectionHeading label="Registration Details" compact />

      <form ref="formRef" class="registration-form" novalidate @submit.prevent="handleSubmit">
        <FormField
          id="email"
          v-model="form.email"
          label="Email *"
          type="email"
          placeholder="your.email@example.com"
          autocomplete="email"
          :error="validationErrors.email"
          required
          @blur="handleFieldChange('email')"
          @input="handleFieldInput('email')"
        />

        <div class="registration-form__row">
          <FormField
            id="first_name"
            v-model="form.first_name"
            label="First Name *"
            placeholder="John"
            autocomplete="given-name"
            :error="validationErrors.first_name"
            required
            @blur="handleFieldChange('first_name')"
            @input="handleFieldInput('first_name')"
          />
          <FormField
            id="last_name"
            v-model="form.last_name"
            label="Last Name *"
            placeholder="Doe"
            autocomplete="family-name"
            :error="validationErrors.last_name"
            required
            @blur="handleFieldChange('last_name')"
            @input="handleFieldInput('last_name')"
          />
        </div>

        <div class="registration-form__row">
          <FormSelect
            id="country"
            v-model="form.country_mode"
            label="Country *"
            :options="countryOptions"
            :error="validationErrors.country"
            required
            @blur="handleFieldChange('country')"
            @change="handleFieldChange('country')"
          />

          <FormSelect
            v-if="requiresState"
            id="state"
            v-model="form.state"
            label="State *"
            :options="usStateOptions"
            :error="validationErrors.state"
            required
            @blur="handleFieldChange('state')"
            @change="handleFieldChange('state')"
          />
          <FormField
            v-else-if="requiresNonUsCountry"
            id="non_us_country"
            v-model="form.non_us_country"
            label="Country (Outside the United States) *"
            placeholder="Enter your country"
            autocomplete="country-name"
            :error="validationErrors.non_us_country"
            required
            @blur="handleFieldChange('non_us_country')"
            @input="handleFieldInput('non_us_country')"
          />
          <div v-else class="form-control form-control--empty" aria-hidden="true"></div>
        </div>

        <div class="registration-form__row registration-form__row--narrow registration-form__row--aligned-selects">
          <FormSelect
            id="gov_org"
            v-model="form.gov_org"
            label="Do you work for or primarily support a government or government-affiliated organization? *"
            :options="governmentOrganizationOptions"
            :error="validationErrors.gov_org"
            required
            @blur="handleFieldChange('gov_org')"
            @change="handleFieldChange('gov_org')"
          />

          <FormSelect
            v-if="requiresGovLevel"
            id="gov_level"
            v-model="form.gov_level"
            label="If you selected yes above: What level of government? *"
            :options="governmentLevelOptions"
            :error="validationErrors.gov_level"
            required
            @blur="handleFieldChange('gov_level')"
            @change="handleFieldChange('gov_level')"
          />
          <div v-else class="form-control form-control--empty" aria-hidden="true"></div>
        </div>

        <SeriesSelector
          v-model="form.workshop_series"
          :series="workshopSeries"
          :error="validationErrors.workshop_series"
        />

        <NewsletterOptIn v-model="form.newsletter" />

        <div class="honeypot" aria-hidden="true">
          <label for="website">Website (leave blank)</label>
          <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="registration-form__actions">
          <button type="submit" class="button button--primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Register' }}
          </button>
        </div>

        <p class="registration-form__help">
          Having trouble registering? Contact us at hello [at] innovate-us.org
        </p>

        <div v-if="submissionNotice" class="submission-preview" aria-live="polite">
          <p class="submission-preview__title">{{ submissionNotice }}</p>
        </div>

        <div v-if="submissionError" class="submission-preview" aria-live="polite" role="alert">
          <p class="submission-preview__title">{{ submissionError }}</p>
        </div>
      </form>
    </div>
  </section>
</template>
