<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import { useValidationStore } from '@/stores/validation'
import { deToen, deCurrency } from '@/use/useUtil'

const validationStore = useValidationStore()

const emit = defineEmits(['update:modelValue', 'update:currency', 'blur'])
const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    required: true
  },
  label: { type: String },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: { type: String },
  appendIcon: { type: String, default: '€' },
  errorField: { type: String },
  labelClasses: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
  stack: { type: Boolean, default: false },
  errors: {
    type: Object,
    default: () => { }
  },
  currency: {
    type: [String, Number, null],
    required: false
  },
})

const onChange = e => {
  const value = e.target.value
  emit('update:modelValue', deToen(value))
  emit('update:currency', value)


  delete validationStore.errors[props.errorField]
}

// const onBlur = e => {
//   emit('blur:modelValue', e.target.value)
// }

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

const onBlur = (e) => {
  emit('blur', e, props.modelValue)

  emit('update:currency', deCurrency(props.modelValue))

}
</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" :class="props.stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <label class="label" :class="`${props.hideLabel ? 'hide_label': ''} ${props.labelClasses}`">{{ label }}</label>
    </div>

    <div :class="`${(props.label && !props.stack) ? 'col-md-8' : 'col-md-12'}`">
      <div class="input-group">
        <input @input="onChange" @blur="onBlur" :value="props.currency" :type="props.type" :readonly="props.readonly" class="form-control border-end-0" :class="{'border-danger has_error': getError || hasError}" :disabled="props.disabled" :placeholder="placeholder">
        <span class="input-group-text px-3 border-end-0 border-top-0 border-bottom-0" style="background: #eee;" :class="{'border-danger has_error': getError || hasError}" :disabled="props.disabled">
          {{props.appendIcon}}
        </span>
      </div>
      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.hide_label {
  opacity: 0;
}
.label {
  color: #666666;
}
.append__icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
