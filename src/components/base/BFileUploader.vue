<template>
  <div class="b-files">
    <div :class="[dragging ? 'dropZone-over' : '']" @dragenter="dragging = true" @dragleave="dragging = false" :style="cssVar" class="file-uploader">
      <div class="file-uploader__drag-area">
        <div class="file-uploader__icon">
          <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.6663 28.6667L21.4997 21.5L14.333 28.6667" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.5 21.5V37.625" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M36.5322 32.9487C38.2797 31.9961 39.6601 30.4886 40.4557 28.6642C41.2513 26.8398 41.4167 24.8024 40.9257 22.8736C40.4348 20.9448 39.3155 19.2345 37.7446 18.0124C36.1736 16.7904 34.2404 16.1263 32.2501 16.125H29.9926C29.4503 14.0274 28.4395 12.08 27.0363 10.4293C25.633 8.77853 23.8738 7.46739 21.8909 6.59441C19.908 5.72144 17.7529 5.30934 15.5878 5.38911C13.4227 5.46889 11.3039 6.03845 9.39055 7.05498C7.47725 8.07151 5.81929 9.50855 4.54131 11.2581C3.26333 13.0076 2.3986 15.0241 2.01212 17.1559C1.62564 19.2877 1.72747 21.4794 2.30995 23.5663C2.89244 25.6531 3.94042 27.5807 5.37511 29.2042" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M28.6663 28.6667L21.4997 21.5L14.333 28.6667" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <label for="fileUploaders" class="file-uploader__btn">Choose Files</label>
        <h5 class="file-uploader__label">Drag & Drop Here</h5>
        <input class="file-uploader__input" id="fileUploaders" multiple @input="$emit('update:modelValue', $event.target.files)" @change="selectFile" type="file" />
      </div>
    </div>
    <p class="file-uploader__hints">
      Upload you files or drop files here. Max file size
      {{ max ? formatSizeUnits() : "" }}
    </p>
    <ul v-if="files" class="file-uploader__selected-files">
      <li v-for="(file, index) in files" :key="index">
        <span class="file-name" :class="{ error: file.invalidMessage }">
          {{ index + 1 }}. {{ file.name }}</span>
        <span v-if="file.invalidMessage" class="error">{{
          file.invalidMessage
        }}</span>
        <span v-else class="uploaded">{{
          progress > 0 ? `${progress}%` : ""
        }}</span>

        <button @click="removeFile(index)" class="file-uploader__rm-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#f23e3d" />
            <path d="M6 10H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import http from "@/helpers/http"
export default {
  props: {
    modelValue: {
      type: [String, Object],
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
    max: {
      type: [String, Number],
      default: null,
    },
    types: {
      type: Array,
      default: null,
    },
    endpoint: {
      type: String,
      default: "",
    },
    rmEndpoint: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {
      files: [],
      uploads: [],
      dragging: false,
      progress: 0,
    }
  },
  methods: {
    selectFile(e) {
      let files = e.target.files || e.dataTransfer.files
      this.uploads = files

      if (!files.length) {
        this.dragging = false
        return
      }

      const storeFiles = []

      for (var i = 0; i < files.length; i++) {
        let file = files[i]
        storeFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          invalidMessage: this.validate(file),
        })
      }

      this.files = [...this.files, ...storeFiles]
      // this.sendFile();
    },
    // @todo: remove images
    removeFile(index) {
      const fileListArr = Array.from(this.file)
      fileListArr.splice(index, 1)
      this.file = fileListArr
    },
    validate(file) {
      if (this.types) {
        if (!this.types.includes(file.type)) {
          return "Invalid file format"
        }
      }

      if (this.max) {
        if (file.size > +this.max) {
          return `Max size: ${this.formatSizeUnits()}`
        }
      }

      this.dragging = false
      return ""
    },
    formatSizeUnits(bytes = this.max) {
      if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(2) + " MB"
      } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(2) + " KB"
      }
      return bytes
    },
    async sendFile() {
      const formData = new FormData()

      for (var i = 0; i < this.uploads.length; i++) {
        let file = this.uploads[i]
        if (this.validate(file) === "") {
          formData.append("documents", file)
        }
      }

      try {
        await http.post(this.endpoint, formData, {
          onUploadProgress: (e) =>
            (this.progress = Math.round((e.loaded * 100) / e.total)),
        })
      } catch (err) {
        console.error(err)
      }
    },
  },
  computed: {
    cssVar() {
      return this.color ? { "--color-primary": this.color } : ""
    },
  },
};
</script>

<style lang="scss" scoped>
.b-files {
  width: 100%;
}

.file-uploader {
  width: 100%;
  min-height: 150px;
  max-height: 180px;
  padding: 1.5rem 1rem;
  border: 1px dashed #bbbbbb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  margin-bottom: 0.875rem;
  cursor: pointer;
  transition: border 0.3s ease;
  position: relative;

  &:hover {
    border: 1px solid var(--color-primary);
  }

  &.dropZone-over {
    background-color: #bbbbbb;
  }

  &__input {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &__drag-area {
    text-align: center;
  }

  &__icon {
    margin-bottom: 1rem;

    svg {
      width: 3rem;
      height: 3rem;
    }
  }

  &__label {
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-primary);
  }

  &__btn {
    outline: none;
    border: 1px solid var(--color-primary);
    padding: 6px 16px;
    border-radius: 4px;
    text-transform: capitalize;
    font-size: 15px;
    font-weight: 400;
    background-color: var(--color-primary);
    color: var(--color-white);
    cursor: pointer;
    margin-bottom: 0.75rem;
  }

  &__hints {
    font-size: 0.87rem;
    font-weight: 400;
  }

  &__selected-files {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.875rem;

      .file-name {
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .error {
        color: var(--color-error);
      }

      .uploaded {
        color: var(--color-success);
      }
    }
  }

  &__rm-btn {
    outline: none;
    border: none;
    background-color: transparent;
  }
}
</style>
