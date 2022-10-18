<template>
  <div class="damages">
    <div class="damages__sketch-inner">
      <div class="row">
        <div class="col-lg-7">
          <FormTextarea v-model="form.return_content" :placeholder="$t('form-fields.damage-description-at-handover')" :label="$t('form-fields.damage-description-at-handover')" errorField="return_content" />
        </div>
        <div class="col-lg-5">
          <ArtBoard @update="artBoadHandler" errorField="return_art" style="padding-left: 3rem; padding-right: 3rem;" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-2">
        <h5 class="damages__label" style="color: #666666;">{{ $t('dashboard-reservation.photos-at-handover') }}</h5>
      </div>
      <div class="col-md-10">
        <div class="action mb-4">
          <div class="base-btn action__btn">
            <span>{{ $t('button.upload-images')}}</span>
            <input multiple @change="selectFile" type="file" id="files" />
          </div>
        </div>
        <div class="row">
          <div v-for="(img, i) in files" :key="i" class="col-md-3">
            <div class="damages__img">
              <button @click="removeImgSingle(img?.id, i)" class="damages__img-rm-btn base-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F56C6B" />
                  <path d="M6 10H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <img v-if="progress === 100" :src="imageBaseUrl(`/documents/${img.name}`)" alt="" />
              <img v-else class="uploading-img" :src="img" alt="" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import http from "@/helpers/http"
import ArtBoard from "@/components/dashboard/shared/ArtBoard.vue"
import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
import { mapState } from 'pinia'
import { useReservationStore } from '@/stores/reservation'

export default {
  components: {
    ArtBoard, FormTextarea
  },
  data() {
    return {
      uploads: [],
      files: [],
      progress: 0,
      form: {
        return_art: "",
        return_content: "",
        returns_photos: [],
      },
    }
  },
  computed: {
    ...mapState(useReservationStore, { reservationForm: 'endRental' })
  },
  mounted() {
    this.sendFile()
  },
  methods: {
    artBoadHandler(e) {
      this.form.return_art = e
      this.reservationForm.return_art = e
    },

    selectFile(e) {
      let files = e.target.files || e.dataTransfer.files
      this.uploads = files

      const storeFiles = []

      for (var i = 0; i < files.length; i++) {
        let file = files[i]
        storeFiles.push(URL.createObjectURL(file))
      }

      this.files = [...this.files, ...storeFiles]
      this.sendFile()
    },

    async sendFile() {
      const formData = new FormData()
      formData.append("form_name", "damages")

      for (var i = 0; i < this.uploads.length; i++) {
        let file = this.uploads[i]
        formData.append(`documents[${i}]`, file)
      }

      try {
        const data = await http.post(
          "/admin/documentsupload/store",
          formData,
          {
            onUploadProgress: (e) =>
              (this.progress = Math.round((e.loaded * 100) / e.total)),
          }
        )
        this.files = data
        this.form.returns_photos = this.files.map((_) => {
          return _.id
        })
      } catch (err) {
        console.error(err)
      }
    },
    async removeImgSingle(id, idx) {
      try {
        await http.delete(`/admin/documentsupload/delete/${id}`)
        this.files.splice(idx, 1)
      } catch (err) {
        console.error(err)
      }
    },
  },
  watch: {
    'form.return_content'(val) {
      this.reservationForm.return_content = val
    },
    'form.returns_photos'(val) {
      this.reservationForm.returns_photos = val
    }
  }
};
</script>

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
