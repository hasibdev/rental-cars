<template>
  <div class="b-select">
    <label v-if="label" class="b-select__label">{{ label }}</label>
    <!-- input placeholder -->
    <div :class="{
      active: isActive,
      error: errorMessage || error,
      outline: outline,
      'variant-secondary': variant == 'secondary'
    }" class="b-select__placeholder" :disabled="disabled" @click="openSelect" :style="variant == 'dark' ? 'background: #000000; color: white; ' : '' ">
      <span v-if="icon" class="pre__icon">
        <slot />
      </span>
      <span class="text">
        {{ display }}
      </span>
      <span class="icon">
        <svg v-if="variant == 'dark'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.57564 8.0102C5.80996 7.77589 6.18986 7.77589 6.42417 8.0102L11.5756 13.1617C11.81 13.396 12.1899 13.396 12.4242 13.1617L17.5756 8.0102C17.81 7.77589 18.1899 7.77589 18.4242 8.0102L18.9899 8.57589C19.2242 8.8102 19.2242 9.1901 18.9899 9.42442L12.707 15.7073C12.3165 16.0978 11.6833 16.0978 11.2928 15.7073L5.00996 9.42442C4.77564 9.1901 4.77564 8.8102 5.00996 8.57589L5.57564 8.0102Z" fill="white" />
        </svg>

        <svg v-else width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.41 0L6 4.58L10.59 0L12 1.41L6 7.41L0 1.41L1.41 0Z" />
        </svg>
      </span>
    </div>
    <!-- error hints -->
    <p v-if="hints && errorMessage" class="b-input__error">
      {{ errorMessage }}
    </p>
    <!-- options list inner -->
    <ul v-if="isActive" :class="{ 'b-select__list--border': !noBorder }" class="b-select__list">
      <!-- search box -->
      <div v-if="search" class="b-select__search">
        <input type="text" :placeholder="searchPlaceholder" :disabled="disabled" class="b-select__search-input" @input="searchHendlar" />
        <div class="b-select__search-icon">
          <svg v-if="!searching" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18.9999 18.9999L14.6499 14.6499" stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <!-- Loading -->
          <div v-if="searching" class="d-flex flex-column justify-content-center align-items-center py-3 w-100">
            <div class="spinner-grow spinner-grow-sm text-primary" role="status" aria-hidden="true"></div>
          </div>
        </div>
      </div>

      <p v-if="!searching && !options.length" class="ms-3">No Data</p>

      <!-- default value (when not required) -->
      <li v-if="!required" :value="''" class="none" @click="selectOption">
        None
      </li>

      <!-- start options -->
      <template v-if="optionType === 'string'">
        <li v-for="(option, idx) in options" :key="idx" :data="option" :class="(option == modelValue) ? 'selected' : ''" @click="selectOption">
          <!-- <li v-for="(option, idx) in options" :key="idx" :data="option" :class="{ selected: option === modelValue }" @click="selectOption"> -->
          {{ option }}
        </li>
      </template>

      <template v-else>
        <li v-for="(option, idx) in options" :key="idx" :data="option[valueProperty]" :class="(option[valueProperty] == modelValue) ? 'selected' : '' " @click="selectOption">
          {{ option[displayProperty] }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
// TODO: debounch search
// import _ from 'lodash'
export default {
  name: "BSelect",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
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
    label: {
      type: String,
      required: false,
      default: "",
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
    disabled: {
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
    error: {
      type: Boolean,
      default: false,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    searching: {
      type: Boolean,
      default: false,
    },
    searchPlaceholder: {
      type: String,
      default: "Search",
    },
    variant: {
      type: String,
      default: 'default',
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

      setTimeout(() => {
        this.isActive = false
      }, 100)
    },
    openSelect() {
      if (!this.disabled) {
        this.isActive = !this.isActive
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
    searchHendlar(e) {
      const value = e.target.value
      this.$emit("search", value)
    },
  },
}
</script>

<style lang="scss" scoped>
.b-select {
  position: relative;
  /* margin-bottom: 1rem; */
  width: 100%;
}

.b-select__label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* list style */
.b-select__list {
  background-color: var(--color-white);
  margin-top: 5px;
  border-radius: 5px;
  padding: 0;
  position: absolute;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999999;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 300px;
  scrollbar-width: thin;
}

.b-select__list--border {
  // border: 1px solid var(--color-grey);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
}

.b-select__list::-webkit-scrollbar {
  width: 5px;
}

.b-select__list::-webkit-scrollbar-track {
  background-color: #fff;
  -webkit-border-radius: 2px;
  border-radius: 2px;
}

.b-select__list::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: #dadce0;
}

.b-select__list li {
  padding: 0.8rem 0.9rem;
  cursor: pointer;
}

.b-select__list li.selected,
.b-select__list li:hover {
  // background-color: var(--color-light-grey);
  background-color: #000000;
  color: #ffffff;
}

.none {
  opacity: 0.8;
}

/* input */
.b-select .b-select__placeholder {
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
  opacity: 0.9;
}

.b-select__placeholder .text {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.b-select__placeholder .icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.icon svg {
  fill: inherit;
}

.b-select__placeholder.outline {
  border-color: var(--color-light-grey-2);
  background-color: var(--color-white);
  font-weight: 400;
}

.variant-secondary {
  border-color: #276ef1 !important;
  background-color: #276ef1 !important;

  .text {
    color: #fff !important;
  }

  .icon {
    svg {
      fill: #fff;
    }
  }
}

.pre__icon {
  padding-right: 10px;
}

.pre__icon svg {
  fill: inherit;
}

/* search input */
.b-select__search {
  width: 100%;
  padding: 0.75rem 0.875rem;
  display: flex;
  align-items: center;
  justify-content: stretch;
}

.b-select__search-input {
  width: 100%;
  outline: none;
  border: none;
  background-color: #f2f2f2;
  padding: 0.65rem 0.875rem;
  border-radius: 4px 0 0 4px;
}

.b-select__search-icon {
  --size: 45px;
  background-color: #f2f2f2;
  height: var(--size);
  width: var(--size);
  display: flex;
  align-items: center;
  border-left: 1px solid #dddddd;
  justify-content: center;
  border-radius: 0 4px 4px 0;
}

/* errors */
.b-input__error {
  color: var(--color-error);
  margin-bottom: 0;
  font-size: 0.875rem;
}

.b-select .error {
  border-color: var(--color-error);
  /* background-color: rgba(255, 82, 82, 0.18); */
}

.b-select input:disabled {
  opacity: 0.8;
  background-color: var(--color-light-grey) !important;
}
</style>
