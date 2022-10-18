<script setup>
import BackButton from '@/components/buttons/BackButton.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>
<template>
  <div>
    <BackButton :label="t('dashboard-payment.payment')" />

    <div class="row">
      <div class="col-xxl-4 col-lg-6  mx-auto">
        <div class="x-card mt-5 text-center">
          <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="52" cy="52" r="52" fill="#46B276" fill-opacity="0.16" />
            <path
              d="M51.5 24C58.7935 24 65.7882 26.95 70.9454 32.201C76.1027 37.452 79 44.5739 79 52C79 59.4261 76.1027 66.548 70.9454 71.799C65.7882 77.05 58.7935 80 51.5 80C44.2065 80 37.2118 77.05 32.0546 71.799C26.8973 66.548 24 59.4261 24 52C24 44.5739 26.8973 37.452 32.0546 32.201C37.2118 26.95 44.2065 24 51.5 24ZM48.0743 57.524L41.9654 51.3C41.7464 51.077 41.4864 50.9001 41.2002 50.7795C40.9141 50.6588 40.6074 50.5967 40.2977 50.5967C39.988 50.5967 39.6813 50.6588 39.3951 50.7795C39.109 50.9001 38.849 51.077 38.63 51.3C38.1877 51.7503 37.9392 52.3611 37.9392 52.998C37.9392 53.6349 38.1877 54.2457 38.63 54.696L46.4086 62.616C46.627 62.8401 46.8868 63.018 47.173 63.1394C47.4592 63.2607 47.7662 63.3232 48.0763 63.3232C48.3863 63.3232 48.6933 63.2607 48.9795 63.1394C49.2657 63.018 49.5255 62.8401 49.7439 62.616L65.8511 46.212C66.073 45.9899 66.2496 45.7253 66.3705 45.4335C66.4915 45.1416 66.5546 44.8282 66.556 44.5114C66.5575 44.1946 66.4973 43.8806 66.379 43.5876C66.2607 43.2946 66.0865 43.0283 65.8666 42.8042C65.6467 42.58 65.3854 42.4024 65.0978 42.2816C64.8102 42.1608 64.5019 42.0991 64.1907 42.1002C63.8796 42.1013 63.5717 42.1652 63.2849 42.288C62.9981 42.4108 62.738 42.5903 62.5196 42.816L48.0743 57.524Z"
              fill="#46B276" />
          </svg>

          <p class="my-3 text-muted">{{t('dashboard-payment.success-text')}}.</p>

          <router-link to="/rechnung" class="btn btn-dark w-100">{{t("dashboard-payment.go-to-invoices")}}</router-link>

          <button class="btn btn-outline-dark w-100 mt-3">
            {{t("dashboard-payment.download-xml-file")}}</button>
        </div>
      </div>
    </div>

  </div>
</template>


<style lang="scss" scoped>
.x-card {
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  padding: 45px;
}
</style>
