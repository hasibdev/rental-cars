<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { useValidationStore } from '@/stores/validation'
import _ from "lodash"

const validationStore = useValidationStore()

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number, null, Boolean],
    required: false
  },
  label: { type: String },
  labelClasses: { type: String, default: '' },
  errorField: { type: String },
  hideLabel: { type: Boolean, default: false },
  stack: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  name: { type: String, default: `radio_control${_.random(100)}${_.random(100)}` },
  errors: {
    type: Object,
    default: () => { }
  }
})

const onChange = e => {
  emit('update:modelValue', e.target.value)

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
    <div v-if="props.label" :class="props.stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <label class="label" :class="`${props.hideLabel ? 'hide_label' : ''} ${props.labelClasses}`">{{ label }}</label>
    </div>

    <div :class="`${(props.label && !props.stack) ? 'col-md-8' : 'col-md-12'}`">
      <label v-for="(opt, i) in props.options" :key="i" class="option__label">
        <input type="radio" :name="props.name" @input="onChange" :value="opt.value" :checked="opt.value == modelValue" class="form-check-input mt-0" :class="{'border-danger has_error': getError || hasError}" />
        <span>{{ opt.label }}</span>
      </label>

      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.hide_label {
  opacity: 0;
}

.option__label {
  display: inline-flex;
  align-items: center;

  &:not(:last-child) {
    margin-right: 1rem;
  }
  span {
    margin-left: 8px;
    line-height: 13px;
  }
}
</style>
