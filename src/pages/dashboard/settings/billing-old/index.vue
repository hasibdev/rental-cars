<script setup>

import BackButton from "@/components/buttons/BackButton.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import DataTable from "@/components/common/DataTable.vue"
// import StatusBadge from "@/components/common/StatusBadge.vue";
import { useI18n } from "vue-i18n"

const { t } = useI18n({ useScope: 'global' })

const data = [
  {
    date: "20 March 2022",
    payment_method: "****9651",
    total: "799,00€",
    status: "Open",
    invoice: "WS001005",
    variant: "danger",
  },
  {
    date: "20 March 2022",
    payment_method: "****9651",
    total: "799,00€",
    status: "Refunded",
    invoice: "WS001005",
    variant: "success",
  },
  {
    date: "20 March 2022",
    payment_method: "****9651",
    total: "799,00€",
    status: "Paid",
    invoice: "WS001005",
    variant: "primary",
  },
]

const fields = [
  {
    field: "date",
    tdClass: "fw-bold justify-content-center align-item-center",
    label: `${t('billingSettings.date')}`,
  },
  {
    field: "payment_method",
    tdClass: "fw-bold  justify-content-center align-item-center",
    label: `${t('billingSettings.payment-method')}`,
  },
  {
    field: "total",
    tdClass: "fw-bold justify-content-center align-item-center",
    label: `${t('billingSettings.total')}`,
  },
  {
    field: "status",
    tdClass: "fw-bold  justify-content-center align-item-center",
    label: `${t('billingSettings.status')}`,
  },
  {
    field: "invoice",
    tdClass: "fw-bold justify-content-end",
    thClass: "justify-content-end align-item-center",
    label: `${t('billingSettings.invoice')}`,
  },
  {
    field: "download",
    hideTh: true,
    thClass: "small-th",
    tdClass: "fw-bold d-flex justify-content-end small-td align-item-center",
  },
];
</script>

<template>

  <BackButton :label="t('title.settings')" />
  <h5 class="mt-4 mb-3">{{t('billingSettings.title')}}</h5>

  <div class="row">
    <div class="col-lg-4 col-md-6 h-100">
      <div class="bg__card equal_height_box">
        <p class="text-18 pb-1">{{t('billingSettings.current-subscription-plan')}}</p>
        <h2 class="text-white mb-5 h2">BASIC</h2>
        <p class="fw-400 pb-2">{{t('billingSettings.need-extra-text')}}</p>
        <button class="btn btn-white px-5 py-2 fw-600 rounded">{{t('billingSettings.upgrade-btn-text')}}</button>
      </div>
    </div>

    <div class="col-lg-4 col-md-6 mt-3 mt-md-0 h-100">
      <div class="borderd-content equal_height_box">
        <div class="d-flex justify-content-between">
          <div>
            <p class="text-muted text-14 mb-2">{{t('billingSettings.active-subscription-text')}}</p>
            <div class="text-18 pb-2 fw-bold">
              Workspacify Software <br /> (Cloud)
            </div>
            <!-- <div>{{t('billingSettings.new-payment')}} 20 April 2022</div> -->
          </div>
          <h2 class="d-flex align-items-center">
            49€ <span class="text-12 ms-3 text-muted">{{t('billingSettings.monthly')}}</span>
          </h2>
        </div>

        <div class="text-muted text-12 pt-3">{{t('billingSettings.new-payment')}} 20 April 2022</div>

        <div class="d-flex ps-0 mt-2">
          <p>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#1BCE6C" />
              <path d="M14 7L8.5 12.5L6 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="ms-1">5 {{t('billingSettings.users')}}</span>
          </p>
          <p class="ms-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="10" fill="#1BCE6C" />
              <path d="M14 7L8.5 12.5L6 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="ms-1">{{t('billingSettings.dedicated-support')}}</span>
          </p>
        </div>

        <div class="d-flex mt-1">
          <div class="w-50 bg-light rounded p-2 ">
            <svg class="ms-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_568_2292)">
                <path d="M14.1673 17.5V15.8333C14.1673 14.9493 13.8161 14.1014 13.191 13.4763C12.5659 12.8512 11.718 12.5 10.834 12.5H4.16732C3.28326 12.5 2.43542 12.8512 1.8103 13.4763C1.18517 14.1014 0.833984 14.9493 0.833984 15.8333V17.5" stroke="#BBBBBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.49935 9.16667C9.3403 9.16667 10.8327 7.67428 10.8327 5.83333C10.8327 3.99238 9.3403 2.5 7.49935 2.5C5.6584 2.5 4.16602 3.99238 4.16602 5.83333C4.16602 7.67428 5.6584 9.16667 7.49935 9.16667Z" stroke="#BBBBBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19.166 17.5001V15.8334C19.1655 15.0948 18.9196 14.3774 18.4672 13.7937C18.0147 13.2099 17.3811 12.793 16.666 12.6084" stroke="#BBBBBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.334 2.6084C14.051 2.79198 14.6865 3.20898 15.1403 3.79366C15.5942 4.37833 15.8405 5.09742 15.8405 5.83757C15.8405 6.57771 15.5942 7.2968 15.1403 7.88147C14.6865 8.46615 14.051 8.88315 13.334 9.06673" stroke="#BBBBBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_568_2292">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span class="ms-3">3</span>
          </div>
          <div class="w-50 ms-3">
            <PrimaryButton>{{t('button.save')}}</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-6 mt-3 mt-lg-0 h-100">
      <div class="borderd-content equal_height_box">
        <p class="d-flex justify-content-between">
          <span class="text-18">{{t('billingSettings.payment-method')}}</span>
          <span class="text-primary">{{t('button.edit')}}</span>
        </p>

        <div class="p-3 d-flex align-items-center bg-light mt-3">
          <img src="@/assets/images/billing/Ask-Mastercard-Logo.png" />

          <div class="ms-3">
            <p class="text-13 mb-2">
              To: <span class="fw-bold">Workspacify UG</span>
            </p>
            <p class="text-13">
              IBAN:
              <span class="fw-bold">DE24100500000191090883</span>
            </p>
          </div>
        </div>
        <PrimaryButton class="w-100 mt-4 mb-2">{{t('billingSettings.update-payment-method-text')}}</PrimaryButton>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="borderd-content mt-5">
    <h5 class="py-3">Billing History</h5>

    <DataTable :data="data" :fields="fields">
      <template #payment_method="{ row }">
        <img src="@/assets/images/billing/Ask-Mastercard-Logo.png" alt="Card" />
        <span class="fw-bold ms-3">{{ row.payment_method }}</span>
      </template>

      <!-- <template #status="{ row }">
               <StatusBadge :variant="row.variant">{{
                  row.status
               }}</StatusBadge>
            </template> -->

      <template #download style="width: 5rem">
        <button class="btn btn-download px-3 d-flex align-items-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="ms-2">Download</span>
        </button>
      </template>
    </DataTable>
  </div>

</template>

<style lang="scss" scoped>
.equal_height_box {
  min-height: 217px;
}
.bg__card {
  background-image: url("../../../../assets/images/billing/card.png");
  background-repeat: no-repeat;
  background-size: cover;

  color: #fff;
  padding: 25px;
  border-radius: 5px;
  overflow: hidden;
}
.equal_height_box {
  padding: 2rem;
}
.text-18 {
  font-size: 18px;
}
.text-12 {
  font-size: 12px;
}
.btn-white {
  background: white;
  color: $secondary-color;
  font-size: 1rem;
  font-weight: 600;
}
.text-muted {
  color: $lighter-gray;
}
.btn-download {
  background: $secondary-color;
  color: white;
}
</style>
