<template>
  <TheHeader />
  <main>
    <slot />
    <TheScrollToTop />
  </main>
  <TheFooter />
</template>

<script>
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import TheScrollToTop from "../components/TheScrollToTop.vue"
export default {
  components: {
    TheHeader,
    TheFooter,
    TheScrollToTop
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped>

</style>
