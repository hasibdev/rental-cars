<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"
import { useAxios, api } from '@/use/useAxios'

import InputControl from '@/components/dashboard/form/InputControl.vue'
import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import SelectControl from '@/components/dashboard/form/SelectControl.vue'
import TextControl from '@/components/dashboard/form/TextControl.vue'
// import FormTextarea from "@/components/dashboard/shared/FormTextarea.vue"
// import BRadio from "@/components/base/BRadio.vue"
// import BButton from "@/components/base/BButton.vue"
import RadioControl from '../../../components/dashboard/form/RadioControl.vue'
import ArtBoard from "@/components/dashboard/shared/ArtBoard.vue"
import PrimaryButton from "@/components/buttons/PrimaryButton.vue"
import BackButton from '@/components/buttons/BackButton.vue'

import DocumentsCameraUploader from '@/components/dashboard/form/DocumentsCameraUploader.vue'

const { t } = useI18n({ useScope: 'global' })
const toast = useToast()
const router = useRouter()

const { data: fleetClasseData } = useAxios('/admin/fleetclass')
const { data: fuelLevelData } = useAxios('/admin/fuel-lavel')
const { data: manufacturerData } = useAxios('/admin/manufacturer')
const { data: FuelData } = useAxios('/get-fuel')
const { data: locationData } = useAxios('/get-location')

const form = reactive({
  model: '',
  vehicle_name: "",
  plateno: "",
  fleet_date: "",
  class_id: "",
  manufacturer_id: "",
  odometer: "",
  fuel_id: "",
  fuel_lable: "",
  gearshift: "",

  store_id: "",
  art: "",
  art_count: 0,
  note: "",
  additional_note: "",
  max_of_people: '',
  documents: []
})

const checks = ref([
  {
    check: "",
    check_date: '',
  },
])
const addCheck = () => {
  checks.value.push({
    check: "",
    check_date: Date.now(),
  })
}

const removeCheck = idx => {
  checks.value.splice(idx, 1)
}


const cancelToCreate = () => router.push(`/fuhrparks`)
const savingState = ref(false)
const documents = ref([])

const submitForm = async () => {
  try {
    savingState.value = true
    const formData = new FormData()

    for (let i = 0; i < documents.value.length; i++) {
      // if (i == 0) {
      //   formData.append(`picture`, documents.value[i])
      // } else {
      //   formData.append(`documents[${i}]`, documents.value[i])
      // }
      formData.append(`documents[${i}]`, documents.value[i])
    }

    for (var key of Object.keys(form)) {
      formData.append(key, form[key] ?? '')
    }

    const checksData = checks.value.filter(check => check.check.trim() !== '')

    formData.append(`checks`, JSON.stringify(checksData))

    await api.post("/admin/vehicle/store", formData)
    documents.value = []

    toast.success(`${t('toast.addText')}`)
    router.push({ path: `/fuhrparks` })
  } catch (err) {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingState.value = false
  }
}

const gearshiftOptions = [
  { label: t('form-fields.automatic'), value: 'Automatic' },
  { label: t('form-fields.manual'), value: 'Manual' },
]

</script>

