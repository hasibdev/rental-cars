<template>
  <header :class="{ show: isMobile }" class="header">
    <div>
      <div class="header__sd-nav">
        <app-link class="header__sd-nav-logo" path="/">
          <img src="@/assets/images/logo.svg" alt="logo" />
        </app-link>

        <button @click="showMobileMenu" class="base-btn header__nav-toggler">
          <!-- <span>
            <IconBar />
          </span> -->
          <span v-if="this.isMobile">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span v-else>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 6H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 18H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </button>
      </div>
      <nav ref="menus" :class="{ show: isMobile }" class="header__navbar">
        <app-link class="header__logo" path="/">
          <img src="@/assets/images/logo.svg" alt="logo" />
        </app-link>

        <ul class="header__nav-menu header__nav-menu-left">
          <li class="header__nav-menu-item" @click="showMobileMenu">
            <app-link path="/" class="nav-link"
              :class="{ navActive: ($route.path === '/' && $route.hash !== '#ueberuns' && $route.hash !== '#fahrzeuge' && $route.hash !== '#leistungen' && $route.hash !== '#kontakt' ) }">
              {{ $t("nav.home") }}</app-link>
          </li>
          <li class="header__nav-menu-item" @click="showMobileMenu">
            <app-link class="nav-link" :class="{ navActive: $route.hash === '#ueberuns' }"
              v-if="this.$route.fullPath == '/' " path="/#ueberuns">
              {{$t("nav.about") }}
            </app-link>
            <app-link v-else class="nav-link" :class="{ navActive: $route.hash === '#ueberuns' }" path="/">
              {{$t("nav.about") }}
            </app-link>
          </li>
          <li class="header__nav-menu-item" @click="showMobileMenu">
            <app-link class="nav-link" :class="{ navActive: $route.hash === '#fahrzeuge' }"
              v-if="this.$route.fullPath == '/' " path="/#fahrzeuge">{{
              $t("nav.car") }}
            </app-link>
            <app-link class="nav-link" :class="{ navActive: $route.hash === '#fahrzeuge' }" v-else path="/">{{
            $t("nav.car") }}
            </app-link>
          </li>
          <li class="header__nav-menu-item" @click="showMobileMenu">
            <app-link class="nav-link" :class="{ navActive: $route.hash === '#leistungen' }"
              v-if="this.$route.fullPath == '/' " path="/#leistungen">{{
              $t("nav.features")}}
            </app-link>
            <app-link class="nav-link" :class="{ navActive: $route.hash === '#leistungen' }" v-else path="/">{{
            $t("nav.features") }}
            </app-link>
          </li>
          <li class="header__nav-menu-item">
            <app-link v-if="this.$route.fullPath == '/' " path="/#kontakt" class="nav-link"
              :class="{ navActive: $route.hash === '#kontakt' }">{{
              $t("nav.contact") }}</app-link>
            <app-link v-else path="/" class="nav-link" :class="{ navActive: $route.hash === '#kontakt' }">{{
            $t("nav.contact") }}</app-link>
          </li>
          <li class="header__nav-menu-item">
            <LangSwitcher :showMobileMenu="showMobileMenu" />
          </li>
        </ul>

        <!-- <div class="header__nav-menu header__nav-menu-right">
          <div class="header__nav-menu-lang-swhitcher">
            <LangSwitcher />
          </div>
          <app-link path="/#kontakt" class="header__nav-btn" @click="showMobileMenu" :class="{ navActive: $route.hash === '#kontakt' }">{{
            $t("nav.contact") }}</app-link>
        </div> -->


      </nav>
    </div>
  </header>
</template>

<script>
import LangSwitcher from "./LangSwitcher.vue"
// import IconBar from "../icons/IconBar.vue";
export default {
  name: "TheHeader",
  components: { LangSwitcher },
  data() {
    return {
      isMobile: false,
      activeLink: "home",
    }
  },
  watch: {
    $route(to, from) {
      // this.isMobile = true

      const linkHash = this.$route.hash
      if (this.$route.fullPath === '/' || (this.$route.path === '/' && linkHash))
        if (to !== from) {
          if (linkHash) {
            this.activeLink = linkHash
            this.scrollToDiv(linkHash)
          }
          else {
            this.activeLink = "home"
          }
          this.$refs.menus.classList.remove("show")
        }
    }
  },
  methods: {
    showMobileMenu() {
      this.isMobile = !this.isMobile
    },
    scrollToDiv(id) {
      const el = document.querySelector(id)
      const ofsetH = el.offsetTop - 281

      setTimeout(() => {
        window.scrollTo({
          top: ofsetH,
          behavior: "smooth",
        })
      }, 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  padding: 10px 15px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-light-grey);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99999;
  right: 0;
  height: 80px;


  @include responsive-max("md") {
    height: 70px;
  }

  &.show {
    height: auto;
  }

  &__navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    transition: 0.3s ease;

    @include responsive-max("md") {
      height: auto;
      flex-direction: column;
      align-items: flex-start;
      overflow: hidden;
      height: 0;

      &.show {
        overflow: visible;
        height: auto;
      }
    }
  }

  &__sd-nav {
    display: none;

    @include responsive-max("md") {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      &-logo {
        height: 50px;
        width: auto;

        img {
          width: 70%;
          height: 100%;
        }
      }
    }
  }

  &__logo {
    width: auto;
    height: 100%;

    @include responsive-max("md") {
      display: none;
    }

    img {
      width: 70%;
      height: 100%;
    }
  }

  &__nav-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @include responsive-max("md") {
      flex-direction: column;
      align-items: flex-start;

      &-right {
        flex-direction: row;
        margin-bottom: 0.75rem;
      }

      &-left {
        padding-top: 1rem;
      }
    }

    &-item {
      &:not(:last-child) {
        margin-right: 2rem;
      }

      @include responsive-max("md") {
        &:not(:last-child) {
          margin-right: 0;
        }

        margin-bottom: 1rem;
      }

      .nav-link,
      .nav-link.active.exact-active {
        font-weight: 500;
        // text-transform: capitalize;
        font-size: 1rem;
        color: var(--color-text);
        padding: 0 5px;

        &.navActive,
        &:hover {
          color: var(--color-primary);
        }
      }
    }

    &-lang-swhitcher {
      // margin-right: 2rem;
    }
  }

  &__nav-btn,
  &__nav-btn.active.exact-active {
    background-color: var(--color-dark);
    color: var(--color-white);
    padding: 5px 15px;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 0.4s ease;

    &.navActive,
    &:hover {
      background-color: var(--color-primary);
    }
  }
}
</style>
