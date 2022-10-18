<template>
  <div>
    <!-- Upload box -->
    <div v-bind="getRootProps()">

      <div class="upload-wrapper" :class="{'border-danger has_error': hasError}">
        <input v-bind="getInputProps()">
        <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28.6666 28.6667L21.4999 21.5L14.3333 28.6667" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21.5 21.5V37.625" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M36.5322 32.9487C38.2797 31.9961 39.6601 30.4886 40.4557 28.6642C41.2513 26.8398 41.4167 24.8024 40.9257 22.8736C40.4348 20.9448 39.3155 19.2345 37.7446 18.0124C36.1736 16.7904 34.2404 16.1263 32.2501 16.125H29.9926C29.4503 14.0274 28.4395 12.08 27.0363 10.4293C25.633 8.77853 23.8738 7.46739 21.8909 6.59441C19.908 5.72144 17.7529 5.30934 15.5878 5.38911C13.4227 5.46889 11.3039 6.03845 9.39055 7.05498C7.47725 8.07151 5.81929 9.50855 4.54131 11.2581C3.26333 13.0076 2.3986 15.0241 2.01212 17.1559C1.62564 19.2877 1.72747 21.4794 2.30995 23.5663C2.89244 25.6531 3.94042 27.5807 5.37511 29.2042" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M28.6666 28.6667L21.4999 21.5L14.3333 28.6667" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <!-- <button @click="onClick" class="btn btn-secondary btn-sm px-4 mt-3">{{ t('button.chooseFiles') }}</button> -->
        <PrimaryButton @click="onClick" class="btn-sm px-4 mt-3">{{ t('button.chooseFiles') }}</PrimaryButton>
        <p v-if="isDragActive" class="text-primary mt-2 fw-medium">Drop the files here ...</p>
        <p v-else class="text-primary mt-2 fw-medium">{{ t('paragraph.drag&DropHier') }}</p>
      </div>

    </div>

    <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>

    <p class="text-muted mt-3">Upload you files Or drop files here. Max file size 20MB</p>

    <!-- Preview row -->
    <div class="row align-items-center">
      <!-- Previous Images for Edit -->
      <div v-for="(img, i) in previousImages" :key="i" class="col-md-4 mt-4 position-relative">
        <img :src="img[prevTrack]" alt="Preview" class="rounded img-fluid preview__img">
        <span @click="onDeletecFilesImage(img)" class="remove-icon">&#10073;</span>
      </div>

      <!-- File List Images -->
      <div v-for="(img, i) in previewImages" :key="i" class="col-md-4 mt-4 position-relative">
        <img :src="img" alt="Preview" class="rounded img-fluid preview__img">
        <span @click="openRemoveModal(i)" class="remove-icon">&#10073;</span>
      </div>

    </div>

    <ConfirmDialog v-model="removeModalStatus" :title="`${t('heading.cancelUpload')}?`" :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedRemove" />
    <ConfirmDialog v-model="prevModalStatus" :okLoading="prevDeleteLoading" :title="`${t('heading.cancelUpload')}?`" :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedPrevRemove" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed } from "vue"
import { useDropzone } from "vue3-dropzone"
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { api } from '@/use/useAxios'
export default defineComponent({
  name: "ImageUploader",
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
      default: () => [".jpg", ".jpeg", ".png", ".svg"]
    },
    preview: String,
    prevTrack: {
      type: String,
      default: 'img'
    },
    previousImages: {
      type: Array,
      default: () => []
    },
  },
  emits: ['update:modelValue', 'update:preview', 'onDeletecFilesImage'],

  components: {
    ConfirmDialog,
    PrimaryButton
  },
  methods: {
    onClick() {
      if (this.open) {
        this.open()
      }
    }
  },
  setup(props, ctx) {
    const validationStore = useValidationStore()
    const { t } = useI18n({ useScope: 'global' })
    const files = ref([])

    const previewImages = ref([])
    const previewFiles = files => {
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          previewImages.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    }

    const onDrop = (acceptedFiles) => {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const element = acceptedFiles[i]
        files.value.push(element)
      }

      previewFiles(acceptedFiles)
      ctx.emit('update:modelValue', files.value)

      delete validationStore.errors[props.errorField]
    }

    const options = reactive({
      multiple: props.multiple,
      onDrop,
      maxSize: 20971520,
      accept: props.accept,
    })

    // Modal
    const activeRemoveIndex = ref()
    const removeModalStatus = ref(false)
    const prevModalStatus = ref(false)
    const prevDeleteLoading = ref(false)

    const prevImgId = ref(null)
    const ispreview = ref(false)
    const openRemoveModal = (i, prev = false) => {
      ispreview.value = prev

      removeModalStatus.value = true
      activeRemoveIndex.value = i
    }
    const confirmedRemove = () => {
      if (ispreview.value) {
        ctx.emit('update:preview', '')
        removeModalStatus.value = false
        return
      }

      previewImages.value.splice(activeRemoveIndex.value, 1)
      files.value.splice(activeRemoveIndex.value, 1)

      if (props.multiple) {
        ctx.emit('update:modelValue', files.value)
      } else {
        ctx.emit('update:modelValue', null)
      }

      removeModalStatus.value = false
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
      return validationStore.errors[props.errorField][0]
    })


    const currentDefaultImage = ref(null)
    const onChangeDefaultImage = (e) => {
      ctx.emit('onChangeDefaultImage', e.target.files[0])

      const reader = new FileReader()
      reader.onload = (e) => {
        currentDefaultImage.value = e.target.result
      }
      reader.readAsDataURL(e.target.files[0])
    }

    const onDeletecFilesImage = (img) => {
      prevModalStatus.value = true
      prevImgId.value = img.id
    }

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)
    return {
      t,
      previewImages,
      options,
      openRemoveModal,
      confirmedRemove,
      getRootProps,
      getInputProps,
      removeModalStatus,
      currentDefaultImage,
      onChangeDefaultImage,
      onDeletecFilesImage,
      hasError,
      errorMsg,
      confirmedPrevRemove,
      prevModalStatus,
      prevDeleteLoading,
      ...rest,
    }
  },
});
</script>


<style lang="scss" scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #efeef3;
  padding: 20px;
  height: 250px;
  border: 2px dashed;
  border-color: #808080;
  border-radius: 5px;
  cursor: pointer;
}
.remove-icon {
  position: absolute;
  color: white;
  background: var(--color-error);
  top: -3px;
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
</style>
