<script setup>
import { defineEmits, defineProps } from "vue"
import { onMounted, watch, nextTick, ref } from 'vue'
// import Modal from 'bootstrap/js/src/modal'

const emit = defineEmits(['update:modelValue', 'onHide',])
const props = defineProps({
  id: { type: String, default: '' },
  modelValue: {
    type: Boolean,
    required: true
  },
  dialogClass: {
    type: String,
    default: ''
  },
  backdrop: {
    type: [String, null],
    default: null
  }

})

const modalRef = ref(null)

let modal = null
const handleToggle = val => val ? modal.show() : modal.hide()

onMounted(() => {
  nextTick(() => {
    if (!modalRef.value) {
      return
    }

    modal = new window.bootstrap.Modal(modalRef.value)
    handleToggle(props.modelValue)

    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('update:modelValue', false)
      emit('onHide')
    })
  })
})

watch(() => props.modelValue, (val) => {
  handleToggle(val)
})

</script>

<template>
  <div class="modal fade" :id="props.id" ref="modalRef" tabindex="-1" :aria-labelledby="props.id + 'label'" aria-hidden="true" :data-bs-backdrop="props.backdrop">
    <div :class="dialogClass" class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
</style>
