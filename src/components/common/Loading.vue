<script setup>
// import { defineProps } from 'vue'
// import loadingJson from '../../assets/Loader.json'
// const props = defineProps({
//   width: {
//     type: String,
//     default: '50px'
//   },
// })
</script>
<template>
  <div class="loading_img">
    <!-- <lottie-player autoplay loop mode="normal" :src="loadingJson" :style="{width: props.width}" /> -->
    <div class="spinner-border text-dark my-4" role="status" aria-hidden="true"></div>
  </div>
</template>


<style lang="scss" scoped>
.loading_img {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
