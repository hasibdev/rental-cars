<template>
  <router-link :to="path">
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    path: {
      type: [String, Object],
      required: true,
    },
  },

};
</script>

