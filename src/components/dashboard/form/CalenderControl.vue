<script setup>
import { ref, onMounted, watch, computed, defineEmits, defineProps } from 'vue'
import { DatePicker } from 'v-calendar'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'

import 'v-calendar/dist/style.css'

const validationStore = useValidationStore()
const { t, locale } = useI18n({ useScope: 'global' })

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [Object, Date, String, Number, null],
    required: true
  },
  label: { type: String },
  labelClasses: { type: String, default: '' },
  errorField: { type: String },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String },
  stack: { type: Boolean, default: false },
  minDate: { type: [Date, String] },
  maxDate: { type: [Date, String] },
  errors: {
    type: Object,
    default: () => { }
  }
})



const date = ref()
onMounted(() => {
  if (props.modelValue) {
    date.value = props.modelValue
  }
})
watch(() => props.modelValue, () => {
  date.value = props.modelValue
})
watch(() => date.value, (val) => {
  emit('update:modelValue', val)

  delete validationStore.errors[props.errorField]
})
// const masks = {
//   input: ['DD/MM/YYYY', 'L']
// }
let masks = {
  input: []
}
if (locale.value == 'en') {
  masks = {
    input: ['DD/MM/YYYY', 'L']
  }
}
else if (locale.value == 'de') {
  masks = {
    input: ['DD.MM.YYYY', 'L']
  }
}
const modelConfig = {
  type: 'string',
  mask: 'YYYY/MM/DD', // Uses 'iso' if missing
}


const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] && validationStore.errors[props.errorField][0]
})

const getError = computed(() => {
  if (props.errors?.$errors?.length) {
    const find = props.errors?.$errors?.find(err => err.$property == props.errorField)
    if (find) {
      return find.$message
    }
  }
  return ''
})

</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" :class="`${props.stack ? 'col-md-12 mb-1' : 'col-xl-4'}`">
      <label :class="`label ${props.labelClasses}`">{{ label }}</label>
    </div>

    <div :class="`${(props.label && !props.stack) ? 'col-xl-8' : 'col-md-12'}`">
      <DatePicker v-model="date" :min-date="props.minDate" :max-date="props.maxDate" :popover="{visibility: 'click'}" :masks="masks" :model-config="modelConfig" :locale="locale">

        <template v-slot="{ inputValue, inputEvents }">
          <div class="input-wrapper">
            <input :disabled="disabled || props.readonly" :readonly="props.readonly" :placeholder="props.placeholder || t('form-fields.select-date')" :value="inputValue" v-on="inputEvents" class="form-control" :class="{'border-danger has_error': getError || hasError, 'pointer': !props.readonly}" />
            <span class="icon-wrapper">
              <slot name="apend-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M16 2V6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8 2V6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3 10H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </slot>
            </span>
          </div>
        </template>

      </DatePicker>

      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{getError || errorMsg }}</p>
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
.label {
  color: #666666;
}
input::placeholder {
  color: var(--color-text) !important;
  opacity: 0.9;
}
</style>
