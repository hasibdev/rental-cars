<template>
  <div class="base__modal">
    <div class="base__modal-body">
      <div class="base__modal-contents">
        <!-- modal header -->
        <div class="booking-modal__header">
          <h3 class="booking-modal__title">
            {{ $t("home-booking-request-form.title") }} 
          </h3>
          <button class="booking-modal__close-btn base-btn" @click="CloseModal">
            <span class="icon">
              <IconClose />
            </span>
          </button>
        </div>

        <div class="summary">
          <h3 class="booking-modal__sub-title">
            {{ $t("home-booking-request-form.summary") }}
          </h3>
          <div class="row">
            <div class="col-md-6">
              <div class="summary__item">
                <div class="summary__item-icon">
                  <IconLocation />
                </div>
                <div class="summary__item-content">
                  <h5 class="summary__item-title">
                    {{ $t("home-booking-request-form.pickup-location") }}
                  </h5>
                  <p class="summary__item-content">
                    {{ locations.find(loc => loc.id == requestInfo.location).location_name }}
                  </p>
                </div>
              </div>
              <div class="summary__item">
                <div class="summary__item-icon">
                  <IconCalendar />
                </div>
                <div class="summary__item-content">
                  <h5 class="summary__item-title">
                    {{ $t("home-booking-request-form.pickup-time") }}
                  </h5>
                  <p class="summary__item-content">
                    {{
                      `${formattedDate(requestInfo.dates.start)} ${$t('home-booking-request-form.at')} ${
                        requestInfo.pickupTime
                      }`
                    }}
                  </p>
                </div>
              </div>
              <div class="summary__item">
                <div class="summary__item-icon">
                  <IconCalendar />
                </div>
                <div class="summary__item-content">
                  <h5 class="summary__item-title">
                    {{ $t("home-booking-request-form.return-time") }}
                  </h5>
                  <p class="summary__item-content">
                    {{
                      `${formattedDate(requestInfo.dates.end)} ${$t('home-booking-request-form.at')} ${
                        requestInfo.dropTime
                      }`
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="summary-vehicle">
                <div class="summary-vehicle__content">
                  <h6 class="summary__item-title">
                    {{ $t("home-booking-request-form.vehicle-class") }} 
                  </h6>
                  <p class="summary__item-content">
                    {{ vehicleClasses.find(veh => veh.id == requestInfo.vehicleClass).classname }}
                  </p>
                </div>
                <div class="summary-vehicle__img">
                  <img :src="require(`@/assets/images/${requestInfo.carImage}`)" alt="car Image" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--body part-->
        <div class="booking-form">
          <h3 class="booking-modal__sub-title">
            {{ $t("home-booking-request-form.form-title") }}
          </h3>
          <BookRequestForm :search-data="requestInfo" @submited="CloseModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns"
import de from "date-fns/locale/de"
import en from "date-fns/locale/en-US"
import BookRequestForm from "./BookRequestForm.vue"
import IconClose from "@/icons/IconClose.vue"
import IconCalendar from "@/icons/IconCalendar.vue"
import IconLocation from "@/icons/IconLocation.vue"

export default {
  name: "HomeHeroModalBooking",
  components: { BookRequestForm, IconClose, IconCalendar, IconLocation },
  props: {
    requestInfo: {
      type: Object,
      required: true,
    },
    locations: {
      type: Array,
      default: () => []
    },
    vehicleClasses: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      format,
      de,
      en,
    }
  },
  computed: {
    name() {
      return this.data
    },
  },
  methods: {
    formattedDate(date) {
      return date
        ? this.format(new Date(date), "dd MMM yyyy", {
          locale: this.$i18n.locale === "de" ? this.de : this.en,
        })
        : ""
    },
    CloseModal(e) {
      this.$emit("hideModal", e)
    },
  },
}; 
</script>

<style lang="scss" scoped>
.base__modal {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  user-select: none;

  &-body {
    max-width: 668px;
    width: 95%;
    background-color: var(--color-white);
    border-radius: 10px;
    overflow: hidden;
  }

  &-contents {
    padding: 1.7rem;
    max-height: calc(100vh - 5rem);
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }
  }
}

.booking-modal {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__close-btn .icon svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  &__title {
    font-weight: 600;
    font-size: 2rem;
    text-transform: capitalize;
    line-height: 1.1;
    color: var(--color-heading);

    @include responsive-max("sm") {
      font-size: 1.5rem;
    }
  }

  &__sub-title {
    font-weight: 600;
    font-size: 1.3rem;
    color: var(--color-heading);
    text-transform: capitalize;
    margin-bottom: 1.5rem;
  }
}

.summary {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-light-grey);
  padding-bottom: 0.5rem;

  &__item {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }

  &__item-icon {
    margin-right: 1rem;
  }

  &__item-icon svg {
    width: 1.4rem;
    height: 1.4rem;
  }

  &__item-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
    text-transform: capitalize;
    margin-bottom: 0.2rem;
  }

  &-vehicle__img img {
    width: 100%;
    height: auto;
  }
}
</style>
