
<template>
  <div class="fleet-form">
    <div class="add-customer__container">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <FormInput v-model="form.model" placeholder="Eg: BMW GH2890" :label="$t('FleetCreate.model')" :error="errors.includes('model') ? true : false" />
          <FormInput v-model="form.plateno" :label="$t('FleetCreate.plate-no')" placeholder="Eg: 12345678" :error="errors.includes('plateno') ? true : false" />
          <FormDate v-model="form.fleet_date" placeholder="MM.DD.YYYY" :label="$t('FleetCreate.fleet-date')" :error="errors.includes('fleet_date') ? true : false" />
          <FormSelect v-model="form.class_id" :placeholder="$t('FleetCreate.select-fleet-class')" :options="fleetClasses" display-property="classname" value-property="id" :label="$t('FleetCreate.fleet-class')" :error="errors.includes('class_id') ? true : false" />
          <FormSelect v-model="form.manufacturer_id" :placeholder="$t('FleetCreate.manufacturer')" :options="manufacturers" display-property="manufactures_name" value-property="id" :label="$t('FleetCreate.manufacturer')" :error="errors.includes('manufacturer_id') ? true : false" />
          <FormInput v-model="form.odometer" placeholder="Eg: 1234567" :label="$t('FleetCreate.odometer')" :error="errors.includes('odometer') ? true : false" />
          <FormSelect v-model="form.fuel_id" placeholder="Select Fuel" :options="fuelTypes" display-property="fuel_name" value-property="id" :label="$t('FleetCreate.fuel')" :error="errors.includes('fuel_id') ? true : false" />
          <FormInput v-model="form.fuel_lable" placeholder="Eg: 100%" :label="$t('FleetCreate.fuel-level')" :error="errors.includes('fuel_lable') ? true : false" />
          <FormRadio v-model="form.gearshift" :options="[
              { label: 'Automatic', name: 'gearshift' },
              { label: 'Manual', name: 'gearshift' },
            ]" :label="$t('FleetCreate.gearshift')" :error="errors.includes('gearshift') ? true : false" />
          <template v-for="(check, idx) in form.checks" :key="idx">
            <FormInput v-model="check.check" placeholder="Eg: Main Inspection" :label="$t('FleetCreate.checks')" :error="errors.includes('check') ? true : false" />
            <FormDate v-model="check.check_date" placeholder="MM.DD.YYYY" :label="$t('FleetCreate.fleet-date')" hide-label :error="errors.includes('check') ? true : false" />
          </template>
          <button class="base-btn fleet-form__check-btn" @click="addCheck">
            + {{$t('FleetCreate.add-check')}}
          </button>
          <FormSelect v-model="form.store_id" placeholder="Select Location" :options="locations" display-property="location_name" value-property="id" :label="$t('FleetCreate.base-location')" :error="errors.includes('store_id') ? true : false" />
        </div>
        <div class="col-lg-5 col-md-6 offset-lg-1 col-sm-12">
          <div class="row mx-0 mb-4">
            <div class="col-lg-4 col-md-3 col-sm-3">
              <p style="font-weight: 500;">{{$t('FleetCreate.photo')}}</p>
            </div>
            <div class="col-lg-8 col-md-9 col-sm-9">
              <W-file-uploader v-model="form.files" max="200000" form-name="fleet" endpoint="/admin/documentsupload/store" rm-endpoint="/admin/documentsupload/delete" rm-all-endpoint="/admin/documentsupload/all-delete" :types="['image/png', 'application/pdf']" color="#276EF1" value-property="id" />
            </div>
          </div>
          <div class="mb-4">
            <ArtBoard @update="artboardHandler" endpoint="/admin/documentsupload/singlestore" :deleteEndpoint="`/admin/documentsupload/single-delete/${form.art}`" :select-file="form.art" :error="errors.includes('art') ? true : false" />
          </div>
          <FormTextarea v-model="form.note" :label="$t('FleetCreate.damages')" placeholder="Type text here..." :error="errors.includes('note') ? true : false" />

          <div class="fleet-form__actions text-end">
            <BButton style="width: 150px" :loading="false" theme="light" @click="cancelToCreate">Cancel</BButton>
            <BButton style="width: 150px" :loading="false" theme="secondary" @click="submitForm">{{ loading ? "Saving..." : "Save Fleet" }}</BButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BButton from "@/components/base/BButton.vue"
