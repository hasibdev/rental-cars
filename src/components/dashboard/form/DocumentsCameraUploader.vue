<template>
  <div>
    <div class="row">
      <div class="col-xl-6">
        <!-- Upload box -->
        <label for="documents__upload__input" class="d-flex justify-content-between position-relative">
          <input @change="onFileChanged" multiple type="file" accept="image/png, image/gif, image/jpeg" class="file__input" id="documents__upload__input">
          <div class="upload-wrapper w-100 me-1" :class="{'border-danger has_error': hasError}">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.6663 26.6667L19.9997 20L13.333 26.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M20 20V35" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M33.9834 30.6505C35.609 29.7643 36.8932 28.362 37.6332 26.6649C38.3733 24.9678 38.5271 23.0726 38.0705 21.2784C37.6138 19.4841 36.5726 17.8931 35.1112 16.7563C33.6499 15.6195 31.8516 15.0018 30.0001 15.0005H27.9001C27.3956 13.0493 26.4554 11.2378 25.15 9.7022C23.8447 8.16663 22.2082 6.94696 20.3636 6.13489C18.519 5.32282 16.5144 4.93947 14.5003 5.01368C12.4863 5.08789 10.5152 5.61771 8.73541 6.56332C6.95559 7.50893 5.4133 8.84571 4.22449 10.4732C3.03567 12.1006 2.23127 13.9764 1.87175 15.9595C1.51223 17.9426 1.60696 19.9814 2.14881 21.9226C2.69065 23.8639 3.66552 25.657 5.00012 27.1672" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M26.6663 26.6667L19.9997 20L13.333 26.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="btn btn-dark btn-sm px-4 mt-3">{{ t('button.chooseFiles') }}</span>
            <p class="text-dark mt-2 fw-500">{{ t('paragraph.drag&DropHier') }}</p>
          </div>
        </label>

      </div>

      <!-- Camera -->
      <div class="col-xl-6 mt-3 mt-xl-0">
        <div @click="cameraOpenStatus = true" class="take-photo-wrapper ms-1">
          <svg class="mt-3" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.3334 31.6667C38.3334 32.5507 37.9822 33.3986 37.357 34.0237C36.7319 34.6488 35.8841 35 35 35H5.00002C4.11597 35 3.26812 34.6488 2.643 34.0237C2.01788 33.3986 1.66669 32.5507 1.66669 31.6667V13.3333C1.66669 12.4493 2.01788 11.6014 2.643 10.9763C3.26812 10.3512 4.11597 10 5.00002 10H11.6667L15 5H25L28.3334 10H35C35.8841 10 36.7319 10.3512 37.357 10.9763C37.9822 11.6014 38.3334 12.4493 38.3334 13.3333V31.6667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20 28.3333C23.6819 28.3333 26.6666 25.3486 26.6666 21.6667C26.6666 17.9848 23.6819 15 20 15C16.3181 15 13.3333 17.9848 13.3333 21.6667C13.3333 25.3486 16.3181 28.3333 20 28.3333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- <button @click="onClick" class="btn btn-secondary btn-sm px-4 mt-3">{{ t('button.chooseFiles') }}</button> -->
          <PrimaryButton variant="dark" class="btn-sm px-4 mt-3" style="min-height: 42px; height: auto;">{{ t('button.take-a-photo') }}</PrimaryButton>
        </div>
      </div>
    </div>

    <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>

    <!-- <p class="text-muted mt-3">{{t('form-fields.upload-text')}} 20MB</p> -->

    <!-- Preview row -->
    <div class=" mt-3">
      <!-- Previous Images for Edit -->
      <div v-for="(doc, i) in previousDocuments" :key="i" class="position-relative text-truncate pe-4">
        <a :href="doc.url" target="_blank"><span class="text-muted">{{i+1}}.</span> {{ doc[prevTrack] }}</a>
        <span @click="openPreviousRemoveModal(doc)" class="remove-icon">&#10073;</span>
      </div>

      <!-- File List  -->
      <div v-for="(doc, i) in previewDocuments" :key="i" class="position-relative text-truncate pe-4">
        <a :href="doc.url" target="_blank"><span class="text-muted">{{i+1}}.</span> {{ doc.name }}</a>
        <span @click="openRemoveModal(i)" class="remove-icon">&#10073;</span>
      </div>

    </div>

    <div v-if="cameraOpenStatus" class="camera__wrapper">
      <Camera autoplay :facingMode="facingMode" ref="camera">
        <div class="camera__footer">

          <button @click="cameraOpenStatus = false" class="close_btn">
            <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
            </svg>
          </button>

          <button @click="snapshot" class="snap_btn">
            <span></span>
          </button>

          <button @click="changeCamera" class="switch_camera">
            <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
              <path d="M480 256c-17.67 0-32 14.31-32 32c0 52.94-43.06 96-96 96H192L192 344c0-9.469-5.578-18.06-14.23-21.94C169.1 318.3 159 319.8 151.9 326.2l-80 72C66.89 402.7 64 409.2 64 416s2.891 13.28 7.938 17.84l80 72C156.4 509.9 162.2 512 168 512c3.312 0 6.615-.6875 9.756-2.062C186.4 506.1 192 497.5 192 488L192 448h160c88.22 0 160-71.78 160-160C512 270.3 497.7 256 480 256zM160 128h159.1L320 168c0 9.469 5.578 18.06 14.23 21.94C337.4 191.3 340.7 192 343.1 192c5.812 0 11.57-2.125 16.07-6.156l80-72C445.1 109.3 448 102.8 448 95.1s-2.891-13.28-7.938-17.84l-80-72c-7.047-6.312-17.19-7.875-25.83-4.094C325.6 5.938 319.1 14.53 319.1 24L320 64H160C71.78 64 0 135.8 0 224c0 17.69 14.33 32 32 32s32-14.31 32-32C64 171.1 107.1 128 160 128z" />
            </svg>
          </button>
        </div>

      </Camera>
    </div>

    <ConfirmDialog v-model="removeModalStatus" :title="`${t('heading.cancelUpload')}?`" :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedRemove" />
    <ConfirmDialog v-model="prevModalStatus" :okLoading="prevDeleteLoading" :title="`${t('heading.cancelUpload')}?`" :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedPrevRemove" />
  </div>
