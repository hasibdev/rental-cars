<script setup>
import { onMounted, watch, nextTick, ref, defineEmits, defineProps } from 'vue'
// import Modal from 'bootstrap/js/src/modal'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const emit = defineEmits(['update:modelValue', 'onHide', 'onOk'])


const props = defineProps({
   id: { type: String },
   modelValue: {
      type: Boolean,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   message: {
      type: String,
      required: true
   },
   cancleText: {
      type: String,
   },
   okText: {
      type: String,
       
   },
   okLoading: {
      type: Boolean,
      default: false
   }
})

const dialogRef = ref(null)

let modal = null
const handleToggle = val => val ? modal.show() : modal.hide()

onMounted(() => {
   nextTick(() => {
      if (!dialogRef.value) {
         return
      }
      modal = new window.bootstrap.Modal(dialogRef.value)
      handleToggle(props.modelValue)

      dialogRef.value.addEventListener('hidden.bs.modal', () => {
         emit('update:modelValue', false)
         emit('onHide')
      })
   })
})

watch(() => props.modelValue, (val) => {
   handleToggle(val)
})


const hideModal = () => {
   emit('update:modelValue', false)
   emit('onHide')
}

const onOk = () => emit('onOk')

</script>

<template>
   <div class="modal fade" :id="props.id" ref="dialogRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title">
                  <slot name="title">
                     {{title}}
                  </slot>
               </h5>
            </div>
            <div class="modal-body">
               <slot>
                  {{ props.message }}
               </slot>
            </div>
            <div class="modal-footer border-0 mt-2">
               <slot name="footer">
                  <PrimaryButton @click="hideModal" variant="light" style="min-width: 180px;" v-if="props.cancelText">{{ props.cancleText }}</PrimaryButton>
                  <PrimaryButton @click="hideModal" variant="light" style="min-width: 180px;" v-else>{{ t('button.cancel') }}</PrimaryButton>
                  <PrimaryButton @click="onOk" :loading="okLoading" style="min-width: 180px;" v-if="props.okText" variant="danger">{{ props.okText }}</PrimaryButton>
                  <PrimaryButton @click="onOk" :loading="okLoading" style="min-width: 180px;" v-else variant="danger">{{ t('button.remove') }}</PrimaryButton>
               </slot>
            </div>
         </div>
      </div>
   </div>
</template>


<style lang="scss" scoped>
</style>
