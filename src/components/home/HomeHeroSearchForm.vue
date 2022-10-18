<template>
  <div class="search-box">
    <b-select ref="vehicleType" v-model="requestForm.vehicleClass" :options="vehicleClasses" display-property="classname" value-property="id" :placeholder="$t('home-search-form.vehicle-class')" required outline>
    </b-select>

    <div class="search-box__field">
      <label class="form__label">{{
        $t("home-search-form.pick-location")
      }}</label>
      <b-select ref="location" v-model="requestForm.location" :vehicleClasses="vehicleClasses" :options="locations" display-property="location_name" value-property="id" :placeholder="$t('home-search-form.pick-location')" required outline icon class="search-box__select">
        <IconLocationFill />
      </b-select>
    </div>

    <div class="search-box__field">
      <label class="form__label">{{
        $t("home-search-form.pickup-date")
      }}</label>
      <div class="row">
        <div class="col-6">
          <date-range-picker ref="pickupDate" v-model="requestForm.dates" formatted="dd MMM yyyy" :sd-title="$t('home-search-form.pickup-date')" :label-start-sd="$t('home-search-form.pickup')" :label-end-sd="$t('home-search-form.return')" :button-text-sd="$t('home-search-form.button')" :placeholder="$t('home-search-form.pickup')" required />
        </div>
        <div class="col-6">
          <time-picker ref="pickupTime" v-model="requestForm.pickupTime" :title-sd="$t('home-search-form.pickup-time')" :label-start-sd="$t('home-search-form.pickup')" :label-end-sd="$t('home-search-form.return')" :button-text-sd="$t('home-search-form.button-time')" :placeholder="$t('home-search-form.time')" :options="getTimes" displayProperty="time" valueProperty="24_hour" :open-hours="getHours" :dates="requestForm.dates" outline required />
        </div>
      </div>
    </div>

    <div>
      <label class="form__label">{{
        $t("home-search-form.return-date")
      }}</label>
      <div class="row">
        <div class="col-6">
          <date-range-picker ref="returnDate" v-model="requestForm.dates" formatted="dd MMM yyyy" show-end-date :sd-title="$t('home-search-form.return-date')" :label-start-sd="$t('home-search-form.pickup')" :label-end-sd="$t('home-search-form.return')" :button-text-sd="$t('home-search-form.button')" :placeholder="$t('home-search-form.return')" required />
        </div>
        <div class="col-6">
          <time-picker ref="returnTime" v-model="requestForm.dropTime" :title-sd="$t('home-search-form.return-time')" :label-start-sd="$t('home-search-form.pickup')" :label-end-sd="$t('home-search-form.return')" :button-text-sd="$t('home-search-form.button-time')" :placeholder="$t('home-search-form.time')" :options="getTimes" displayProperty="time" valueProperty="24_hour" :dates="requestForm.dates" :open-hours="getHours" :times="{
              start: requestForm.pickupTime,
              end: requestForm.dropTime,
            }" outline required />
        </div>
      </div>
    </div>

    <div class="d-grid search-box__action">
      <button class="base-btn base-btn__dark request_btn" @click="requestToBook">
        {{ $t("home-search-form.request-botton") }}
      </button>
    </div>

    <Teleport to="body">
      <HomeHeroModalBooking v-if="isShowBookingFrom" :vehicleClasses="vehicleClasses" :locations="locations" :request-info="requestForm" @hideModal="hideBookingForm" />
      <ModelConfirm v-if="isSubmitedBookingForm" @hideModal="hideConfirmModal" />
    </Teleport>
  </div>
</template>

<script>
import HomeHeroModalBooking from "./modals/HomeHeroModalBooking.vue"
import ModelConfirm from "../common/modals/ModelConfirm.vue"
import DateRangePicker from "../base/datepicker/DateRangePicker.vue"
import TimePicker from "../base/timepicker/TimePicker.vue"
import BSelect from "../base/BSelect.vue"
import IconLocationFill from "../../icons/IconLocationFill.vue"
import { api } from "@/plugins/api"
import times from "@/static/times.json"
import { mapState } from 'pinia'
import { useReservationStore } from '@/stores/reservation'