</template>


<script>
import Camera from "simple-vue-camera"
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue"
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { api } from '@/use/useAxios'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: "DocumentsCameraUploader",
  props: {
    modelValue: {
      type: [File, Array, null],
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    errorField: { type: String },
    accept: {
      type: Array,
      default: () => [".jpg", ".jpeg", ".png", ".svg", '.pdf']
    },
    preview: String,
    prevTrack: {
      type: String,
      default: 'img'
    },
    previousDocuments: {
      type: Array,
      default: () => []
    },
    showPreview: {
      type: Boolean,
      default: true
    },
  },

  emits: ['update:modelValue', 'update:preview', 'onDeletecFilesImage'],

  components: {
    ConfirmDialog,
    PrimaryButton,
    Camera
  },
  setup(props, ctx) {

    const toast = useToast()
    const validationStore = useValidationStore()
    const { t } = useI18n({ useScope: 'global' })
    const files = ref([])

    // Camera
    const camera = ref()
    const cameraOpenStatus = ref(false)
    const facingMode = ref('environment')

    const previewDocuments = ref([])
    const previewFiles = () => {
      previewDocuments.value = files.value.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    }

    // Use camera reference to call functions
    const snapshot = async () => {
      const blob = await camera.value?.snapshot()
      const fileName = `Photo-${previewDocuments.value.length + 1}`

      toast.success('Image Taken', { timeout: 800 })
      // To show the screenshot with an image tag, create a url
      if (props.showPreview) {
        previewDocuments.value.push({
          name: fileName,
          url: URL.createObjectURL(blob)
        })
      }

      ctx.emit('update:modelValue', [...props.modelValue, new File([blob], fileName)])
    }

    // Change camera
    const changeCamera = () => {
      const devices = camera.value?.devices(["videoinput"])
      alert(JSON.stringify(devices))

    }

    // Modal
    const activeRemoveIndex = ref()
    const removeModalStatus = ref(false)
    const prevModalStatus = ref(false)
    const prevDeleteLoading = ref(false)

    const prevImgId = ref(null)
    const ispreview = ref(false)

    const confirmedRemove = () => {
      if (ispreview.value) {
        ctx.emit('update:preview', '')
        removeModalStatus.value = false
        return
      }

      previewDocuments.value.splice(activeRemoveIndex.value, 1)
      files.value.splice(activeRemoveIndex.value, 1)

      if (props.multiple) {
        ctx.emit('update:modelValue', files.value)
      } else {
        ctx.emit('update:modelValue', null)
      }

      removeModalStatus.value = false
    }

    const openRemoveModal = (i, prev = false) => {
      ispreview.value = prev

      // removeModalStatus.value = true
      activeRemoveIndex.value = i
      confirmedRemove()
    }


    const confirmedPrevRemove = async () => {
      try {
        prevDeleteLoading.value = true
        await api.delete(`admin/documentsupload/delete/${prevImgId.value}`)
        prevModalStatus.value = false
        ctx.emit('removePrev', prevImgId.value)
      } catch (error) {
        console.error(error)
      } finally {
        prevDeleteLoading.value = false
      }
    }

    const hasError = computed(() => {
      return props.errorField && validationStore.errors[props.errorField]
    })
    const errorMsg = computed(() => {
      return validationStore.errors[props.errorField] ? validationStore.errors[props.errorField][0] : ''
    })

    const openPreviousRemoveModal = (doc) => {
      // prevModalStatus.value = true
      prevImgId.value = doc.id
      confirmedPrevRemove()
    }

    const listenKeyUpEvent = e => {
      if (e.key == 'Escape' && cameraOpenStatus.value) {
        cameraOpenStatus.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('keyup', listenKeyUpEvent)
    })

    onUnmounted(() => {
      document.removeEventListener('keyup', listenKeyUpEvent)
    })

    const onFileChanged = (e) => {
      const acceptedFiles = [...e.target.files]

      files.value = [...files.value, ...acceptedFiles]

      if (props.showPreview) {
        previewFiles()
      }

      ctx.emit('update:modelValue', [...files.value])

      delete validationStore.errors[props.errorField]
    }

    return {
      t,
      onFileChanged,
      previewDocuments,
      openRemoveModal,
      confirmedRemove,
      removeModalStatus,
      openPreviousRemoveModal,
      hasError,
      errorMsg,
      confirmedPrevRemove,
      prevModalStatus,
      prevDeleteLoading,
      camera,
      snapshot,
      cameraOpenStatus,
      changeCamera,
      facingMode,
    }
  },
});
</script>


