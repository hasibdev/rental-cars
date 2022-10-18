<script setup>
import { ref, watch, onMounted } from 'vue'
import ArtBoard from "@/components/dashboard/shared/ArtBoard.vue"
import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
import DocumentsCameraUploader from '@/components/dashboard/form/DocumentsCameraUploader.vue'
import { useReservationStore } from '@/stores/reservation'
import { api } from "@/use/useAxios"

const reserveStore = useReservationStore()

onMounted(() => {
  // This timeout is very important !!
  setTimeout(() => {
    reserveStore.edit.damages_art = reserveStore.editInfo.artCopy
  }, 1000)
})

const filesPreview = ref([])
function removeHandoverImage(index) {
  reserveStore.edit.photos_handover = reserveStore.edit.photos_handover.filter((item, i) => i !== index)
}

const removePreviousImage = async (id) => {
  try {
    await api.delete(`admin/documentsupload/delete/${id}`)
    reserveStore.editInfo.handover_photos = reserveStore.editInfo.handover_photos.filter(img => img.id !== id)
  } catch {
    //
  }
}

watch(() => reserveStore.edit.photos_handover, (newFiles) => {
  filesPreview.value = newFiles.map(file => URL.createObjectURL(file))
})

</script>

<template>
  <div class="damages">
    <div class="damages__sketch-inner">
      <div class="row">
        <div class="col-lg-6">
          <FormTextarea v-model="reserveStore.edit.damages_content" class="mb-5" :placeholder=" $t('form-fields.damage-description-at-handover')" :label="$t('form-fields.damages')" errorField="damages_content" />
          <div class="row">
            <div class="col-md-4">
              <h5 class="damages__label pt-2" style="color: #666666;">{{ $t('dashboard-reservation.photos-at-handover') }}</h5>
            </div>
            <div class="col-md-8">
              <DocumentsCameraUploader v-model="reserveStore.edit.photos_handover" :showPreview="false"></DocumentsCameraUploader>
            </div>
          </div>
        </div>
        <div class="col-lg-4 offset-lg-2">
          <ArtBoard v-model="reserveStore.edit.damages_art" />
        </div>
      </div>

      <!-- Previous Images -->
      <div class="row mt-3">
        <div v-for="(img, i) in reserveStore.editInfo.handover_photos" :key="i" class="col-md-3">
          <div class="damages__img">
            <button @click="removePreviousImage(img.id)" class="damages__img-rm-btn base-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F56C6B" />
                <path d="M6 10H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <a :href="imageBaseUrl(`/${img.folder}/${img.file_name}`)" target="_blank">
              <img :src="imageBaseUrl(`/${img.folder}/${img.file_name}`)" alt="Handover Image" class="rounded" />
            </a>
          </div>
        </div>
      </div>

      <!-- Image Preview -->
      <div class="row mt-3">
        <div v-for="(img, i) in filesPreview" :key="i" class="col-md-3">
          <div class="damages__img">
            <button @click="removeHandoverImage(i)" class="damages__img-rm-btn base-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F56C6B" />
                <path d="M6 10H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <a :href="img" target="_blank">
              <img :src="img" alt="Handover Image" class="rounded" />
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

  <style lang="scss" scoped>
.damages {
  &__label {
    font-size: 1rem;
    font-weight: 400;
    text-transform: capitalize;
  }

  &__textarea {
    width: 100%;
    resize: none;
    border: 1px solid var(--color-light-grey);
    border-radius: 4px;
    outline: none;
    height: 377px;
    padding: 1rem;
  }

  &__sketch {
    &-inner {
      margin-bottom: 1rem;
    }
  }

  .damages__img {
    width: 100%;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    position: relative;
    aspect-ratio: 9/6;
    border: 1px solid var(--color-light-grey);

    &:hover .damages__img-rm-btn {
      display: block;
    }

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      aspect-ratio: 9/6;
      &.uploading-img {
        filter: blur(2px);
      }
    }

    &-rm-btn {
      position: absolute;
      right: -8px;
      padding: 0;
      top: -8px;
      display: none;

      &:not(:last-child) {
        margin-right: 0;
      }
    }
  }
}

.action {
  text-align: start;
  &__btn {
    background-color: var(--color-dark);
    color: var(--color-white);
    position: relative;
    display: inline-block;
    cursor: pointer !important;
    &:hover {
      color: var(--color-white);
    }

    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    span {
      user-select: none;
    }
  }
}
</style>
