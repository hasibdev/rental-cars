<script setup>
import { ref } from 'vue'

const displayButton = ref(false)
const scrollToTop = () => {
    window.scrollTo(0, 0)
}

window.onscroll = function () {
    if ((window.pageYOffset) >= 450) {
        displayButton.value = true
    }
    else {
        displayButton.value = false
    }
}
</script>

<template>
    <div class="main-scroll" v-if="displayButton">
        <div class="scroll" @click="scrollToTop">
            <img src="../assets/images/dropDown.svg" alt="">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.main-scroll {
    position: fixed;
    bottom: 0;
    right: 1rem;
    cursor: pointer;
    border-radius: 4px;
    z-index: 99;
    border-bottom-width: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    transition: all .3s ease;
    background: var(--color-primary);
    width: 46px;
    height: 40px;
}

.scroll {
    padding: 0.4rem .8rem;
    place-items: center;

    img {
        transform: rotate(180deg);
        height: 1.5rem;
        width: 1.5rem;
    }
}
</style>