import WFileUploader from "@/components/base/wfileuploader"
import "@vuepic/vue-datepicker/dist/main.css"
import http from "@/helpers/http"
import ArtBoard from "../shared/ArtBoard.vue"
import FormInput from "../shared/FormInput.vue"
import FormSelect from "../shared/FormSelect.vue"
import FormDate from "../shared/FormDate.vue"
import FormRadio from "../shared/FormRadio.vue"
import FormTextarea from "../shared/FormTextarea.vue"
import { api } from "@/use/useAxios"
import toast from "vue-toastification"
export default {
  components: {
    BButton,
    WFileUploader,
    ArtBoard,
    FormInput,
    FormSelect,
    FormDate,
    FormRadio,
    FormTextarea,
  },
  data() {
    return {
      fleetClasses: [],
      manufacturers: [],
      locations: [],
      fuelTypes: [],
      image: null,
      errors: [],
      optionalFields: [],
      loading: false,
      form: {
        model: "",
        plateno: "",
        fleet_date: "",
        class_id: "",
        manufacturer_id: "",
        odometer: "",
        fuel_id: "",
        fuel_lable: "",
        gearshift: "",
        checks: [
          {
            check: "",
            check_date: "",
          },
        ],
        store_id: "",
        art: "",
        note: "",
        files: [],
      },
    }
  },
  mounted() {
    this.getLocations()
    this.getManufactures()
    this.getVehicleClasses()
    this.getFuels()
  },
  methods: {
    artboardHandler(fileName) {
      this.form.art = fileName
    },
    addCheck() {
      this.form.checks.push({
        check: "",
        check_date: "",
      })
    },
    cancelToCreate() {
      this.$router.go(-1)
    },
    async submitForm() {
      this.checkValidation(this.form)

      if (this.errors.length === 0) {
        this.loading = true
        this.form.fleet_date = new Date(this.form.fleet_date).toISOString()
        this.$emit("submitForm", this.form)
        try {
          // const formData = new FormData();
          // formData.append("documents", this.documents);

          // for (var key of Object.keys(this.form)) {
          //   formData.append(key, this.form[key] ?? '');
          // }

          await api.post("/admin/vehicle/store", {
            ...this.form,
            vehicle_name: this.form.model
          })
          this.resetForm()
          this.loading = false

          // this.setToaster({
          //   type: "success",
          //   text: `$t('toast.addText')`,
          // })
          toast.success(`$t('toast.addText')`)
        } catch (err) {
          this.loading = false
          toast.error(`$t('toast.failureAddText')`)
          // this.setToaster({
          //   type: "error",
          //   text: `$t('toast.failureAddText')`,
          // })
        }
      }
    },
    checkValidation(obj) {
      this.errors = []
      Object.keys(obj).forEach((key) => {
        if (!this.optionalFields.includes(key) && !obj[key]) {
          this.errors.push(key)
        }
      })
    },
    async getLocations() {
      try {
        const data = await http.get(`/get-location`)
        this.locations = data.lcoations
      } catch (err) {
        console.error(err)
      }
    },
    async getManufactures() {
      try {
        const data = await http.get(`/admin/manufacturer`)
        this.manufacturers = data
      } catch (err) {
        console.error(err)
      }
    },
    async getFuels() {
      try {
        const data = await http.get(`/get-fuel`)
        this.fuelTypes = data.fules
      } catch (err) {
        console.error(err)
      }
    },
    async getVehicleClasses() {
      try {
        const data = await api.get(`/get-vhehicle`)
        this.fleetClasses = data.vichiletype
      } catch (err) {
        console.error(err)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
