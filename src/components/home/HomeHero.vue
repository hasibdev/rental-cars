<script setup>
import HomeHeroBrands from "./HomeHeroBrands.vue"
import HomeHeroSearchForm from "./HomeHeroSearchForm.vue"
import { useI18n } from 'vue-i18n'
import { useReservationStore } from '@/stores/reservation'

const { t } = useI18n({ useScope: 'global' })
const reserveStore = useReservationStore()

  </script>

<template>
  <section id="hero" class="hero-section">
    <div class="container">
      <div class="row">
        <!--Booking Form-->
        <div class="col-lg-5 col-md-6">
          <HomeHeroSearchForm :key="reserveStore.keys.requestFormKey" />
        </div>

        <div class="col-lg-7 col-md-6">
          <div class="hero__right">
            <h3 class="hero__right-title">{{ t("home-hero.title") }}</h3>
            <div class="hero__right-img">
              <div class="hero_img"></div>
              <!-- <img class="hero_img" src="@/assets/images/hero.png" alt="image" /> -->
            </div>
          </div>
        </div>
      </div>
      <!--Brand Logo-->
      <div class="row">
        <div class="col-12">
          <HomeHeroBrands />
        </div>
      </div>
    </div>
  </section>
</template>



<style lang="scss" scoped>
.hero-section {
  padding: 4rem 0;

  @include responsive-max("sm") {
    padding: 3rem 0;
  }
}

.hero__right {
  text-align: center;

  &-title {
    font-weight: 600;
    text-transform: capitalize;
    font-size: 2.5rem;
    text-align: center;
    color: var(--color-heading);
    line-height: 1.3;
    margin-bottom: 2rem;
    width: 85%;
    margin-right: auto;
    margin-left: auto;

    @include responsive-max("md") {
      font-size: 2.5rem;
      width: 100%;
    }

    @include responsive-max("sm") {
      margin-top: 1rem;
    }
  }

  &-img {
    width: 70%;
    height: auto;
    margin: 0 auto;

    @include responsive-max("lg") {
      width: 100%;
    }

    .hero_img {
      width: 100%;
      height: 315px;
      background-image: url("../../assets/images/hero.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      object-fit: cover !important;
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
