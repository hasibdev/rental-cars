<script setup>
import { defineEmits, defineProps } from 'vue'
import moment from 'moment'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useI18n } from 'vue-i18n'
import { useInvoiceStore } from '@/stores/invoice'
import StepFooter from './StepFooter.vue'
import { capitalize } from '../../../../use/useUtil'

const emits = defineEmits(['changeTab', 'save'])

const props = defineProps({
  info: {
    type: Object
  },
  savingStatus: {
    type: Boolean,
    default: () => false
  }
})

const { t, locale } = useI18n({ useScope: 'global' })
const { form, formCustomer } = useInvoiceStore()

const saveInvoice = async () => {
  emits('save')
}

</script>

<template>
  <div class="d-flex justify-content-center flex-wrap w-100 scrollbar">
    <div class="mb-4" style="width: 596px;">
      <div class="borderd-content" style="border-radius: 4px 4px 0px 0px; border-bottom: none; ">
        <!-- Logo -->
        <div>
          <img :src="imageBaseUrl(`/logo/${props.info?.logo}`)" alt="Logo" class="mt-3 mb-4" style="width: 132px;">
        </div>
        <!-- Dates -->
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-500 pb-2">{{ t('form-fields.invoice-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-500 pb-2">
              {{ moment(form.invoice_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="pe-2 text-right">
            <div class="text-10 fw-400 pb-2">{{ t('form-fields.due-date') }}:</div>
          </div>
          <div class="">
            <div class="text-10 fw-400 pb-2">
              {{ moment(form.due_date).format('DD.MM.YYYY') }}
            </div>
          </div>
        </div>

        <!-- Company info -->
        <div class="text-8 fw-400" style="width: 170px">
          <span v-if="props.info?.compnay_name" class="fw-600 text-10">{{ props.info?.compnay_name }} GmbH</span>,
          <span v-if="props.info?.street" class="fw-400 text-10">{{ props.info?.street }},</span> 
          <span v-if="props.info?.postcode" class="fw-400 text-10">{{ props.info?.postcode }} </span>
          <span v-if="props.info?.city" class="fw-400 text-10">{{", "}}{{ props.info?.city }}</span>
          <span v-if="props.info?.country" class="fw-400 text-10">{{", "}}{{ props.info?.country }}</span>
        </div>
        <!-- Customer Info -->
        <div class="mt-2">
          <p class="mb-0 text-10 fw-600"  style="width: 170px" v-if="formCustomer?.full_name">{{ formCustomer?.full_name }}
            <span class="mb-0 text-10 fw-400" v-if="formCustomer?.address">{{ formCustomer?.address }} </span>
            <span class="mb-0 text-10 fw-400">
              <span v-if="formCustomer?.zip"> {{ formCustomer?.zip }} {{' '}}</span>
              <span v-if="formCustomer?.city">{{ formCustomer?.city }}</span>
            </span>
          </p>
        </div>

        <div class="mt-5 text-15 fw-700 mb-4">{{ t('form-fields.invoice') }} {{form.invoice_no}}</div>

        <p class="text-12 fw-400">{{ form.introduction_text }}</p>

        <table class="table table-borderless rounded overflow-hidden">
          <thead class="bg-black text-white">
            <tr>
              <th class="p-3 text-13">{{ t('form-fields.description') }}</th>
              <th class="p-3 text-13">{{ t('form-fields.quantity') }}</th>
              <th class="p-3 text-13">{{ t('form-fields.unit') }}</th>
              <th class="p-3 text-13">{{ t('form-fields.price') }}</th>
              <th class="p-3 text-13">{{ t('form-fields.total-net') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(line, ii) in form.lines" :key="ii" :style="{background: ii % 2 == 0 ? '#f6f7fb' : '#eee'}">
              <td class="p-4 text-12 fw-400" style="width: 250px;">{{ line.description }}</td>
              <td class="p-4 text-12 fw-400">{{ line.quantity }}</td>
              <td class="p-4 text-12 fw-400">{{ capitalize(line.unit.split('_')[0]) }}</td>
              <td class="p-4 text-12 fw-400">{{ moneyFormat(line.rate, locale) }}</td>
              <td class="p-4 text-12 fw-400">{{ moneyFormat(line.amount, locale) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-summary my-4">
          <div class="row mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.subtotal')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right">{{ moneyFormat(form.sub_total, locale) }}</div>
            </div>
          </div>
          <div class="row pb-1 mb-2">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.discount')}}</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right">{{moneyFormat(form.discount_amount, locale)}}</div>
            </div>
          </div>
          <div class="row pb-1 mb-4">
            <div class="col-md-10">
              <div class="text-12 fw-400 text-right" style="color: rgba(0,0,0,0.6);">{{t('form-fields.tax')}}({{
              form.tax }}%)</div>
            </div>
            <div class="col-md-2">
              <div class="text-12 fw-600 text-right">{{ moneyFormat(form.tax_amount, locale) }}</div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <div class="bg-dark text-white d-flex align-items-center justify-content-between"
              style="border-radius: 4px; padding: 10px 22px;">
              <span class="text-14 fw-500 me-5">{{t('form-fields.grand-total')}}</span>
              <span class="text-18 fw-500">{{ moneyFormat(form.grand_total, locale) }}</span>
            </div>
          </div>
        </div>
        <div class="pb-4">
          <div class="text-12 fw-400 pb-2">{{ t('dashboard-invoice.thankyou-text') }}</div>
          <div class="text-12 fw-400" v-if="locale == 'de'">Der Gesamtbetrag ist <span v-if="form.accepted_payment_method">{{form.accepted_payment_method}}</span> zu zahlen bis
            {{moment(form.due_date).format('DD.MM.YYYY')}}. 
          </div>
          <div class="text-12 fw-400" v-else>The total amount is payable <span v-if="form.accepted_payment_method">by {{form.accepted_payment_method}}</span> until
            {{moment(form.due_date).format('DD/MM/YYYY')}}. 
          </div>
        </div>

        <div v-if="form.termas_conditions" class="w-50 dashed-text-field mb-4">
          <div class="text-12 fw-500" style="color: rgba(0,0,0);">{{ t('dashboard-invoice.terms-and-conditions') }}
          </div>
          <p class="text-10 fw-400" style="color: rgba(0, 0, 0, 0.5);">{{form.termas_conditions}}</p>
        </div>

        <p class="text-12 fw-400">{{ form.final_text }}</p>

      </div>
      <!-- Footer -->
      <StepFooter :info="props" />
    </div>
    <div class="mb-4 px-4" style="width: 350px; margin-left: 60px;">
      <PrimaryButton @click="emits('changeTab', 1)" variant="light" class="w-100">
        <svg class="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4203_5231)">
            <path
              d="M11.332 1.9976C11.5071 1.8225 11.715 1.68361 11.9438 1.58885C12.1725 1.49409 12.4177 1.44531 12.6654 1.44531C12.913 1.44531 13.1582 1.49409 13.387 1.58885C13.6157 1.68361 13.8236 1.8225 13.9987 1.9976C14.1738 2.17269 14.3127 2.38056 14.4074 2.60934C14.5022 2.83811 14.551 3.08331 14.551 3.33093C14.551 3.57855 14.5022 3.82375 14.4074 4.05253C14.3127 4.2813 14.1738 4.48917 13.9987 4.66426L4.9987 13.6643L1.33203 14.6643L2.33203 10.9976L11.332 1.9976Z"
              stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_4203_5231">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        {{ t('button.edit') }}
      </PrimaryButton>
      <PrimaryButton @click="saveInvoice" :loading="savingStatus" class="w-100 mt-4">
        <svg class="me-2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13 2V9H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t('dashboard-invoice.create-invoice') }}
      </PrimaryButton>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.table {
  tbody {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}
</style>
