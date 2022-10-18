<template>

  <div class="add-reservation">
    <div class="add-reservation__header">
      <h2 class="add-reservation__header-title">{{ $t('dashboard-reservation.end-rental')}}</h2>
      <p class="add-reservation__header-text" v-show="this.reservation_no">#{{this.reservation_no}}</p>
    </div>
    <div class="add-reservation__form-container">
      <div class="add-reservation__form-tabs">
        <button v-for="tab in tabs" :key="tab" class="base-btn add-reservation__form-tabs-btn mb-2"
          :class="{ active: tab.id === activeTab?.id }" @click="selectTab(tab)">
          {{ tab.label }}
        </button>
      </div>

      <KeepAlive>
        <component :is="activeTab?.component" />
      </KeepAlive>

      <div class="d-flex justify-content-end align-items-center pt-4">
        <PrimaryButton variant="light" style="min-width: 180px;" @click="$router.push(`reservierungen`)">{{
        $t('button.cancel')}}</PrimaryButton>
        <!-- <PrimaryButton outlined v-if="isLastTab" :loading="savingStatus" variant="dark" @click="saveReservation('Rented')" class="ms-3">Update Reservation</PrimaryButton> -->
        <PrimaryButton v-if="isLastTab" style="min-width: 180px;" :loading="savingStatus" variant="dark"
          @click="saveReservation('Rented')" class="ms-3">{{$t('dashboard-reservation.end-rental')}}</PrimaryButton>
        <PrimaryButton v-if="!isLastTab" style="min-width: 180px;" variant="dark" @click="goNext" class="ms-3">
          {{$t('button.next')}}</PrimaryButton>
      </div>
    </div>

  </div>

  <AlertModal ref="alertModal" />
</template>

<script>
// import FormCustomerInfo from "./endRentalTabs/FormCustomerInfo.vue"
import FormDetails from "./endRentalTabs/FormDetails.vue"
import FormHandoverDetails from "./endRentalTabs/FormHandoverDetails.vue"
import FormDamages from "./endRentalTabs/FormDamages.vue"
import FormRates from "./endRentalTabs/FormRates.vue"
// import http from "@/helpers/http"
import { api } from '../../../plugins/api'
import AlertModal from "../../../components/dashboard/shared/AlertModal.vue"

import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { mapState } from 'pinia'
import { useReservationStore } from '@/stores/reservation'
import { useValidationStore } from '@/stores/validation'
export default {
  name: "ReservationEndRental",
  components: {
    FormDetails,
    FormHandoverDetails,
    FormDamages,
    FormRates,
    AlertModal,
    PrimaryButton
  },
  data() {
    return {
      activeTab: null,
      tabs: [
        {
          id: 1,
          label: this.$t('dashboard-reservation.details'),
          component: "FormDetails",
        },
        {
          id: 2,
          label: this.$t('dashboard-reservation.rates'), 
          component: "FormRates",
        },
        {
          id: 3,
          label: this.$t('dashboard-reservation.photos-&-damages'),
          component: "FormDamages",
        },
        {
          id: 4,
          label: this.$t('dashboard-reservation.handover-details'),
          component: "FormHandoverDetails",
        }
      ],
      form: {},
      savingStatus: false,
      reservation_no: '',
    }
  },
  computed: {
    ...mapState(useReservationStore, { reservForm: 'endRental' }),
    ...mapState(useValidationStore, ['errors']),
    isLastTab() {
      return this.activeTab.id == this.tabs[this.tabs.length - 1].id
    }
  },
  async created() {
    this.selectTab(this.tabs[0])
    // this.removeAllOldFiles()

    try {
      const res = await api.get(`admin/reservation/edit/${this.$route.params.id}`)

      for (const key in res.data.datainfo) {
        this.reservForm[key] = res.data.datainfo[key]
      }

      this.reservation_no = res?.data?.datainfo?.reservation_no

    } catch (error) {
      console.error(error)
    }
  },


  methods: {
    async saveReservation(status) {
      const detailFields = ['closed_by', 'actual_return_location', 'actual_end_date', 'actual_end_time', 'fuel_level_at_return', 'km_at_return', 'return_fee', 'refueling_fee']
      const damagesfields = ['return_art']

      this.reservForm.status = status
      try {
        this.savingStatus = true
        await api.post(`admin/reservation/returnupdate/${this.$route.params.id}`, {
          ...this.reservForm,
          status
        })
        this.$refs.alertModal.showAlert()
        if (status == 'Rented') {
          this.$router.push(`/reservierungen/vertrags-vorschau/${this.$route.params.id}`)
        }
      } catch (err) {
        if (err.request.status == 422) {
          for (const key of Object.keys(this.errors)) {
            if (detailFields.includes(key)) {
              this.activeTab = {
                id: 1,
                label: "Details",
                component: "FormDetails",
              }
              break
            }

            if (damagesfields.includes(key)) {
              this.activeTab = {
                id: 3,
                label: "Photos & Damages",
                component: "FormDamages",
              }
              break
            }

          }
        }
      } finally {
        this.savingStatus = false
      }
    },
    goNext() {
      const find = this.tabs.find(tab => tab.id == (this.activeTab.id + 1))
      if (find) {
        this.activeTab = find
      }
    },
    selectTab(obj) {
      this.activeTab = obj
    },
    onBack() {
      const newTab = this.tabs.find((tab) => tab.id == this.activeTab.id - 1)
      if (newTab) {
        this.activeTab = newTab
      }
    },
    onNext() {
      const newTab = this.tabs.find((tab) => tab.id == this.activeTab.id + 1)
      if (newTab) {
        this.activeTab = newTab
      }
    },

    // async removeAllOldFiles() {
    //   try {
    //     await http.delete(`/admin/documentsupload/all-delete/damages`)
    //   } catch (err) {
    //     console.error(err)
    //   }
    // },

  },
}
</script>

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