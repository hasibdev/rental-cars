
<script setup>
import { ref, computed, onUnmounted, markRaw } from 'vue'
import FormCustomerInfo from "./editTabs/FormCustomerInfo.vue"
import FormDetails from "./editTabs/FormDetails.vue"
import FormDriver from "./editTabs/FormDriver.vue"
import FormDamages from "./editTabs/FormDamages.vue"
import FormRates from "./editTabs/FormRates.vue"
// import { useValidationStore } from '@/stores/validation'
import { api } from '@/plugins/api'
import AlertModal from "@/components/dashboard/shared/AlertModal.vue"

import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useReservationStore } from '@/stores/reservation'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { deCurrency } from '@/use/useUtil'

// const validationStore = useValidationStore()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const router = useRouter()
const route = useRoute()
const activeTab = ref(null)
const savingStatus = ref(false)
const tabs = ref([
  {
    id: 1,
    label: t('dashboard-reservation.customer-info'),
    component: markRaw(FormCustomerInfo),
  },
  {
    id: 2,
    label: t('dashboard-reservation.details'),
    component: markRaw(FormDetails),
  },
  {
    id: 3,
    label: t('dashboard-reservation.driver'),
    component: markRaw(FormDriver),
  },

  {
    id: 4,
    label: t('dashboard-reservation.photos-&-damages'),
    component: markRaw(FormDamages),
  },

  {
    id: 5,
    label: t('dashboard-reservation.rates'),
    component: markRaw(FormRates),
  },
])

const { edit: reservForm, editCurrency, clearForm: clearReservForm, editInfo } = useReservationStore()

const fetchReservation = async () => {
  try {
    const res = await api.get(`admin/reservation/edit/${route.params.id}`)

    Object.assign(reservForm, {
      ...res.data.datainfo,
      non_smoking_agreement: JSON.parse(res.data.datainfo.non_smoking_agreement)
    })
    // Copy to fake form
    editCurrency.per_hour_rate = deCurrency(res.data.datainfo.per_hour_rate)
    editCurrency.total_rental_price = deCurrency(res.data.datainfo.total_rental_price)
    editCurrency.pick_up_fee = deCurrency(res.data.datainfo.pick_up_fee)
    editCurrency.out_of_hours_fee = deCurrency(res.data.datainfo.out_of_hours_fee)
    editCurrency.others_costs = deCurrency(res.data.datainfo.others_costs)
    editCurrency.charges_for_extras = deCurrency(res.data.datainfo.charges_for_extras)
    editCurrency.cost_per_extra_km = deCurrency(res.data.datainfo.cost_per_extra_km)
    editCurrency.deposit = deCurrency(res.data.datainfo.deposit)
    editCurrency.deductible_fire_theft = deCurrency(res.data.datainfo.deductible_fire_theft)
    editCurrency.deductible_damage = deCurrency(res.data.datainfo.deductible_damage)
    editCurrency.deductible_liability = deCurrency(res.data.datainfo.deductible_liability)

    editInfo.artCopy = res.data.datainfo.damages_art
    editInfo.handover_photos = res.data.handover_photos

    editInfo.day_rate = res.data.datainfo.day_rate
    editInfo.week_rate = res.data.datainfo.week_rate
    editInfo.month_rate = res.data.datainfo.month_rate
  } catch {
    //
  }
}
fetchReservation()

const isLastTab = computed(() => {
  return activeTab.value.id == tabs.value[tabs.value.length - 1].id
})

// const detailsTabRules = {
//   vehicle_id: { required: helpers.withMessage('Vehicle is Required', required) },
//   start_date: { required: helpers.withMessage('Start Date is Required', required) },
//   start_time: { required: helpers.withMessage('Start Time is Required', required) },
//   end_date: { required: helpers.withMessage('End Date is Required', required) },
//   end_time: { required: helpers.withMessage('End Time is Required', required) },
// }

// Form Validation rules
const formRules = {
  // origin_of_customer: { required: helpers.withMessage('Origin Of Customer is Required', required) },
  create_by: { required: helpers.withMessage(t('dashboard-reservation.create-by-is-required'), required) },
  vehicle_id: { required: helpers.withMessage('Vehicle is Required', required) },
  pick_up_loaction: { required: helpers.withMessage('Pick Up Loaction is Required', required) },
  return_location: { required: helpers.withMessage('Return Loaction is Required', required) },
  start_date: { required: helpers.withMessage('Start Date is Required', required) },
  start_time: { required: helpers.withMessage('Start Time is Required', required) },
  end_date: { required: helpers.withMessage('End Date is Required', required) },
  end_time: { required: helpers.withMessage('End Time is Required', required) },
  fuel_level_at_pick_up_id: { required: helpers.withMessage('Fuel Level is Required', required) },
  per_hour_rate: { required: helpers.withMessage('Per Hour Rate is Required', required) },
  to_pay: { required: helpers.withMessage('To Pay is Required', required) },
  payment_method: { required: helpers.withMessage('Payment Method is Required', required) },
  total_without_vat: { required: helpers.withMessage('Total Without Vat is Required', required) },
  vat_amount: { required: helpers.withMessage('Vat Amount is Required', required) },
  km_included: { required: helpers.withMessage('Km Included is Required', required) },
  cost_per_extra_km: { required: helpers.withMessage('Cost per extra KM is Required', required) },
  km_at_pick_up: { required: helpers.withMessage('Km at pick up is Required', required) },
  contact_language: { required: helpers.withMessage('Contact Language is Required', required) },
  deposit: { required: helpers.withMessage('Deposit is Required', required) },
  total_rental_price: { required: helpers.withMessage('Rental Price is Required', required) },
}

const form$v = useVuelidate(formRules, reservForm)
// const details$tab = useVuelidate(detailsTabRules, reservForm)

