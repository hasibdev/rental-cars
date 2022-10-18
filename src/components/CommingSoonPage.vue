<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="comming-soon">
    <div class="content">
      <div class="img">
        <img src="@/assets/images/commingsoon.png" alt="" srcset="" />
      </div>
      <h2>{{t('coming-soon.coming-soon')}}</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comming-soon {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    text-align: center;

    .img {
      width: 70%;
      margin: 0 auto;

      img {
        width: 100%;
        height: auto;
      }
    }
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0;
    color: var(--color-warning);
  }
}
</style>
