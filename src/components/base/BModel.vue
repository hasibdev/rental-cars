<template>
  <teleport to="body">
    <div v-if="isOpen" @click.self="close" class="b-model">
      <div :style="{ '--width': width + 'px' }" class="b-model__container">
        <div v-if="title" class="b-model__header">
          <h2 class="b-model__header-title">{{ title }}</h2>
          <button @click="close" class="b-model__header-btn">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="#666"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 2.05625L18.885 0L10.5 8.15208L2.115 0L0 2.05625L8.385 10.2083L0 18.3604L2.115 20.4167L10.5 12.2646L18.885 20.4167L21 18.3604L12.615 10.2083L21 2.05625Z"
                fill="inherit"
              />
            </svg>
          </button>
        </div>
        <!-- model body -->
        <div
          :style="{ '--height': height ? height + 'px' : 'auto' }"
          :class="{ scroll: height }"
          class="b-model__body"
        >
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { onMounted, toRef, watch } from "vue";
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    width: {
      type: String,
      default: "450",
    },
    height: {
      type: Number,
      default: null,
    },
  },
  setup(props, ctx) {
    const isOpen = toRef(props, "modelValue");
    onMounted(() => {
      document.querySelector("body").classList.add("model-open");
    });
    
    watch(isOpen, () => {
      document.querySelector("body").classList.remove("model-open");
    });

    const close = () => {
      isOpen.value = false;
      ctx.emit("update:modelValue", false);
    };

    return {
      isOpen,
      close,
    };
  },
};
</script>

<style>
body.model-open {
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.b-model {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__container {
    --width: 450px;
    width: var(--width);
    height: auto;
    z-index: 999;
    background-color: var(--color-white);
    border-radius: 6px;
    padding: 1rem;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 1rem;

    &-title {
      font-size: 1.4rem;
      text-transform: capitalize;
      margin-bottom: 0;
    }

    &-btn {
      outline: none;
      border: none;
      background-color: transparent;
      padding: 0.25rem;

      svg {
        --size: 18px;
        width: var(--size);
        height: var(--size);
        fill: #5e5d5d;
        &:hover {
          fill: #000;
        }
      }
    }
  }

  &__body {
    --height: auto;
    height: var(--height);

    &.scroll {
      overflow: auto;
    }
  }
}
</style>
