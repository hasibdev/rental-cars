<script setup>
import { reactive, watch, ref, computed } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useAxios, api } from '@/use/useAxios'
import { useRoute, useRouter } from 'vue-router'
import StepFooter from '../invoice/new-steps/StepFooter.vue'
import { capitalize } from '@/use/useUtil'
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import InputRightIcon from "@/components/dashboard/form/InputRightIcon.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
import BackButton from '../../../components/buttons/BackButton.vue'
import Carousel from '../../../components/carousel/Carousel.vue'
import CarouselSlide from '../../../components/carousel/CarouselSlide.vue'

const route = useRoute()
const router = useRouter()

const { data: invoiceData, loading } = useAxios(`admin/invoice/view/${route.params.invoiceId}`)
const { data: previousData, loading: previousPaymentsLoading } = useAxios(`admin/paymentregister/prevous-payment/${route.params.invoiceId}`)
const { data: generalInfo } = useAxios('admin/general-information')
const { data: paymentTerms } = useAxios('admin/payment_terms')

const { t } = useI18n({ useScope: 'global' })

const form = reactive({
  invoice_id: route.params.invoiceId,
  custome_id: '',
  amount: '',
  payment_date: moment(new Date()).format('YYYY/MM/DD'),
  payment_method: '',
})

const amountCurrency = ref('')

watch(() => invoiceData.value, (data) => {
  if (data?.invoicesinfo) {
    form.custome_id = data.invoicesinfo.customer_id
    form.payment_method = data.invoicesinfo.accepted_payment_method
    form.amount = data.invoicesinfo.due_amount
  }
})

const loadingState = ref(false)
const validatePayment = async () => {
  try {
    loadingState.value = true
    await api.post(`admin/paymentregister/store`, form)

    router.push(`/zahlungen/${route.params.invoiceId}/erfolg`)
  } catch (error) {
    //
  } finally {
    loadingState.value = false
  }
}

// Previous payment slider
const activeSlide = ref(0)
const hasNext = computed(() => activeSlide.value < previousData.value?.length - 1)
const hasPrev = computed(() => activeSlide.value > 0)
const slideDirection = ref('left')
const nextSlide = () => {
  if (hasNext.value) activeSlide.value += 1
  slideDirection.value = 'left'
}
const prevSlide = () => {
  if (hasPrev.value) activeSlide.value -= 1
  slideDirection.value = 'right'
}
</script>

