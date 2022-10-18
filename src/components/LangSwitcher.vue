<script setup>
// import IconDeFlag from "../icons/IconDeFlag.vue"
// import IconUsFlag from "../icons/IconUsFlag.vue"
import { onMounted, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'



const { availableLocales, locale } = useI18n({ useScope: 'global' })
const defaultLang = process.env.VUE_APP_DEFAULT_LANG
function switchLocale(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
  document.documentElement.setAttribute('lang', lang)

}



function getLangFull(lang) {
  if (lang === "en") {

    return "English"
  } else if (lang === "de") {
    return "Deutsch"
  }
}

onMounted(() => {
  const lang = localStorage.getItem('lang')
  if (lang && availableLocales.includes(lang)) {
    switchLocale(lang)
    document.documentElement.setAttribute('lang', lang)

  } else {
    switchLocale(defaultLang)
    document.documentElement.setAttribute('lang', defaultLang)
  }
})

const props = defineProps({
  showMobileMenu: Function
})


</script>

<template>
  <div class="lang__switcher">
    <div class="lang__switcher-active">
      <span class="flag">
        <!-- <IconDeFlag v-if="locale === 'de'" />
        <IconUsFlag v-else /> -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
        </svg>
      </span>
      {{ locale === "de" ? "DE" : "EN" }}

    </div>
    <ul class="lang__switcher-items" @click="props.showMobileMenu">
      <li v-for="lang in availableLocales" :key="`locale-${lang}`" class="lang__switcher-item"
        @click="switchLocale(lang)">
        <span class="text">{{ getLangFull(lang) }}</span>

      </li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
.lang__switcher {
  position: relative;
  width: auto;
  min-width: 100px;
}

.lang__switcher-active {
  max-width: 100%;
  padding: 6px 6px;
  display: flex;
  border-radius: 0.25rem;
  // justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  cursor: pointer;
  color: var(--color-text);

  &::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
}


.lang__switcher-items {
  list-style: none;
  width: 100%;
  transition: all 0.1s ease-in-out;
  position: absolute;
  top: 40px;
  left: 0;
  background: #fff;
  visibility: hidden;
  z-index: 5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.123);
  padding: 0;
}

.lang__switcher:hover .lang__switcher-items {
  visibility: visible;
  top: 35px;
}

.lang__switcher-item {
  font-size: 1rem;
  padding: 6px 10px;
  cursor: pointer;
  user-select: none;
}

.lang__switcher-item:hover {
  background-color: #eeeeee;
}

.flag {
  margin-right: 10px;
  width: 18px;
  height: auto;
}
</style>