// Save Reservation
const saveReservation = async (status) => {
  const detailFields = ['origin_of_customer', 'create_by', 'vehicle_id', 'pick_up_loaction', 'return_location', 'start_date', 'start_time', 'end_date', 'end_time', 'fuel_level_at_pick_up_id', 'km_included', 'cost_per_extra_km', 'km_at_pick_up', 'contact_language', 'note']

  try {
    savingStatus.value = true

    if (status == 'Rented') {
      const result = await form$v.value.$validate()

      if (!result) {
        for (const err of form$v.value.$errors) {
          if (detailFields.includes(err.$property)) {
            activeTab.value = {
              id: 2,
              label: "Details",
              component: FormDetails,
            }
            break
          }
        }

        return
      }
    }


    const formData = new FormData()
    // Temporar Code
    // console.log(reservForm.km_included)
    if (isNaN(reservForm.km_included) && /[0-9]{1,3}(?:.[0-9]{3})*(?:,[0-9]+)/.test(reservForm.km_included)) {
      // console.log('ok')
      reservForm.km_included = parseFloat((reservForm.km_included).replace('.', '').replace(',', '.')).toFixed(2)
    }
    // Temporar Code

    for (const key in reservForm) {
      formData.append(key, reservForm[key] ?? '')
    }

    if (reservForm.photos_handover && reservForm.photos_handover.length) {
      formData.delete('photos_handover')
      for (let i = 0; i < reservForm.photos_handover.length; i++) {
        formData.append(`photos_handover[${i}]`, reservForm.photos_handover[i] ?? '')
      }
    }

    formData.append('status', 'Reserved')

    await api.post(`admin/reservation/update/${route.params.id}`, formData)

    if (status == 'Rented') {
      router.push(`/reservierungen/vertrags-vorschau/${route.params.id}`)
      toast.success(`${t('toast.addText')}`)
    }
    else {
      router.push(`/reservierungen`)
      toast.success(`${t('toast.addText')}`)
    }

  } catch (err) {
    if (err.request.status == 422) {
      for (const key of Object.keys(err.response.data)) {
        if (detailFields.includes(key)) {
          activeTab.value = {
            id: 2,
            label: "Details",
            component: FormDetails,
          }
          break
        }
      }
    }
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingStatus.value = false
  }
}

const goNext = async () => {
  // Change Tabs
  const find = tabs.value.find(tab => tab.id == (activeTab.value.id + 1))
  if (find) {
    activeTab.value = find
  }
}

const selectTab = (obj) => {
  activeTab.value = obj
}

selectTab(tabs.value[0])


onUnmounted(() => {
  clearReservForm()
})
</script>


<template>

  <div class="add-reservation">
    <div class="add-reservation__header">
      <h2 class="add-reservation__header-title">{{ t('dashboard-reservation.update-reservation') }} </h2>
      <!-- <h6 class="d-flex align-items-center mb-3 add-reservation__header-title">
            <BackButton /> <span class="ms-3"> {{ $t('dashboard-reservation.add-reservation')}} </span>
          </h6> -->
    </div>
    <div class="add-reservation__form-container">
      <div class="add-reservation__form-tabs row gap-2">
        <button v-for="tab in tabs" :key="tab" class="base-btn add-reservation__form-tabs-btn" :class="{ active: tab.id === activeTab?.id }" @click="selectTab(tab)">
          {{ tab.label }}
        </button>
      </div>

      <KeepAlive>
        <component :is="activeTab?.component" :validation="form$v" />
      </KeepAlive>

      <div class="d-flex justify-content-end align-items-center pt-4">
        <PrimaryButton variant="light" style="min-width: 180px;" @click="$router.push(`/reservierungen`)">{{
        t('button.cancel') }}</PrimaryButton>
        <PrimaryButton outlined style="min-width: 180px;" v-if="isLastTab" :loading="savingStatus" variant="dark" @click="saveReservation('Reserved')" class="ms-3">{{ t('dashboard-reservation.update-reservation') }}
        </PrimaryButton>
        <PrimaryButton v-if="isLastTab" style="min-width: 180px;" :loading="savingStatus" variant="dark" @click="saveReservation('Rented')" class="ms-3">{{ t('dashboard-reservation.start-rental') }}</PrimaryButton>
        <PrimaryButton v-if="!isLastTab" style="min-width: 180px;" variant="dark" @click="goNext" class="ms-3">{{
        t('button.next') }}</PrimaryButton>
      </div>
    </div>
  </div>

  <AlertModal ref="alertModal" />
</template>

<style lang="scss" scoped>
.add-reservation {
  min-height: 80vh;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    &-title {
      font-size: 1rem;
      margin-bottom: 1rem;
      text-transform: capitalize;
    }

    &-btn {
      color: var(--color-white);
      background-color: var(--color-dark);
    }
  }

  &__form-container {
    border: 1px solid var(--color-light-grey);
    padding: 1.5rem;
    border-radius: 4px;
    padding-bottom: 0.5rem;
    min-height: 80vh;
  }

  &__form-tabs {
    margin-bottom: 1.75rem;

    &-btn {
      background-color: var(--color-light-grey);
      font-weight: 400;
      font-size: 1rem;
      transition: all 0.2s ease;
      min-width: 180px;
      // font-size: 0.875rem;

      &.active,
      &:hover {
        background-color: var(--color-dark);
        color: var(--color-white);
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.auto-tab-grid {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  scrollbar-width: thin;
  padding-bottom: 1rem;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
    -webkit-box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.041);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
    -webkit-box-shadow: inset 0 0 16px rgba(228, 217, 217, 0.041);
    background-color: #dadce0;
  }
}

.m-top-4 {
  margin-top: 1.5rem;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
