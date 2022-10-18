<script setup>
import { computed, ref, defineEmits, defineProps, watch } from 'vue'
import { useValidationStore } from '@/stores/validation'

const validationStore = useValidationStore()

const emit = defineEmits(['update:modelValue'])
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
  bg: {
    type: String,
    default: '#fff'
  },
  placeholder: { type: String },
  errorField: { type: String }
})

const text = ref('')

watch(() => text.value, (val) => {
  emit('update:modelValue', val)

  delete validationStore.errors[props.errorField]
})
watch(() => props.modelValue, (val) => {
  text.value = val
}, { immediate: true })


const hasError = computed(() => {
  return props.errorField && validationStore.errors[props.errorField]
})
const errorMsg = computed(() => {
  return validationStore.errors[props.errorField] && validationStore.errors[props.errorField][0]
})
</script>

<template>
  <div class="row align-items-center">
    <div v-if="props.label" class="col-md-4">
      <label class="label" style="color: #666666; opacity: 0.9;">{{ label }}</label>
    </div>

    <div :class="`${props.label ? 'col-md-8' : 'col-md-12'}`">
      <textarea v-model="text" class="form-control custom noresize" :class="{'border-danger has_error': hasError}" :placeholder="placeholder" rows="3"></textarea>

      <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>
    </div>
  </div>
</template>


<style lang="scss">
.form-control.custom {
  background-color: v-bind(bg);
}
textarea:focus::placeholder {
  color: transparent !important;
}
</style>