<template>
  <div class="add-fleet">
    <div class="d-flex align-items-center mb-4">
      <BackButton /> <span class="add-fleet__title ms-3">{{t('dashboard-fleet.add-fleet')}}</span>
    </div>

    <div class="fleet-form">
      <div class="add-fleet__container">
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-12">
            <InputControl v-model="form.vehicle_name" :label="t('FleetCreate.vehicle-name')" :placeholder="t('FleetCreate.vehicle-name')" errorField="vehicle_name" class="mt-3" />
            <InputControl v-model="form.model" :label="t('FleetCreate.model')" :placeholder="t('FleetCreate.model')" errorField="model" class="mt-3" />
            <InputControl v-model="form.plateno" :label="t('FleetCreate.plate-no')" :placeholder="t('FleetCreate.plate-no')" errorField="plateno" class="mt-3" />
            <CalenderControl v-model="form.fleet_date" :label="$t('FleetCreate.fleet-date')" :placeholder="t('FleetCreate.fleet-date')" class="mt-3" errorField="fleet_date" />
            <SelectControl v-model="form.class_id" optionLabel="classname" :options="fleetClasseData || [] " :placeholder="t('FleetCreate.select-fleet-class')" :label="t('FleetCreate.select-fleet-class')" errorField="class_id" class="mt-3" />
            <SelectControl v-model="form.manufacturer_id" optionLabel="manufactures_name" :options="manufacturerData || [] " :placeholder="t('FleetCreate.manufacturer')" :label="t('FleetCreate.select-manufacturer')" errorField="manufacturer_id" class="mt-3" />
            <InputControl v-model="form.odometer" :label="t('FleetCreate.odometer')" :placeholder="t('FleetCreate.odometer')" errorField="odometer" class="mt-3" />
            <SelectControl v-model="form.fuel_id" optionLabel="fuel_name" :options="FuelData?.fules || [] " :placeholder="t('FleetCreate.select-fuel')" :label="t('FleetCreate.fuel')" errorField="fuel_id" class="mt-3" />
            <SelectControl v-model="form.fuel_lable" optionLabel="label_name" :options="fuelLevelData || [] " :placeholder="t('FleetCreate.fuel-level')" :label="t('FleetCreate.fuel-level')" errorField="fuel_lable" class="mt-3" />

            <InputControl v-model="form.seats" type="number" :label="t('FleetCreate.no-of-seats')" :placeholder="t('FleetCreate.max-of-people')" errorField="seats" class="mt-3" />

            <div class="row mx-0 mt-4 d-md-flex align-items-center">
              <div class="col-md-4 col-sm-12 ps-0">
                <p class="mb-1" style="color: #666666;">{{t('FleetCreate.gearshift')}}</p>
              </div>
              <div class="col-md-8 col-sm-12">
                <!-- <b-radio v-model="form.gearshift" :label="$t('FleetCreate.gearshift')" color="#276EF1" style="font-weight:400" inline :options="[
                      { label: t('form-fields.automatic'), name: 'gearshift' },
                      { label: t('form-fields.manual'), name: 'gearshift' },
                  ]" errorField="gearshift" /> -->
                <RadioControl v-model="form.gearshift" name="gearshift" :options="gearshiftOptions" />
              </div>
            </div>
            <div v-for="(check, idx) in checks" :key="idx" class="check__item">
              <InputControl v-model="check.check" type="text" :label="t('FleetCreate.checks')" :placeholder="t('FleetCreate.checks')" class="mt-3" />
              <CalenderControl v-model="check.check_date" :label="$t('FleetCreate.check-date')" placeholder="DD/MM/YYYY" class="mt-3" />
              <svg v-if="checks.length !== 1" @click="removeCheck(idx)" class="remove_icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.33301 3.99967V2.66634C5.33301 2.31272 5.47348 1.97358 5.72353 1.72353C5.97358 1.47348 6.31272 1.33301 6.66634 1.33301H9.33301C9.68663 1.33301 10.0258 1.47348 10.2758 1.72353C10.5259 1.97358 10.6663 2.31272 10.6663 2.66634V3.99967M12.6663 3.99967V13.333C12.6663 13.6866 12.5259 14.0258 12.2758 14.2758C12.0258 14.5259 11.6866 14.6663 11.333 14.6663H4.66634C4.31272 14.6663 3.97358 14.5259 3.72353 14.2758C3.47348 14.0258 3.33301 13.6866 3.33301 13.333V3.99967H12.6663Z" stroke="#F23E3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <button class="base-btn fleet-form__check-btn mt-2 ps-3" @click="addCheck">
              + {{$t('FleetCreate.add-check')}}
            </button>
            <SelectControl v-model="form.store_id" optionLabel="location_name" :options="locationData?.lcoations || [] " :placeholder="t('FleetCreate.base-location')" :label="t('FleetCreate.base-location')" errorField="store_id" class="mt-3" />
            <TextControl v-model="form.note" :label="t('form-fields.note')" :placeholder="t('form-fields.type-a-note-here')" errorField="note" class="my-3" />
          </div>
          <div class="col-lg-5 col-md-6 offset-lg-1 col-sm-12">
            <div class="row mx-0 mb-5">
              <div class="col-md-4 col-sm-12">
                <p class="fw-400" style="color: #666666">{{$t('FleetCreate.photo')}}</p>
              </div>
              <div class="col-md-8 col-sm-12">
                <DocumentsCameraUploader v-model="documents" errorField="picture"></DocumentsCameraUploader>
              </div>
            </div>
            <div class="mb-4">
              <ArtBoard v-model="form.art" v-model:artCount="form.art_count" errorField="art" />
            </div>
            <TextControl v-model="form.additional_note" :label="$t('FleetCreate.damages')" :placeholder="t('FleetCreate.Type-text-here')" errorField="additional_note" class="mb-4" />

            <div class="fleet-form__actions fleets-create__btn-m">
              <button class="btn btn-cancel" :loading="false" @click="cancelToCreate">{{ t("button.cancel") }}</button>
              <PrimaryButton variant="dark" @click="submitForm" :loading="savingState" style="min-width: 180px;">{{
              t("dashboard-fleet.add-fleet") }}</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.check__item {
  position: relative;
  .remove_icon {
    position: absolute;
    top: 15px;
    left: calc(100% + 5px);
    cursor: pointer;
  }
}

.fleets-create__btn-m {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.check__item {
  position: relative;
  .remove_icon {
    position: absolute;
    top: 80%;
    transform: translateY(-50%);
    left: calc(100% + 7px);
    cursor: pointer;
  }
}

@media only screen and (max-width: 768px) {
  .fleets-create__btn-m {
    display: block;
    margin-left: 6.5rem;
  }

  .fleets-create__btn-m button {
    margin-bottom: 1rem;
  }
}

.add-fleet {
  &__title {
    font-size: 1rem;
    // margin-bottom: 2rem;
    // text-transform: capitalize;
  }
}

.fleet-form {
  border: 1px solid var(--color-light-grey);
  padding: 1rem;
  border-radius: 4px;
  padding-bottom: 0;

  &__actions {
    text-align: center;
  }

  &__check-btn {
    padding: 0;
    margin-bottom: 1rem;
    font-size: 0.9375rem;
    color: var(--color-secondary);
    font-weight: 500;
    margin-left: 33%;
  }

  &__right-col {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }
}
</style>
