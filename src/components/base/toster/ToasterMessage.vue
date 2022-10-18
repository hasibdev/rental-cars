<template>
  <div class="toaster" :class="content.type">
    <div class="toaster__content">
      <p class="toaster__message">{{ content.text }}</p>
      <button type="button" class="toaster__btn" @click="removeToast(content)">
        ×
      </button>
    </div>
    <span class="toaster__progress-bar"></span>
  </div>
</template>

<script>
import { useToaster } from "@/stores/toaster";

export default {
  props: {
    content: {
      type: Object,
      required: false,
    },
  },
  setup() {
    const toastStore = useToaster();

    return {
      toastStore,
    };
  },

  methods: {
    removeToast(content) {
      this.toastStore.removeToaster(content);
    },
  },

  data() {
    return {
      timeOut: null,
    };
  },

  created() {
    this.timeOut = setTimeout(() => {
      this.removeToast(this.content);
    }, this.toastStore.config.timeInterval);
  },

  beforeUnmount() {
    clearTimeout(this.timeOut);
  },
};
</script>

<style lang="scss" scoped>
.toaster {
  --success-color: #8bc34a;
  --progress-s-color: #539409;
  --error-color: #f59ca3;
  --progress-e-color:#f36a75;
  --warning-color: #fff27b;
  --progress-w-color:#f3dd96;

  width: 100%;
  z-index: 9999;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;

  &__content {
    background-color: var(--success-color);
    display: flex;
    padding: 0.5rem;
    height: 50px;
    align-items: center;
    justify-content: space-between;
  }

  &__progress-bar {
    height: 6px;
    background-color: var( --progress-s-color);
    width: 100%;
    display: block;
    overflow: hidden;
    position: relative;

    &::after {
      content: "";
      height: 100%;
      width: 80%;
      background-color: var(--progress-color);
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  &__message {
    margin-bottom: 0;
    font-size: 1rem;
  }

  &__btn {
    outline: none;
    border: none;
    background: transparent;
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.45);
    transition: 0.3s ease-in-out;

    &:hover {
      color: rgba(0, 0, 0, 0.75);
    }
  }

  &.error {
    .toaster {
      &__content {
        background-color: var(--error-color);
      }

      &__progress-bar {
        background-color: var(--progress-e-color);
      }
    }
  }
  &.warning {
    .toaster {
      &__content {
        background-color: var(--warning-color);
      }

      &__progress-bar {
        background-color: var(--progress-w-color);
      }
    }
  }
}
</style>
