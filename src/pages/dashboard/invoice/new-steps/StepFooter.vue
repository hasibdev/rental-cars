<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
  info: {
    type: Object
  },
  savingStatus: {
    type: Boolean,
    default: () => false
  }
})

</script>

<template>
  <div style="color: rgba(0,0,0,0.6);background-color: #f2f2f2; border: 1px solid #DDDDDD; border-top: none; border-radius: 0px 0px 4px 4px;" class="footer px-5 py-3 mb-3">
    <div class="d-md-flex justify-content-between">
      <div class="text-10 fw-400">
        <p class="mb-0" v-if="props.info?.info?.compnay_name">{{ props.info?.info?.compnay_name }}</p>
        <p class="mb-0" v-if="props.info?.info?.street">{{ props.info?.info?.street }}</p>
        <p class="mb-0" v-if="props.info?.info?.city">{{ props.info?.info?.postcode }} {{ props.info?.info?.city }}</p>
      </div>
      <div class="text-10 fw-400">
        Bank: Berliner Volksbank <br />
        IBAN: DE02 1009 0000 2899 5660 01 <br />
        BIC: BEVODEBBXXX <br />
        Steuernr.: {{props.info?.info?.tax_no}}
      </div>
      <div class="text-10 mb-0 fw-400">
        <p class="text-10 mb-0 fw-400" v-if="props.info?.info?.mobile_number">Tel: {{ props.info?.info?.mobile_number }}</p>
        <p class="text-10 mb-0 fw-400" v-if="props.info?.info?.account_email">Email: {{ props.info?.info?.account_email }}</p>
        <p class="text-10 mb-0 fw-400">Website: roadstars-cars.de</p>
      </div>
    </div>

    <p class="mb-0 mt-2 text-center text-10 fw-700">{{t("dashboard-invoice.page")}} 1 of 1</p>
  </div>
</template>

<style lang="scss" scoped>
</style>
