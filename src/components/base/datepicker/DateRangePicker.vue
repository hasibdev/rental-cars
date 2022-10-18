<template>
  <div class="drp" :class="isCalendarActive ? 'active' : ''">
    <div class="drp-container">
      <div class="drp__input" :class="{ error: errorMessage }" @click="showCalendar">
        <label for="drp" class="drp__input-icon">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9H4V11H6V9ZM10 9H8V11H10V9ZM14 9H12V11H14V9ZM16 2H15V0H13V2H5V0H3V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 18C0 19.1 0.89 20 2 20H16C17.1 20 18 19.1 18 18V4C18 2.9 17.1 2 16 2ZM16 18H2V7H16V18Z" />
          </svg>
        </label>
        <input id="drp" class="drp__input-control" type="text" readonly :value="
            showEndDate
              ? showFormattedDate(dateObj.end)
              : showFormattedDate(dateObj.start)
          " :placeholder="placeholder" />
      </div>
      <!-- error message -->
      <p v-if="hints && errorMessage" class="error-hints">
        {{ errorMessage }}
      </p>
      <div v-show="isCalendarActive" class="drp__calendars" @click.self="hideCalendar">
        <Calender v-model="dateObj" :formatted="formatted" :sd-title="sdTitle" :label-start-sd="labelStartSd" :label-end-sd="labelEndSd" :button-text-sd="buttonTextSd" @close="closeEvent" />
      </div>
    </div>
  </div>
</template>

<script>
import Calender from "./Calendar.vue"
import { format } from "date-fns"
import de from "date-fns/locale/de"
import en from "date-fns/locale/en-US"
export default {
  name: "DateRangePicker",
  components: {
    Calender,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ start: "", end: "" }),
    },
    formatted: {
      type: String,
      default: "dd MMM, yyyy",
    },
    sdTitle: {
      type: String,
      default: null,
    },
    buttonTextSd: {
      type: String,
      default: "Confirm Date",
    },
    labelStartSd: {
      type: String,
      default: "Start Date",
    },
    labelEndSd: {
      type: String,
      default: "End Date",
    },
    placeholder: {
      type: String,
      default: null,
    },
    showEndDate: {
      type: Boolean,
      default: false,
    },
    // validations
    required: {
      type: Boolean,
      default: false,
      required: false,
    },
    hints: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      de,
      en,
      format,
      dateObj: {
        start: "",
        end: "",
      },
      isCalendarActive: false,
      validate: false,
    }
  },
  watch: {
    "modelValue.start": {
      handler(after) {
        this.dateObj.start = after
      },
      deep: true,
    },
    "modelValue.end": {
      handler(after) {
        this.dateObj.end = after
      },
      deep: true,
    },
  },
  computed: {
    errorMessage() {
      if (!this.validate) {
        return ""
      }

      if (this.required && !this.modelValue.start && !this.modelValue.end) {
        return "This field is required"
      }

      return ""
    },
  },
  mounted() {
    document.addEventListener("click", this.close)
    Object.assign(this.dateObj, this.modelValue)
  },

  beforeUnmount() {
    document.removeEventListener("click", this.close)
  },
  methods: {
    showFormattedDate(dateLocal) {
      return dateLocal
        ? this.format(new Date(dateLocal), this.formatted, {
          locale: this.$i18n.locale === "de" ? this.de : this.en,
        })
        : ""
    },
    showCalendar() {
      this.isCalendarActive = true
      document.querySelector("body").classList.add("drp-sm-active")
    },
    hideCalendar() {
      this.isCalendarActive = false
      document.querySelector("body").classList.remove("drp-sm-active")
      this.handleChange()
    },

    closeEvent(isCloseForce) {
      const windowWidth = window.innerWidth

      if (isCloseForce) {
        this.hideCalendar()
      }
      if (windowWidth > 768) {
        this.hideCalendar()
      }
    },

    close(e) {
      if (!this.$el.contains(e.target)) {
        this.isCalendarActive = false
        if (this.isCalendarActive) {
          document.querySelector("body").classList.remove("drp-sm-active")
        }
      }
    },
    // emit data
    handleChange() {
      this.$emit("update:modelValue", this.dateObj)
    },

    vlaidateForm() {
      this.validate = true
    },
    submitedForm() {
      this.validate = false
    },
  },
};
</script>

<style lang="scss" scoped>
.drp {
  &-container {
    position: relative;
  }

  &__input {
    border: 1px solid #ddd;
    height: 45px;
    padding: 0;
    margin-bottom: 1rem;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    align-items: center;

    /* errors */
    .error-hints {
      color: var(--color-error);
      margin-bottom: 0;
      font-size: 0.875rem;
    }

    &.error {
      border-color: var(--color-error);
      // background-color: rgba(255, 82, 82, 0.18);
    }

    &-control {
      height: 100%;
      outline: none;
      width: 100%;
      color: inherit;
      border: none;
      background-color: transparent;
      padding: 5px 10px;
      user-select: none;
      cursor: pointer;

      &::placeholder {
        color: inherit;
      }
    }

    &-icon svg {
      fill: inherit;
      margin-left: 10px;
    }
  }

  &__calendars {
    z-index: 99;
    position: absolute;
    @media (max-width: 768px) {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-end;
    }
  }
}
</style>

<style>
@media (max-width: 768px) {
  .drp-sm-active {
    overflow: hidden !important;
  }
}
</style>