<style lang="scss" scoped>
.camera__wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  left: 0;
  top: 0;
  background: #000;
  .camera__footer {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    max-width: 600px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    .snap_btn {
      width: 50px;
      height: 50px;
      border: 3px solid #fff;
      border-radius: 50%;
      background: red;
      margin: 0 40px;
    }
    .switch_camera,
    .close_btn {
      background: #fff;
      border: 0;
      outline: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.file__input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 9;
}

.upload-wrapper {
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  padding: 20px;
  height: 220px;
  background: #efeef3;
  border: 1px dashed #bbbbbb;
  border-radius: 4px;
  cursor: pointer;
}
.remove-icon {
  position: absolute;
  color: white;
  background: var(--color-error);
  top: 0px;
  right: 5px;
  transform: rotate(90deg);
  width: 16px;
  height: 16px;
  font-size: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: 600;
  cursor: pointer;
}

.default_img_wrap {
  .default_image_change {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    color: #fff;
    background: #0000007a;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
  }
  &:hover {
    .default_image_change {
      opacity: 1;
    }
  }
}
img.preview__img {
  aspect-ratio: 16/10;
  object-fit: cover;
}

.take-photo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #efeef3;
  border: 1px solid #bbbbbb;
  border-radius: 4px;
  padding: 20px;
  height: 220px;
  cursor: pointer;
}
</style>
