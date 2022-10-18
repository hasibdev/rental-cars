<script setup>
import { ref } from 'vue'
import SectionHeader from "../common/SectionHeader.vue"
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const items = ref([
  {
    id: 1,
    icon: "1.svg",
    title: "24-hour car delivery",
    titleDe: "24 Stunden Fahrzeuglieferung",
  },
  {
    id: 2,
    icon: "2.svg",
    title: "24/7 technical support",
    titleDe: "24/7 Kundenservice und Support",
  },
  {
    id: 3,
    icon: "3.svg",
    title: "Fully comprehensive  with deductible",
    titleDe: "Vollkasko mit Selbstbeteiligung",
  },
  {
    id: 4,
    icon: "4.svg",
    title: "Liability insurance",
    titleDe: "Haftpflicht-versicherung",
  },
])

</script>

<template>
  <section id="leistungen" class="feature-section">
    <div class="container">
      <SectionHeader :subtitle="t('home-features.sub-title')" :title="t('home-features.title')"
        :description="t('home-features.description')" :description-width="90" text-left />
      <div class="features-custom__row">
        <div v-for="item in items" :key="item.id" class="">
          <div class="feature-card">
            <div class="feature-card__icon">
              <img :src="require(`@/assets/images/icons/${item.icon}`)" alt="icon" />
            </div>
            <h6 class="feature-card__title">
              {{ locale === 'de' ? item.titleDe : item.title }}
            </h6>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style lang="scss" scoped>
.feature-section {
  margin-top: 1rem;
}

.features-custom__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @include responsive-max("md") {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
}

.feature-card {
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;
  background-color: var(--color-white);
  height: 240px;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 4%);
  padding: 2rem 1.4rem;
  overflow: hidden;
  text-align: center;

  @include responsive-max("md") {
    height: 224px;
  }

  &__icon {
    margin-bottom: 3rem !important;
    width: 45px;
    margin: 0 auto;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }

    @include responsive-max("md") {
      width: 45px;
      margin-bottom: 3.2rem !important;
    }
  }

  &__title {
    font-size: 1.1rem;
    line-height: 1.3;
    margin: 0 auto;
    width: 65%;

    @include responsive-max("md") {
      width: 100%;
    }
  }
}
</style>