<template>
  <BackButton :label="t('dashboard-payment.payment')" />

  <h6 class="my-4">{{ t('dashboard-payment.register-payment') }}</h6>

  <div v-if="!loading" class="row">
    <div class="col-lg-8 ">
      <div class="borderd-content" style="border-radius: 4px 4px 0px 0px; border-bottom: none; ">
        <!-- Logo -->
        <div>
          <img :src="imageBaseUrl(`/logo/${invoiceData?.invoicesinfo?.logo}`)" alt="Logo" class="mt-3 mb-4" style="width: 132px;">
        </div>
        <!-- Dates -->
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.invoice-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(invoiceData?.invoicesinfo?.invoice_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.due-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(invoiceData?.invoicesinfo?.due_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>

        <!-- Company info -->
        <div class="text-10 fw-400">
          <span v-if="invoiceData?.invoicesinfo?.compnay_name">{{ invoiceData?.invoicesinfo?.compnay_name }}</span>
          <span v-if="invoiceData?.invoicesinfo?.street">, {{ invoiceData?.invoicesinfo?.street }}</span>
          <span v-if="invoiceData?.invoicesinfo?.postcode">,{{ invoiceData?.invoicesinfo?.postcode }} </span>
          <span v-if="invoiceData?.invoicesinfo?.city">{{" "}}{{ invoiceData?.invoicesinfo?.city }}</span>
        </div>
        <!-- Customer Info -->
        <div class="mt-2">
          <p class="mb-0 text-10 fw-400" v-if="invoiceData?.invoicesinfo?.customerinfo?.full_name">{{
          invoiceData?.invoicesinfo?.customerinfo?.full_name }}</p>
          <p class="mb-0 text-10 fw-400" v-if="invoiceData?.invoicesinfo?.customerinfo?.address">{{
          invoiceData?.invoicesinfo?.customerinfo?.address }}</p>
          <p class="mb-0 text-10 fw-400">
            <span v-if="invoiceData?.invoicesinfo?.customerinfo?.zip">{{ invoiceData?.invoicesinfo?.customerinfo?.zip }}
              {{' '}}</span>
            <span v-if="invoiceData?.invoicesinfo?.customerinfo?.city">{{ invoiceData?.invoicesinfo?.customerinfo?.city
            }}</span>
          </p>
        </div>

        <div class="mt-5 mb-4 text-15 fw-700">{{ t('form-fields.invoice') }} {{invoiceData?.invoicesinfo?.invoice_no}}</div>

        <p class="text-12 fw-400">{{ invoiceData?.invoicesinfo?.introduction_text }}</p>

        <table class="table table-borderless rounded overflow-hidden">
          <thead class="bg-black text-white">
            <tr>
              <th class="p-3 text-13 fw-500">{{ t('form-fields.description') }}</th>
              <th class="p-3 text-13 fw-500">{{ t('form-fields.quantity') }}</th>
              <th class="p-3 text-13 fw-500">{{ t('form-fields.unit') }}</th>
              <th class="p-3 text-13 fw-500">{{ t('form-fields.price') }}</th>
              <th class="p-3 text-13 fw-500">{{ t('form-fields.total-net') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(line, ii) in invoiceData.invoicedetails" :key="ii" :style="{background: ii % 2 == 0 ? '#f6f7fb' : '#eee'}">
              <td class="p-4 text-12 fw-400" style="width: 250px;">{{ line.description }}</td>
              <td class="p-4 text-12 fw-400">{{ line.quantity }}</td>
              <td class="p-4 text-12 fw-400">{{ capitalize(line.unit.split('_')[0]) }}</td>
              <td class="p-4 text-12 fw-400">{{ moneyFormat(line.rate) }}</td>
              <td class="p-4 text-12 fw-400">{{ moneyFormat(line.amount) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-summary my-4">
          <div class="row mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right">{{t('form-fields.subtotal')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right pe-4">{{ moneyFormat(invoiceData?.invoicesinfo?.sub_total) }}</div>
            </div>
          </div>
          <div class="row pb-1 mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right">{{t('form-fields.discount')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right pe-4">{{moneyFormat(invoiceData?.invoicesinfo?.discount_amount)}}</div>
            </div>
          </div>
          <div class="row pb-1 mb-4">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right">{{t('form-fields.tax')}}({{
              invoiceData?.invoicesinfo?.tax }}%)</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right pe-4">{{ moneyFormat(invoiceData?.invoicesinfo?.tax_amount) }}</div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <div class="bg-dark text-white d-flex align-items-center justify-content-between" style="border-radius: 4px; padding: 10px 22px;">
              <span class="text-14 fw-700 me-5">{{t('form-fields.grand-total')}}</span>
              <span class="text-22 fw-700">{{ moneyFormat(invoiceData?.invoicesinfo?.grand_total) }}</span>
            </div>
          </div>
        </div>
        <div class="pb-4">
          <div class="text-12 fw-400 pb-2">{{ t('dashboard-invoice.thankyou-text') }}</div>
          <div class="text-12 fw-400">{{ t('dashboard-invoice.total-amount-is-payable-until') }}
            {{moment(invoiceData?.invoicesinfo?.due_date).format('DD MMM YYYY')}}. </div>
        </div>

        <div v-if="invoiceData?.invoicesinfo?.termas_conditions" class="w-50 dashed-text-field mb-4">
          <div class="text-12 fw-700" style="color: rgba(0,0,0,0.6);">{{ t('dashboard-invoice.terms-and-conditions') }}
          </div>
          <p>{{invoiceData?.invoicesinfo?.termas_conditions}}</p>
        </div>

        <p class="text-12 fw-400">{{ invoiceData?.invoicesinfo?.final_text }}</p>

      </div>
      <!-- Footer -->
      <StepFooter :info="{info: generalInfo}" />
    </div>
    <div class="col-lg-4  ">
      <!-- Payment info -->
      <div class="borderd-content">
        <h5 class="mb-4">{{ t('dashboard-invoice.payment-info') }}</h5>

        <!-- <InputControl :modelValue="`${invoiceData.invoiceinfo}`" label="Reference invoice" />         -->
        <!-- Reference invoice -->
        <p class="label mb-1 mt-3">{{ t('form-fields.reference-invoice') }}</p>
        <div class="form-control" style="background: #eee">
          {{invoiceData?.invoicesinfo?.invoice_no}}
        </div>

        <!-- Payment Date -->
        <CalenderControl stack v-model="form.payment_date" :label="t('form-fields.payment-date')" errorField="payment_date" class="mt-3" />

        <!-- Payment Method -->
        <FormSelect stack class="mt-3" v-model="form.payment_method" :searching="loading" errorField="reservation_id" :options="paymentTerms || []" displayProperty="paymentterms_name" valueProperty="id" :label="t('form-fields.payment-method')" :placeholder="t('form-fields.please-select')" no-border>
        </FormSelect>

        <!-- Amount -->
        <InputRightIcon stack v-model="form.amount" v-model:currency="amountCurrency" :label="t('form-fields.amount')" type="number" class="mt-3" errorField="amount" />
        <!-- <p class="label mb-1 mt-3">{{ t('form-fields.amount') }}</p>
        <div class="input-group mb-3">
          <input v-model="form.amount" type="number" class="form-control" :placeholder="t('form-fields.amount')">
          <span class="input-group-text px-3 border-end-0 border-top-0 border-bottom-0" style="background: #eee;">
            €
          </span>
        </div> -->

        <PrimaryButton @click="validatePayment" :loading="loadingState" variant="dark" class="w-100 mt-4">
          {{t('button.validate-payment')}}</PrimaryButton>
      </div>

      <!-- Previous payment -->
      <div class="borderd-content payment mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5>{{t('dashboard-invoice.previous-payments')}}</h5>
          <!-- Arrows -->
          <div v-if="!previousPaymentsLoading && previousData?.length">
            <span @click="prevSlide" :class="{'pointer': hasPrev}">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_4203_3787)">
                  <rect x="4" y="2" width="32" height="32" rx="4" fill="white" />
                  <path d="M23 12L17 18L23 24" stroke="black" :stroke-opacity="hasPrev ? 1 : 0.32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <filter id="filter0_d_4203_3787" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4203_3787" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4203_3787" result="shape" />
                  </filter>
                </defs>
              </svg>

            </span>
            <span @click="nextSlide" :class="{'pointer': hasNext}">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_4203_3791)">
                  <rect x="36" y="34" width="32" height="32" rx="4" transform="rotate(180 36 34)" fill="white" />
                  <path d="M17 24L23 18L17 12" :stroke-opacity="hasNext ? 1 : 0.32" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <filter id="filter0_d_4203_3791" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4203_3791" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4203_3791" result="shape" />
                  </filter>
                </defs>
              </svg>

            </span>
          </div>

        </div>
        <Loading v-if="previousPaymentsLoading " />
        <Carousel v-if="!previousPaymentsLoading && previousData?.length" style="height: 260px;">
          <CarouselSlide v-for="(prevPay, i) in previousData || []" :key="i" :index="i" :activeSlide="activeSlide" :direction="slideDirection">
            <div class="card">
              <p class="text-center py-2 fw-bold">BNK1 /2022/08/06</p>
              <table class="table table-card">
                <tbody>
                  <tr class="py-5">
                    <td>
                      <span class="me-md-3 card__item">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.9998 1.66699H1.99984C1.26346 1.66699 0.666504 2.26395 0.666504 3.00033V11.0003C0.666504 11.7367 1.26346 12.3337 1.99984 12.3337H13.9998C14.7362 12.3337 15.3332 11.7367 15.3332 11.0003V3.00033C15.3332 2.26395 14.7362 1.66699 13.9998 1.66699Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M0.666504 5.66699H15.3332" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </span>
                      <span>{{t('form-fields.payment-method')}}</span>
                    </td>
                    <td>
                      <span>
                        {{ prevPay.payment_method }}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span class="card__item me-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.04 2.23926H2.95959C2.16427 2.23926 1.51953 2.88399 1.51953 3.67931V13.7597C1.51953 14.555 2.16427 15.1998 2.95959 15.1998H13.04C13.8353 15.1998 14.48 14.555 14.48 13.7597V3.67931C14.48 2.88399 13.8353 2.23926 13.04 2.23926Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M10.8804 0.799805V3.67992" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M5.11914 0.799805V3.67992" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M1.51953 6.55957H14.48" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span>{{t('form-fields.collection-date')}}</span>
                    </td>
                    <td>
                      <span class="fw-bold">{{ prevPay.payment_date }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="card__item me-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.8438 9.4375C11.1022 9.4375 11.3125 9.64497 11.3125 9.9H12.25C12.25 9.29162 11.8581 8.77291 11.3125 8.58028V7.5625H10.375V8.58062C9.82941 8.77412 9.4375 9.29516 9.4375 9.90625C9.4375 10.6817 10.0683 11.3125 10.8438 11.3125C11.1022 11.3125 11.3125 11.5228 11.3125 11.7813C11.3125 12.0397 11.1022 12.25 10.8438 12.25C10.5853 12.25 10.375 12.0397 10.375 11.7813H9.4375C9.4375 12.3923 9.82941 12.9134 10.375 13.1069V14.1188H11.3125V13.1069C11.8581 12.9134 12.25 12.3923 12.25 11.7813C12.25 11.0058 11.6192 10.375 10.8438 10.375C10.5853 10.375 10.375 10.1647 10.375 9.90625C10.375 9.64778 10.5853 9.4375 10.8438 9.4375Z" fill="black" />
                          <path d="M10.8438 5.6875C10.6857 5.6875 10.5294 5.69506 10.375 5.70903V2.8125C10.375 1.99966 9.79537 1.26219 8.74294 0.735969C7.79375 0.261375 6.54219 0 5.21875 0C3.89262 0 2.63103 0.260844 1.66634 0.734438C0.591813 1.26203 0 2 0 2.8125V11.3125C0 12.125 0.591813 12.863 1.66634 13.3906C2.63103 13.8642 3.89262 14.125 5.21875 14.125C5.75028 14.125 6.27022 14.0826 6.76922 13.9999C7.71331 15.2159 9.18859 16 10.8438 16C13.6869 16 16 13.6869 16 10.8438C16 8.00059 13.6869 5.6875 10.8438 5.6875ZM2.07953 1.576C2.906 1.17022 4.05019 0.9375 5.21875 0.9375C7.70494 0.9375 9.4375 1.92566 9.4375 2.8125C9.4375 3.69934 7.70494 4.6875 5.21875 4.6875C4.05019 4.6875 2.906 4.45478 2.07953 4.049C1.35375 3.69269 0.9375 3.242 0.9375 2.8125C0.9375 2.383 1.35375 1.93231 2.07953 1.576ZM0.9375 4.44578C1.14762 4.60631 1.391 4.75537 1.66634 4.89056C2.63103 5.36416 3.89262 5.625 5.21875 5.625C6.54219 5.625 7.79375 5.36363 8.74294 4.88903C9.00416 4.75841 9.23616 4.61478 9.4375 4.46022V5.88241C8.50325 6.14756 7.67628 6.67019 7.03819 7.36828C6.46706 7.49713 5.85581 7.5625 5.21875 7.5625C4.05019 7.5625 2.906 7.32978 2.07953 6.924C1.35375 6.56769 0.9375 6.117 0.9375 5.6875V4.44578ZM0.9375 7.32078C1.14762 7.48131 1.391 7.63037 1.66634 7.76556C2.63103 8.23916 3.89262 8.5 5.21875 8.5C5.58066 8.5 5.93569 8.48059 6.28191 8.44253C5.97391 9.02534 5.77434 9.67381 5.71025 10.3611C5.54741 10.3701 5.38322 10.375 5.21875 10.375C4.05019 10.375 2.906 10.1423 2.07953 9.7365C1.35375 9.38019 0.9375 8.9295 0.9375 8.5V7.32078ZM5.21875 13.1875C4.05019 13.1875 2.906 12.9548 2.07953 12.549C1.35375 12.1927 0.9375 11.742 0.9375 11.3125V10.1333C1.14762 10.2938 1.391 10.4428 1.66634 10.578C2.63103 11.0517 3.89262 11.3125 5.21875 11.3125C5.38219 11.3125 5.54559 11.3084 5.70794 11.3004C5.76544 11.9525 5.94478 12.5701 6.22312 13.1303C5.89625 13.168 5.56053 13.1875 5.21875 13.1875ZM10.8438 15.0625C8.51753 15.0625 6.625 13.17 6.625 10.8438C6.625 8.51753 8.51753 6.625 10.8438 6.625C13.17 6.625 15.0625 8.51753 15.0625 10.8438C15.0625 13.17 13.17 15.0625 10.8438 15.0625Z" fill="black" />
                        </svg>

                      </span>
                      <span>{{ t('form-fields.amount') }}</span>
                    </td>
                    <td>
                      <span class="fw-bold">{{ moneyFormat(prevPay.amount) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CarouselSlide>
        </Carousel>
        <p v-if="!previousPaymentsLoading && !previousData?.length" class="text-muted">{{t('dashboard-invoice.no-previous-payments-found')}}</p>
      </div>
    </div>

  </div>

  <Loading v-else />
</template>

<style lang="scss" scoped>
.label {
  color: #666;
}

.table {
  tbody {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}

.payment {
  border: 1px solid #dddddd;
  border-radius: 4px;

  .card {
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.12);
    border: none;
    border-radius: 5px;

    p {
      background-color: #000000;
      color: #ffffff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &__item svg {
      opacity: 0.32;
    }
  }
}

.table-card {
  border: none;
  margin-bottom: 0;
}

tr td {
  padding: 1.25rem 0;
}

tr:last-child > td {
  border: none;
}

.card__item {
  margin-left: 10px;
}

@media (min-width: 1412px) {
  .card__item {
    margin-left: 56px;
  }
}
</style>
