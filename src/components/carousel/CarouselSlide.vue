<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  index: { type: Number, default: () => 0 },
  activeSlide: { type: Number, default: () => 0 },
  direction: { type: String, default: () => 'left' }
})
</script>

<template>
  <transition :name="props.direction">
    <div v-show="props.index == props.activeSlide" class="carousel__slide">
      <slot />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.carousel__slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

// Left Animaion
.left-enter-active {
  animation: leftInAnimation 0.3s ease-in-out;
}
.left-leave-active {
  animation: leftOutAnimation 0.3s ease-in-out;
}

@keyframes leftInAnimation {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes leftOutAnimation {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

// Right Animation

.right-enter-active {
  animation: rightInAnimation 0.3s ease-in-out;
}
.right-leave-active {
  animation: rightOutAnimation 0.3s ease-in-out;
}

@keyframes rightInAnimation {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes rightOutAnimation {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
