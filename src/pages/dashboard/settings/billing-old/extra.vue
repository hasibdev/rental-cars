<script setup>
import BackButton from '@/components/buttons/BackButton.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

</script>

<template>
  <default-layout>
    <BackButton :label="t('title.settings')" />
    <h5 class="mt-4 mb-3">Benutzer</h5>

    <div class="row">
      <div class="col-md-4">
        <svg width="412" height="246" viewBox="0 0 412 246" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_568_2261" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="412" height="246">
            <rect width="412" height="246" rx="4" fill="#276EF1" />
          </mask>
          <g mask="url(#mask0_568_2261)">
            <path d="M438.798 239.341C438.798 332.303 295.132 310.015 204.68 310.015C7.30684 255.526 227.36 242.552 245.36 154.552C278.86 67.5518 399.362 19.5518 391.03 -59C481.482 -59 438.798 146.379 438.798 239.341Z" fill="#7895FF" />
          </g>
        </svg>
      </div>

      <div class="col-md-4">
        <h1>Active subscriptions</h1>

        <p>Workspacify Software (Cloud)</p>

        <p>Next payment 20 April 2022</p>

        <dir class="d-flex">
          <p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            5 Users
          </p>
          <p>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Dedicated Support
          </p>
        </dir>
      </div>
    </div>
  </default-layout>
</template>


<style lang="scss" scoped>
</style>