export default {
  namd: "HomeHeroSearchForm",
  components: {
    TimePicker,
    DateRangePicker,
    BSelect,
    IconLocationFill,
    HomeHeroModalBooking,
    ModelConfirm,
  },
  data() {
    return {
      timeSchedules: times,
      openHours: {
        en: ["MO - FR 10am - 6pm", "SA 10am - 4pm"],
        de: ["MO - FR 10-18", "SA 10-16"],
      },
      isShowBookingFrom: false,
      isSubmitedBookingForm: false,
      error: false,
      requestForm: {
        vehicleClass: "",
        location: "",
        dates: {
          start: '',
          end: '',
        },
        pickupTime: "12:00:00",
        dropTime: "12:00:00",
        carImage: "hero.png",
      },
      requestFormInit: {
        vehicleClass: "",
        location: "",
        dates: {
          start: "",
          end: "",
        },
        pickupTime: "",
        dropTime: "",
        carImage: "hero.png",
      },
      vehicleClasses: [],
      locations: [],
    }
  },
  mounted() {
    this.getVehicleClasses()
    this.getLocations()

    function addDays(date, days) {
      var result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    this.requestForm.dates.start = addDays(new Date(), 7)
    this.requestForm.dates.end = addDays(new Date(), 9)
  },
  computed: {
    ...mapState(useReservationStore, ['bookingForm', 'keys']),
    getTimes() {
      return this.$i18n.locale === "de"
        ? this.timeSchedules.de
        : this.timeSchedules.en
    },
    getHours() {
      return this.$i18n.locale === "de" ? this.openHours.de : this.openHours.en
    },
  },

  methods: {
    async getVehicleClasses() {
      try {
        const res = await api.get(`/get-vhehicle`)
        this.vehicleClasses = res.data.vichiletype
      } catch (err) {
        console.error(err)
      }
    },
    async getLocations() {
      try {
        const res = await api.get(`/get-location`)
        this.locations = res.data.lcoations
      } catch (err) {
        console.error(err)
      }
    },
    requestToBook() {
      this.$refs.vehicleType.vlaidateForm()
      this.$refs.location.vlaidateForm()
      this.$refs.pickupDate.vlaidateForm()
      this.$refs.returnDate.vlaidateForm()
      this.$refs.pickupTime.vlaidateForm()
      this.$refs.returnTime.vlaidateForm()

      if (
        this.$refs.vehicleType.errorMessage ||
        this.$refs.location.errorMessage ||
        this.$refs.pickupDate.errorMessage ||
        this.$refs.returnDate.errorMessage ||
        this.$refs.returnTime.errorMessage ||
        this.$refs.pickupTime.errorMessage
      ) {
        return
      }

      document.querySelector("body").classList.add("modal-open")
      this.isShowBookingFrom = true
    },

    resetBookingForm() {
      Object.assign(this.requestForm, this.requestFormInit)
    },

    hideBookingForm(e) {
      this.isShowBookingFrom = false
      document.querySelector("body").classList.remove("modal-open")

      this.$refs.vehicleType.submitedForm()
      this.$refs.location.submitedForm()
      this.$refs.pickupDate.submitedForm()
      this.$refs.returnDate.submitedForm()
      this.$refs.pickupTime.submitedForm()
      this.$refs.returnTime.submitedForm()
      this.resetBookingForm()

      if (e.status) {
        this.isSubmitedBookingForm = true
        document.querySelector("body").classList.add("modal-open")
        setTimeout(() => {
          this.isSubmitedBookingForm = false
          document.querySelector("body").classList.remove("modal-open")
        }, 3000)
      }
    },
    hideConfirmModal() {
      this.isSubmitedBookingForm = false
    },
  },

  watch: {
    requestForm: {
      handler(form) {
        this.bookingForm.vehicleClass = form.vehicleClass
        this.bookingForm.location = form.location
        this.bookingForm.location = form.location

        this.bookingForm.pickup_date = this.moment(new Date(form.dates.start)).format('YYYY-MM-DD')
        this.bookingForm.return_date = this.moment(new Date(form.dates.end)).format('YYYY-MM-DD')

        this.bookingForm.pickup_time = form.pickupTime
        this.bookingForm.return_time = form.dropTime
      },
      deep: true
    },

    "requestForm.dropDate"(dropDate) {
      if (dropDate === this.requestForm.pickupDate) {
        this.error = "Return date not same with pickup date"
      }
    },
    "$i18n.locale"() {
      this.getVehicleClasses()
      this.getLocations()
    },
    isSubmitedBookingForm(val) {
      if (!val) {
        this.keys.requestFormKey += 1
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-top: 0.6rem;
  max-width: 500px;
  background-color: var(--color-white);
  border-radius: 0.25rem;
  padding: 2rem;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--color-light-grey);
  margin-bottom: 1rem;

  &__field {
    margin-top: 1rem;
  }

  &__action {
    margin-top: 1.5rem;
  }
}

.form-select__inner {
  width: 100%;
  position: relative;
}

.form-select__inner .icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
}

.form__select-box {
  outline: none;
  width: 100%;
  border-radius: 4px;
}

select.form-select.form__select-box {
  border-color: #ccc !important;
  padding: 0.6rem 0.8rem;
  padding-right: 2rem;
}

.form__select-box--icon {
  padding-left: 2.2rem !important;
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
}

label {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #575757;
  margin-left: 0.2rem;
}

.search_location {
  position: absolute;
}

.request_btn {
  padding: 0.5rem;
}

.request_btn:hover {
  background-color: var(--color-primary);
}

.error__message {
  font-size: 0.875rem;
}

.form__label {
  font-weight: 500;
  color: var(--color-dark);
}

@media (max-width: 768px) {
  .date__picker {
    width: 100%;
  }
  .search-box {
    width: 100%;
    padding: 1rem;
    margin-top: 0rem;
  }
}
@media (max-width: 576px) {
  .date__picker {
    width: 100%;
  }
  .search-box {
    width: 100%;
    padding: 1rem;
    margin-top: 0rem;
  }
  .m_margin {
    margin-top: 1rem;
  }
}
</style>
