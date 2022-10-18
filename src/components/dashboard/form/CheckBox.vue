<script setup>
import { computed, defineEmits, defineProps } from 'vue'
import _ from 'lodash'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  id: {
    type: String,
    default: () => `action_dropdown${_.random(100)}${_.random(100)}`
  },
  modelValue: {
    type: [Boolean, Array],
    required: false
  },
  label: { type: String },
  value: { type: [String, Number, Boolean] },
  disabled: { type: Boolean, default: false },
  labelClasses: { type: String, default: '' }
})


const onChange = e => {
  if (typeof props.modelValue == 'object') {
    let values = [...props.modelValue]

    if (e.target.checked) values.push(props.value)
    else values = values.filter(v => v !== props.value)

    emit('update:modelValue', values)

  } else {
    emit('update:modelValue', e.target.checked)
  }
}

const getChecked = computed(() => {
  if (typeof props.modelValue == 'object') {
    return props.modelValue?.includes(props.value)
  }

  return props.modelValue
})

</script>

<template>
  <div class="form-check">
    <input :checked="getChecked" @input="onChange" type="checkbox" :disabled="props.disabled" :id="props.id" :class="`${props.labelClasses}`" class="form-check-input">
    <label class="form-check-label ms-2 mt-1 label" :for="props.id" style="font-size: 14px;">
      {{ props.label }}
    </label>
  </div>
</template>


<style lang="scss" scoped>
</style>
