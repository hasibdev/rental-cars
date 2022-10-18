<template>
  <div class="time-picker">
    <label v-if="label" class="time-picker__label">{{ label }}</label>
    <!-- display input -->
    <div :class="{ active: isActive, error: errorMessage, outline: outline }" class="time-picker__placeholder" @click="isActive = !isActive">
      <span v-if="icon" class="pre__icon">
        <slot />
      </span>
      <span class="text">
        {{ display }}
      </span>
      <span class="icon">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z" />
        </svg>
      </span>
    </div>
    <!-- error message -->
    <p v-if="hints && errorMessage" class="time-picker__error">
      {{ errorMessage }}
    </p>
    <!-- dropdown -->
    <div v-if="isActive" class="time-picker__d-container">
      <div class="time-picker__d-inner">
        <div class="time-picker__d-inner-left">
          <ul class="time-picker__hours-info">
            <li v-for="openHour in openHours" :key="openHour" class="open-hour">
              {{ openHour }}
            </li>
          </ul>
        </div>
        <div class="time-picker__d-inner-right">
          <time-picker-header :dates="dates" :times="times" :title="titleSd" :label-start="labelStartSd" :label-end="labelEndSd" @close="hideTimePicker" />
          <ul class="time-picker__d-inner-right-times">
            <li v-if="!required" :value="''" class="none time" @click="selectOption">
              None
            </li>

            <template v-if="optionType === 'string'">
              <li v-for="(option, idx) in options" :key="idx" class="time" :data="option" @click="selectOption">
                <span>
                  {{ option }}
                </span>
              </li>
            </template>

            <template v-else>
              <li v-for="(option, idx) in options" :key="idx" class="time" :data="option[valueProperty]" :class="{
                  selected: option[valueProperty] === $attrs.value,
                  disabled: idx < 3,
                }" @click="selectOption">
                <span>{{ option[displayProperty] }}</span>
              </li>
            </template>
          </ul>
          <!-- sm devices select button -->
          <button class="time-picker__d-sd-btn" @click="hideTimePicker">
            {{ buttonTextSd }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimePickerHeader from "./TimePickerHeader.vue"
export default {
  name: "TimePicker",
  components: { TimePickerHeader },
  props: {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    titleSd: {
      type: String,
      default: "Select Time",
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
      default: "None",
    },
    required: {
      type: Boolean,
      default: false,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
    openHours: {
      type: Array,
      default: () => null,
    },
    dates: {
      type: Object,
      default: () => null,
    },
    times: {
      type: Object,
      default: () => null,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    buttonTextSd: {
      type: String,
      default: "Confirm Date",
    },
    displayProperty: {
      type: String,
      default: "title",
    },
    valueProperty: {
      type: String,
      default: "value",
    },
    hints: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActive: false,
      validate: false,
    }
  },
  computed: {
    optionType() {
      let ot = "string"
      if (this.options.length > 0 && typeof this.options[0] !== "string") {
        ot = "object"
      }
      return ot
    },

    display() {
      if (this.modelValue) {
        if (this.optionType === "string") {
          return this.options.find((e) => e === this.modelValue)
        } else {
          let item = null
          item = this.options.find(
            // eslint-disable-next-line eqeqeq
            (e) => e[this.valueProperty] == this.modelValue
          )
          return item ? item[this.displayProperty] : this.placeholder
        }
      }
      return this.placeholder
    },
    errorMessage() {
      if (!this.validate) {
        return ""
      }

      if (this.required && !this.modelValue) {
        return "This field is required"
      }

      return ""
    },
  },
  mounted() {
    document.addEventListener("click", this.close)
  },

  beforeUnmount() {
    document.removeEventListener("click", this.close)
  },

  methods: {
    selectOption(event) {
      this.validate = true
      let value = event.target.getAttribute("data")

      this.$emit("update:modelValue", value)

      const windowWidth = window.innerWidth

      if (windowWidth > 768) {
        setTimeout(() => {
          this.isActive = false
        }, 100)
      }
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.isActive = false
      }
    },
    vlaidateForm() {
      this.validate = true
    },
    submitedForm() {
      this.validate = false
    },

    hideTimePicker() {
      this.isActive = false
    },
  },
};
</script>

<style lang="scss" scoped>
.time-picker {
  &__label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  &__placeholder {
    border: 1px solid transparent;
    border-radius: 4px;
    outline: none;
    width: 100%;
    padding: 0.4rem 0.75rem;
    font-size: 1rem;
    transition: border-width 0.2s linear;
    font-weight: 500;
    color: var(--color-text);
    height: 45px;
    display: flex;
    background-color: var(--color-light-grey);
    align-items: center;
    position: relative;
    line-height: 1.2;

    &.outline {
      border-color: var(--color-light-grey-2);
      background-color: var(--color-white);
      font-weight: 400;
    }

    .text {
      width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon {
      position: absolute;
      right: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;

      svg {
        fill: inherit;
      }
    }
  }

  &__d-container {
    z-index: 9;
    background-color: #fff;
    border: 1px solid #dddddd;
    padding: 1.2rem;
    width: 500px;
    box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.16);
    border-radius: 5px;
    position: absolute;
    margin-top: 5px;

    @media (max-width: 768px) {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  &__d-header {
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
      color: var(--color-dark);
    }
  }

  &__d-inner {
    display: flex;
    justify-content: stretch;
    overflow: hidden;
    max-height: 250px;

    @media (max-width: 768px) {
      height: 50vh;
      max-height: 65vh;
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100vh;
      background-color: #fff;
      padding: 1.2rem;
      border-radius: 4px 4px 0 0;
    }

    &-left {
      width: 45%;
      border-right: 1px solid #eeeeee;
      display: flex;
      align-items: center;

      @media (max-width: 576px) {
        display: none;
      }
    }

    &-right {
      text-align: center;
      padding: 0;
      width: 55%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      @media (max-width: 576px) {
        width: 100%;
      }

      &-times {
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        height: 85%;
        flex-grow: 1;

        @media (max-width: 768px) {
          height: 55%;
        }

        &::-webkit-scrollbar {
          width: 5px;
        }
        &::-webkit-scrollbar-track {
          background-color: #eeeeee;
          -webkit-border-radius: 2px;
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          -webkit-border-radius: 10px;
          border-radius: 10px;
          background: var(--color-primary);
        }
      }
    }

    .time {
      margin-bottom: 0.5rem;
      cursor: pointer;

      span {
        padding: 5px 12px;
        border-radius: 4px;
        display: inline-block;
        user-select: none;
        pointer-events: none;
      }

      &:hover,
      &.selected {
        span {
          background-color: var(--color-primary);
          color: var(--color-white);
        }
      }
      &.disabled {
        pointer-events: none;
        color: var(--color-grey);
      }
    }

    .none {
      opacity: 0.8;
    }
  }

  &__hours-info {
    .open-hour {
      margin-bottom: 5px;
      color: var(--color-grey);
      font-weight: 400;
      font-size: 1rem;
    }
  }

  &__d-sd-btn {
    outline: 0;
    border: 0;
    background-color: #f23e3d;
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    border-radius: 4px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1rem;
    display: none;
    margin-top: 0.2rem;

    @media (max-width: 768px) {
      display: block;
    }
  }
}

.pre__icon {
  padding-right: 10px;
}

.pre__icon svg {
  fill: inherit;
}

/* errors */
.b-input__error {
  color: var(--color-error);
  margin-bottom: 0;
  font-size: 0.875rem;
}

.time-picker .error {
  border-color: var(--color-error);
  // background-color: rgba(255, 82, 82, 0.18);
}
</style>
