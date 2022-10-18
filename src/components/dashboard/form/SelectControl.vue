<script setup>
import { useValidationStore } from "@/stores/validation"
import _ from "lodash"
import { computed, defineEmits, defineProps } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n({ useScope: 'global' })
const validationStore = useValidationStore()

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  id: {
    type: [String, Number],
    default: () => `select_control${_.random(100)}${_.random(100)}`,
  },
  modelValue: {
    type: [String, Number, null],
    required: true,
  },
  label: { type: String },
  options: {
    type: Array,
    required: true,
  },
  trackBy: {
    type: String,
    default: "id",
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  errorField: { type: String },
  labelClasses: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  stack: { type: Boolean, default: false },
  placeholder: { type: String },
  caret: { type: String },
  errors: {
    type: Object,
    default: () => { }
  }
})

const onSelect = (e) => {
  emit("update:modelValue", e.target.value)

  delete validationStore.errors[props.errorField]
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
    <div v-if="props.label" :class="props.stack ? 'col-md-12 mb-1' : 'col-xl-4'">
      <label class="label" :class="`${props.hideLabel ? 'hide_label': ''} ${props.labelClasses}`" :for=" props.id">{{ label }}</label>
    </div>
    <div :class="`${(props.label && !props.stack) ? 'col-xl-8' : 'col-md-12'}`">
      <select @change="onSelect" :id="props.id" :disabled="props.disabled || props.readonly" :value="modelValue" class="form-select" :class="{
          'border-danger has_error': Boolean(getError) || hasError,
          'readonly': props.readonly,
          'caret-clock': props.caret === 'clock'
        }">
        <option value=""> {{ props.placeholder || t('form-fields.please-select') }}</option>
        <option v-for="(opt, i) in props.options" :key="i" :value="opt[props.trackBy]" :selected="opt[props.trackBy] === modelValue">
          {{ opt[props.optionLabel] }}
        </option>
      </select>

      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.label {
  color: #666666;
}

// select {
//   opacity: 0.9;
// }
select::placeholder {
  color: #666666;
  opacity: 0.9;
}
</style>
