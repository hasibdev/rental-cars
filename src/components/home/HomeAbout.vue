
<script setup>
import SectionHeader from "../common/SectionHeader.vue"
import IconCheckRounded from "../../icons/IconCheckRounded.vue"
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t, locale } = useI18n({ useScope: 'global' })

const items = ref([
  {
    id: 1,
    en: "No Schufa information",
    de: "Keine Schufa Auskunft",
  },
  {
    id: 2,

    en: "Without credit card",
    de: "Ohne Kreditkarte",
  },
  {
    id: 3,

    en: "From 21 years",
    de: "Ab 21 Jahren",
  },
])

</script>

<template>
  <div id="ueberuns" class="about-section">
    <div class="container">
      <SectionHeader :subtitle="t('home-about.sub-title')" :title="t('home-about.title')"
        :description="t('home-about.description')" :description-width="60" />
      <div class="row">
        <div v-for="item in items" :key="item.id" class="col-md-4">
          <div class="about-item">
            <span class="icon">
              <IconCheckRounded />
            </span>
            <h5 class="about-item__title">
              {{ item[locale] }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-section {
  margin-top: 3.5rem;
  background-color: var(--color-light-grey);
  padding: 2.6rem 0;
}

.about-item {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-gap: 1rem;
  margin-bottom: 0.75rem;

  @include responsive-max("sm") {
    justify-content: flex-start;
    padding-left: 2rem;
  }

  .icon {
    svg {
      fill: var(--color-dark);

      @include responsive-max("sm") {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 0;

    @include responsive-max("sm") {
      font-size: 1.2rem;
    }
  }
}
</style>
