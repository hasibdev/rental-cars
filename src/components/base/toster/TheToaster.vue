<template>
  <div class="toaster__inner" :class="classes">
    <ToasterMessage
      v-for="(toast, idx) in messages"
      :key="idx"
      :content="toast"
    />
  </div>
</template>

<script>
import { useToaster } from "@/stores/toaster";
import ToasterMessage from "./ToasterMessage.vue";

export default {
  components: {
    ToasterMessage,
  },
  setup() {
    const toastStore = useToaster();
    const messages = toastStore.messages;
    const classes = toastStore.config.position;
    return { messages, classes };
  },
};
</script>

<style lang="scss" scoped>
.toaster__inner {
  position: absolute;
  z-index: 9999;
  width: 25%;
  z-index: 9999;
  border-radius: 4px;
  overflow: hidden;

  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
  &.center {
    left: 50%;
    transform: translateX(-50%);
  }

  &.top {
    top: 20px;
  }

  &.bottom {
    bottom: 20px;
  }
}
</style>
