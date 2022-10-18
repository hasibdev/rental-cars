<template>
  <div>
    <!-- Upload box -->
    <div v-bind="getRootProps()">
      <div class="row align-items-center uploader-div">
        <div class="col-sm-4">
          <div :class="{'border-danger has_error': hasError}">
            <label for="files" class="">{{ t('button.uploadFiles') }}</label>
            <input v-bind="getInputProps()" for="files" style=" visibility:hidden;">
          </div>
        </div>
        <div class="col-sm-8">
          <div class="text-12 fw-400"> {{ t('form-fields.supported-format') }} PNG, JPG or PDF</div>
        </div>
      </div>

    </div>

    <p v-if="hasError" class="text-danger text-13 mt-1">{{ errorMsg }}</p>

    <!-- <p class="text-muted mt-3">Upload you files Or drop files here. Max file size 20MB</p> -->

    <!-- Preview row -->
    <div v-if="previousDocuments?.length || previewDocuments?.length" class="rounded mt-3 p-3"
      style="border: 1px solid #ddd">
      <!-- Previous Images for Edit -->
      <div v-for="(doc, i) in previousDocuments" :key="i"
        class="position-relative text-truncate pe-4 d-flex align-items-center">
        <a :href="doc.url" target="_blank"><span class="text-muted">{{i+1}}.</span> {{ doc[prevTrack] }}</a>
        <span @click="openPreviousRemoveModal(doc)" class="remove-icon">&#10073;</span>

        <!-- <img :src="img[prevTrack]" alt="Preview" class="rounded img-fluid preview__img"> -->
      </div>

      <!-- File List  -->
      <div v-for="(doc, i) in previewDocuments" :key="i" class="position-relative text-truncate pe-4">
        <a :href="doc.url" target="_blank"><span class="text-muted">{{i+1}}.</span> {{ doc.name }}</a>
        <span @click="openRemoveModal(i)" class="remove-icon">&#10073;</span>

        <!-- <img :src="img" alt="Preview" class="rounded img-fluid preview__img"> -->
      </div>

    </div>

    <ConfirmDialog v-model="removeModalStatus" :title="`${t('heading.cancelUpload')}?`"
      :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedRemove" />
    <ConfirmDialog v-model="prevModalStatus" :okLoading="prevDeleteLoading" :title="`${t('heading.cancelUpload')}?`"
      :message="`${t('paragraph.cancleUpload')}?`" @onOk="confirmedPrevRemove" />
  </div>
</template>

<script>
import { defineComponent, reactive, ref, computed } from "vue"
import { useDropzone } from "vue3-dropzone"
import ConfirmDialog from '@/components/common/modals/ConfirmDialog.vue'
import { useI18n } from 'vue-i18n'
import { useValidationStore } from '@/stores/validation'
// import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import { api } from '@/use/useAxios'
export default defineComponent({
  name: "DocumentsUploader",
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
  },
  emits: ['update:modelValue', 'update:preview', 'onDeletecFilesImage'],

  components: {
    ConfirmDialog
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

    const previewDocuments = ref([])
    const previewFiles = files => {
      // previewDocuments.value = files
      files.forEach(file => {
        previewDocuments.value.push({
          name: file.name,
          url: URL.createObjectURL(file)
        })
      })
    }

    const onDrop = (acceptedFiles) => {
      files.value = acceptedFiles

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

    const { getRootProps, getInputProps, ...rest } = useDropzone(options)
    return {
      t,
      previewDocuments,
      options,
      openRemoveModal,
      confirmedRemove,
      getRootProps,
      getInputProps,
      removeModalStatus,
      openPreviousRemoveModal,
      hasError,
      errorMsg,
      confirmedPrevRemove,
      prevModalStatus,
      prevDeleteLoading,
      ...rest,
    }
  },
})
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

.uploader-div {
  label {
    border: 1px solid #000000;
    color: #000000;
    font-size: 12px;
    font-weight: 500;
    width: 100%;
    height: 2.5rem;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
