<script setup>
  import {ref, onUnmounted, markRaw, computed} from 'vue'
  import FormDetails from "./endRentalTabs/FormDetails.vue"
  import FormHandoverDetails from "./endRentalTabs/FormHandoverDetails.vue"
  import FormDamages from "./endRentalTabs/FormDamages.vue"
  import FormRates from "./endRentalTabs/FormRates.vue"
  import { api } from '../../../plugins/api'
  import AlertModal from "../../../components/dashboard/shared/AlertModal.vue"

  import PrimaryButton from '../../../components/buttons/PrimaryButton.vue'
  import { useReservationStore } from '@/stores/reservation'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vue-toastification'
  import useVuelidate from '@vuelidate/core'
  import { required, helpers } from '@vuelidate/validators'
  import { deCurrency } from '@/use/useUtil'

  const { t } = useI18n({ useScope: 'global'})
  const toast = useToast()
  const router = useRouter()
  const route = useRoute()
  const activeTab = ref(null)
  const tabs= ref([
    {
      id: 1,
      label: t('dashboard-reservation.details'),
      component: markRaw(FormDetails)
    },
    {
      id: 2,
      label: t('dashboard-reservation.rates'), 
      component: markRaw(FormRates)
    },
    {
      id: 3,
      label: t('dashboard-reservation.photos-&-damages'),
      component: markRaw(FormDamages)
    },
    {
      id: 4,
      label: t('dashboard-reservation.handover-details'),
      component: markRaw(FormHandoverDetails)
    }
  ])

  const savingStatus= ref(false)
  const reservation_no= ref('')

  const { endRental: reservForm, endRentalCurrency, clearForm: clearReservForm } = useReservationStore()

  const fetchReservation = async () => {
    try {
      const res = await api.get(`admin/reservation/edit/${route.params.id}`)

      Object.assign(reservForm, {
        ...res.data.datainfo,
        // non_smoking_agreement: JSON.parse(res.data.datainfo.non_smoking_agreement)
      })
      // Copy to fake form
      endRentalCurrency.cost_per_extra_km = deCurrency(res.data.datainfo.cost_per_extra_km)
      endRentalCurrency.charges_for_additional_km = deCurrency(res.data.datainfo.charges_for_additional_km)
      endRentalCurrency.return_fee = deCurrency(res.data.datainfo.return_fee)
      endRentalCurrency.refueling_fee = deCurrency(res.data.datainfo.refueling_fee)
      
      endRentalCurrency.total_rental_price = deCurrency(res.data.datainfo.total_rental_price)
      endRentalCurrency.pick_up_fee = deCurrency(res.data.datainfo.pick_up_fee)
      // endRentalCurrency.others_costs = deCurrency(res.data.datainfo.others_costs)
      endRentalCurrency.charges_for_extras = deCurrency(res.data.datainfo.charges_for_extras)
      endRentalCurrency.out_of_hours_fee = deCurrency(res.data.datainfo.out_of_hours_fee)

      endRentalCurrency.deposit = deCurrency(res.data.datainfo.deposit)
      endRentalCurrency.deductible_fire_theft = deCurrency(res.data.datainfo.deductible_fire_theft)
      endRentalCurrency.deductible_damage = deCurrency(res.data.datainfo.deductible_damage)
      endRentalCurrency.deductible_liability = deCurrency(res.data.datainfo.deductible_liability)
      endRentalCurrency.withheld_deductible = deCurrency(res.data.datainfo.withheld_deductible) 
      reservation_no.value = res.data.datainfo.resevation_no
      
    } catch {
      //
    }
  }
  fetchReservation()

  // Form Validation rules
  const formRules = {
    closed_by: { required: helpers.withMessage('Closed By is required', required) },
    actual_return_location: { required: helpers.withMessage('Return Loaction is Required', required) },
    actual_end_date: { required: helpers.withMessage('End Date is Required', required) },
    actual_end_time: { required: helpers.withMessage('End Time is Required', required) },
    fuel_level_at_return: { required: helpers.withMessage('Fuel Level is Required', required) },
    km_at_return: { required: helpers.withMessage('Km at pick up is Required', required) },
    return_fee: { required: helpers.withMessage('Return Fee is Required', required) },
    refueling_fee: { required: helpers.withMessage('Refueling Fee is Required', required) },
  }

  const form$v = useVuelidate(formRules, reservForm)

  const saveReservation = async (status) => {
    const detailFields = ['closed_by', 'actual_return_location', 'actual_end_date', 'actual_end_time', 'fuel_level_at_return', 'km_at_return']
    const rateFields = ['return_fee', 'refueling_fee']
    // const damagesfields = ['return_art']

    try {
      savingStatus.value = true

      // if (status == 'Rented') {
        const result = await form$v.value.$validate()

        if (!result) {
          for (const err of form$v.value.$errors) {
            if (detailFields.includes(err.$property)) {
              activeTab.value = {
                id: 1,
                label: t('dashboard-reservation.details'),
                component: FormDetails,
              }
              break
            }
            else if(rateFields.includes(err.$property)) {
              activeTab.value = {
                id: 2,
                label: t('dashboard-reservation.rates'),
                component: FormRates,
              }
              break
            }
          }
          return
        }
      
      const formData = new FormData()
      for (const key in reservForm) {
        formData.append(key, reservForm[key] ?? '')
      }

      if (reservForm.returns_photos && reservForm.returns_photos.length) {
        formData.delete('returns_photos')
        for (let i = 0; i < reservForm.returns_photos.length; i++) {
          formData.append(`returns_photos[${i}]`, reservForm.returns_photos[i] ?? '')
        }
      }

      formData.append('status', status)

      await api.post(`admin/reservation/returnupdate/${route.params.id}`, formData)
      router.push(`/reservierungen/vertrags-vorschau/${route.params.id}`)
      toast.success(`${t('toast.updateText')}`)

    } catch (err) {
      if (err.request.status == 422) {
        for (const key of Object.keys(err.response.data)) {
          if (detailFields.includes(key)) {
            activeTab.value = {
              id: 1,
              label: t('dashboard-reservation.details'),
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

  const isLastTab = computed(() => {
    return activeTab.value.id == tabs.value[tabs.value.length - 1].id
  })

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
  // removeAllOldFiles()

  onUnmounted(() => {
    clearReservForm()
  })


</script>

<template>
  <div class="add-reservation">
    <div class="add-reservation__header">
      <h2 class="add-reservation__header-title">{{ t('dashboard-reservation.end-rental')}}</h2>
      <p class="add-reservation__header-text" v-show="reservation_no">#{{reservation_no}}</p>
    </div>
    <div class="add-reservation__form-container">
      <div class="add-reservation__form-tabs">
        <button v-for="tab in tabs" :key="tab" class="base-btn add-reservation__form-tabs-btn mb-2"
          :class="{ active: tab.id === activeTab?.id }" @click="selectTab(tab)">
          {{ tab.label }}
        </button>
      </div>

      <KeepAlive>
        <component :is="activeTab?.component" :validation="form$v" />
      </KeepAlive>

      <div class="d-flex justify-content-end align-items-center pt-4">
        <PrimaryButton variant="light" style="min-width: 180px;" @click="$router.push(`/reservierungen`)">{{t('button.cancel')}}</PrimaryButton>
        <!-- <PrimaryButton outlined v-if="isLastTab" :loading="savingStatus" variant="dark" @click="saveReservation('Rented')" class="ms-3">Update Reservation</PrimaryButton> -->
        <PrimaryButton v-if="isLastTab" style="min-width: 180px;" :loading="savingStatus" variant="dark"
          @click="saveReservation('Rented')" class="ms-3">{{$t('dashboard-reservation.end-rental')}}</PrimaryButton>
        <PrimaryButton v-if="!isLastTab" style="min-width: 180px;" variant="dark" @click="goNext" class="ms-3">
          {{t('button.next')}}</PrimaryButton>
      </div>
    </div>

  </div>

  <AlertModal ref="alertModal" />
</template>

<style lang="scss" scoped>
.add-reservation {
  min-height: 80vh;

  &__header {
    // display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    &-title {
      font-size: 1rem;
      // margin-bottom: 1rem;
      text-transform: capitalize;
    }

    &-text {
      font-size: 0.75rem;
      font-weight: 300;
      // margin-bottom: 1rem;
      opacity: 0.6;
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
      width: 170px;

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
