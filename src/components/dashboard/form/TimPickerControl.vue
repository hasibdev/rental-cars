<script setup>
import { ref, onMounted, watch, computed, defineEmits, defineProps } from 'vue'
import { DatePicker } from 'v-calendar'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'

import 'v-calendar/dist/style.css'

const validationStore = useValidationStore()
const { locale } = useI18n({ useScope: 'global' })

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [Object, Date, String, Number, null],
    required: true
  },
  label: { type: String },
  errorField: { type: String },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: "Select Time" },
  stack: { type: Boolean, default: false },
})

const time = ref()
onMounted(() => {
  if (props.modelValue) {
    time.value = props.modelValue
  }
})
watch(() => props.modelValue, () => {
  time.value = props.modelValue
})
watch(() => time.value, (val) => {
  emit('update:modelValue', val)

  delete validationStore.errors[props.errorField]
})
const masks = {
  input: ['HH:mm']
}
const modelConfig = {
  type: 'string',
  mask: 'HH:mm:ss', // Uses 'iso' if missing
}

const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] && validationStore.errors[props.errorField][0]
})

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" :class="props.stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <label class="label">{{ label }}</label>
    </div>

    <div :class="`${(props.label && !props.stack) ? 'col-md-8' : 'col-md-12'}`">
      <DatePicker v-model="time" mode="time" :popover="{visibility: 'click'}" :masks="masks" :model-config="modelConfig" :locale="locale">

        <template v-slot="{ inputValue, inputEvents }">
          <div class="input-wrapper">
            <input :disabled="disabled" :readonly="props.readonly" :placeholder="props.placeholder" :value="inputValue" v-on="inputEvents" class="form-control pointer" :class="{'border-danger has_error': hasError}" />
            <span class="icon-wrapper">
              <slot name="apend-icon">
                <ClockIcon />
              </slot>
            </span>
          </div>
        </template>

      </DatePicker>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  .icon-wrapper {
    position: absolute;
    right: 10px;
    top: 8px;
  }
}
.vc-time-date {
  display: none !important;
  visibility: hidden !important;
}
</style>
