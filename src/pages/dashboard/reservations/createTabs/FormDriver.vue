<script setup>
import { ref, reactive, watch, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from "vue-toastification"

import InputControl from "@/components/dashboard/form/InputControl.vue"
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import DocumentsUploader from '@/components/dashboard/form/DocumentsUploaderSmall.vue'
import DriverCard from "@/components/dashboard/reservations/components/DriverCard.vue"
import ModalControl from '@/components/common/modals/ModalControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

import { useReservationStore } from '@/stores/reservation'
import { api } from '@/use/useAxios'
import { past21years } from '@/use/useUtil'

defineProps({
  validation: {
    type: Object,
    default: () => { }
  }
})

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const reserveStore = useReservationStore()
const drivers = ref([])
const activeDriver = ref(null)

const loadingDrivers = ref(true)
const searchDrivers = async (keyowrd = "") => {
  try {
    const res = await api.get(`/admin/driver/search?customer_id=${reserveStore.form.customer_id}&name=${keyowrd}`)
    drivers.value = res.data
  } catch (err) {
    console.error(err)
  }
  finally {
    loadingDrivers.value = false
  }
}
searchDrivers()

const selectDriver = () => {
  activeDriver.value = drivers.value.find(
    ({ id }) => id === +reserveStore.form.driver_id
  )
}

watch(() => reserveStore.form.driver_id, () => {
  selectDriver()
})

const addFormCopy = {
  customer_id: reserveStore.form.customer_id,
  driver_name: '',
  date_of_birth: '',
  driving_license_no: '',
  place_of_birth: '',
  place_of_issuance: '',
  date_of_issue: '',
  due_date: ''
}
const addModalStatus = ref(false)
const addForm = reactive({ ...addFormCopy })

const files = ref([])
const addingState = ref(false)
const onAddDriver = async () => {
  const formData = new FormData()
  for (let i = 0; i < files.value.length; i++) {
    formData.append(`files[${i}]`, files.value[i])
  }
  for (let key in addForm) {
    formData.append(key, addForm[key] ?? '')
  }
  try {
    addingState.value = true
    const res = await api.post('/admin/driver/store', formData)

    addModalStatus.value = false
    // searchDrivers()
    drivers.value.push(res.data.driverinfo)
    reserveStore.form.driver_id = res.data.driverinfo.id

    Object.assign(addForm, { ...addFormCopy })

    toast.success(`${t('toast.addText')}`)
  } catch {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    addingState.value = false
  }
}

const onDeleteDriver = (id) => {
  setTimeout(() => {
    reserveStore.form.driver_id = null
    activeDriver.value = null
    drivers.value = drivers.value.filter(driver => driver.id !== id)
  }, 100)

}

const showAdditionaldriver = ref(false)
const addAdditionalDriver = () => {
  showAdditionaldriver.value = !showAdditionaldriver.value
  if (!showAdditionaldriver.value) {
    reserveStore.form.other_driver_id = ''
  }
}

</script>
<template>
  <div class="row">
    <div class="col-md-5">
      <p>{{ t('dashboard-reservation.driver-name')}}</p>
      <FormSelect v-model="reserveStore.form.driver_id" :options="drivers" displayProperty="driver_name" valueProperty="id" :placeholder="t('form-fields.select-driver-name')" search :search-placeholder="t('form-fields.select-driver-name')" no-border @search="searchDrivers" />

      <div class="action d-flex">
        <button v-if="reserveStore.form.driver_id" @click="addAdditionalDriver" class="base-btn action__btn mt-2">
          {{ showAdditionaldriver ? '-' : '+' }} {{t('dashboard-reservation.additional-driver')}}
        </button>
        <button @click="addModalStatus = true" class="base-btn action__btn mt-2 ms-auto">
          + {{t('dashboard-reservation.new-driver')}}
        </button>
      </div>

      <!-- Additional Drivers -->
      <FormSelect v-model="reserveStore.form.other_driver_id" v-if="showAdditionaldriver" :options="drivers" class="mt-2" displayProperty="driver_name" valueProperty="id" :placeholder="t('form-fields.select-driver-name')" search :search-placeholder="t('form-fields.select-driver-name')" no-border @search="searchDrivers" />

    </div>
    <div class="col-md-7">
      <template v-if="!loadingDrivers">
        <DriverCard v-model:driver="activeDriver" v-if="activeDriver" @onDelete="onDeleteDriver" />
      </template>

      <!-- Loading -->
      <Loading v-if="loadingDrivers" class="my-3" />
    </div>
  </div>

  <!-- Add Modal -->
  <ModalControl v-model="addModalStatus" dialogClass="modal-md">
    <div class="modal-header">
      <p class="mb-1">{{t('dashboard-reservation.add-driver')}}</p>
    </div>
    <div class="modal-body">
      <!-- <p class="fw-500">{{t('dashboard-reservation.details')}}</p> -->
      <InputControl v-model="addForm.driver_name" :placeholder="t('dashboard-reservation.driver-name')" class="mb-3" errorField="driver_name" />
      <CalenderControl v-model="addForm.date_of_birth" :maxDate="past21years()" :placeholder="t('dashboard-reservation.date-of-birth')" class="mb-3" errorField="date_of_birth" />

      <!-- <SelectControl v-model="addForm.reservation_id" track="id" optionLabel="reservation_no" :options="reservationData?.reversions.data || [] " :placeholder="t('Accident.reservation-id')" errorField="reservation_id" class="mt-3" /> -->
      <InputControl v-model="addForm.place_of_birth" :placeholder="t('dashboard-reservation.place-of-birth')" errorField="place_of_birth" class="mt-3" />
      <InputControl v-model="addForm.driving_license_no" :placeholder="t('dashboard-reservation.driving-license-no')" errorField="driving_license_no" class="mt-3" />
      <InputControl v-model="addForm.place_of_issuance" :placeholder="t('dashboard-reservation.place-of-issuance')" errorField="place_of_issuance" class="mt-3" />
      <CalenderControl v-model="addForm.date_of_issue" :placeholder="t('dashboard-reservation.date-of-issue')" class="my-3" errorField="date_of_issue" />
      <CalenderControl v-model="addForm.due_date" :placeholder="t('dashboard-reservation.due-date')" class="my-3" errorField="due_date" />
      <DocumentsUploader v-model="files"></DocumentsUploader>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="addModalStatus = false" type="button" class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton variant="dark" @click="onAddDriver" :loading="addingState">{{t('button.save')}}</PrimaryButton>
    </div>
  </ModalControl>

</template>

<style lang="scss" scoped>
.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -10px;
  &__btn {
    color: var(--color-dark);
    &--first {
      // margin-left: 26%;
      &.hide {
        opacity: 0;
      }
    }
  }
}

.d-file-uploader {
  margin-left: 29%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;

  &__btn {
    color: var(--color-dark);
    border: 1px solid var(--color-dark);
    cursor: pointer;
    font-size: 0.875rem;
  }
  &__hints {
    margin-bottom: 0;
    font-size: 0.875rem;
  }

  input {
    opacity: 0;
    width: 20%;
  }
}

.c-driver-action {
  text-align: end;
  &__btn {
    color: var(--color-dark);

    &--action {
      background-color: var(--color-dark);
      color: var(--color-white);
    }
  }
}

.error__message {
  color: var(--color-error);
  margin-left: 29%;
  margin-bottom: 0;
}
</style>
