<template>
  <div class="artboard">
    <div class="canvas__wrapper">
      <div ref="canvas" :style="cssProps" :class="{ 'artboard__canvas--error': error, 'border border-danger has_error': hasError }" class="artboard__canvas">
        <img @click="addMark" :src="imageUrl" alt="art" />
      </div>
    </div>
    <p v-if="hasError" class="text-danger text-13 mb-1">{{ errorMsg }}</p>
    <div class="d-flex align-items-center">
      <button class="base-btn artboard__btn" :class="{ active: status === 'x' }" @click="selectCursor('x')">
        X- {{ $t('button.scratch')}}
      </button>
      <button class="base-btn artboard__btn" :class="{ active: status === 'O' }" @click="selectCursor('O')">
        O- {{ $t('button.dent')}}
      </button>

      <button class="base-btn artboard__btn active ms-auto" @click="resetArtBoard">
        {{ $t('form-fields.reset')}}
      </button>
    </div>

  </div>
</template>

<script>
import domtoimage from "dom-to-image"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  emits: ['update:modelValue', 'update:artCount'],
  props: {
    modelValue: { type: [String, null] },
    errorField: { type: String },
    error: {
      type: Boolean,
      default: false,
    },
    artCount: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      cursor: "default",
      imageUrl: require("@/assets/images/car-art.png"),
      status: null,
      hasSketchImg: false,
      uploaded: false,
      progress: false,
    }
  },

  computed: {
    ...mapState(useValidationStore, ['errors']),
    hasError() {
      return this.errorField && this.errors[this.errorField]
    },
    errorMsg() {
      return this.errors[this.errorField] && this.errors[this.errorField][0]
    },
    cssProps() {
      const styles = {
        cursor: this.cursor,
      }
      return styles
    },
  },
  methods: {
    selectCursor(type = null) {
      this.status = type
      this.cursor =
        type === "x"
          ? `url(${require("@/assets/images/icons/x.svg")}), auto`
          : type === "O"
            ? `url(${require("@/assets/images/icons/0.svg")}), auto`
            : "default"
    },

    addMark(e) {
      this.uploaded = false
      let rect = e.target.getBoundingClientRect()
      let x = e.clientX - rect.left
      let y = e.clientY - rect.top
      let span = document.createElement("span")

      span.innerHTML = this.status
      span.style.left = x + "px"
      span.style.top = (y - 5) + "px"
      span.style.position = "absolute"
      span.style.color = "#f23e3d"

      this.$refs.canvas.appendChild(span)
      this.$emit("update:artCount", this.artCount + 1)

      this.getSketchImage()
    },

    resetArtBoard() {
      this.$emit("update:artCount", 0)
      let markers = this.$refs.canvas.querySelectorAll("span")
      markers.forEach((el) => {
        el.remove()
      })
      this.selectCursor()

      this.$refs.canvas.querySelector("img").src = require("@/assets/images/car-art.png")

      this.getSketchImage()
    },
    async getSketchImage() {
      const blobData = await domtoimage.toBlob(this.$refs.canvas)
      const file = new File([blobData], "sketch.png")

      const reader = new FileReader()
      reader.onload = e => {
        this.$emit('update:modelValue', e.target.result)
      }
      reader.readAsDataURL(file)
    },
  },
  mounted() {
    this.getSketchImage()
  },
  watch: {
    modelValue() {
      this.imageUrl = this.modelValue
    }
  },
};
</script>
<style lang="scss" scoped>
.artboard {
  border-radius: 4px;
  width: 100%;
  // overflow: hidden;

  .canvas__wrapper {
    padding: 1rem;
    border: 1px solid var(--color-light-grey);
    background-color: var(--color-light-grey);
    margin-bottom: 1rem;
  }

  &__canvas {
    width: 100%;
    height: 100%;
    background-color: #ffff;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 16/10;
      object-fit: contain;
    }

    &--error {
      border-color: var(--color-error);
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    &-left {
      margin-right: 1rem;
    }
  }

  &__btn {
    border: 1px solid var(--color-grey);
    color: var(--color-grey);
    font-weight: 500;
    font-size: 0.875rem;

    &:disabled {
      opacity: 0.75;
    }

    &.active,
    &:hover:not(&--blue) {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    &--blue {
      color: var(--color-secondary);
      border-color: var(--color-secondary);
    }
  }
}
</style>

