<template>
  <div class="b-input">
    <label v-if="label" class="b-input__label">{{ label }}</label>
    <div :class="{ iconInput__inner: icon }">
      <span v-if="icon" class="icon">
        <slot />
      </span>
      <input ref="childRef" :type="type" :value="modelValue" :class="{ error: errorMessage || error, outline: outline }" v-bind="$attrs" @input="handleChange($event.target.value)" />
    </div>

    <p v-if="hints && errorMessage" class="b-input__error">
      {{ errorMessage }}
    </p>

    <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'

const TYPES = [
  "text",
  "password",
  "email",
  "number",
  "url",
  "tel",
  "search",
  "color",
]
 
const includes = (types) => (type) => types.includes(type)
export default {
  name: "BInput",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
      validator(value) {
        const isValid = includes(TYPES)(value)
        if (!isValid) {
          console.warn(`allowed types are ${TYPES}`)
        }
        return isValid
      },
    },
    min: {
      type: String,
      default: null,
    },
    max: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    hints: {
      type: Boolean,
      default: false,
    },
    errorField: { type: String },
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
  },
  data() {
    return {
      validate: false,
    }
  },
  computed: {
    ...mapState(useValidationStore, ['errors']),
    hasError() {
      return this.errorField && this.errors[this.errorField]
    },
    errorMsg() {
      return this.errors[this.errorField] ? this.errors[this.errorField][0] : ''
    },
    errorMessage() {
      if (!this.validate) {
        return ""
      }

      if (this.required && !this.modelValue) {
        return "This field is required"
      }

      if (this.min && this.modelValue.length < this.min) {
        return `This field must be at least ${this.min} characters`
      }

      if (this.max && this.modelValue.length > this.max) {
        return `This field must less then ${this.max} characters`
      }

      return ""
    },
  },
  methods: {
    handleChange(ev) {
      this.$emit("update:modelValue", ev)
      this.validate = true

      delete this.errors[this.errorField]
    },

    vlaidateForm() {
      this.validate = true
    },

    resetForm() {
      this.validate = false
    },

    focus() {
      this.$refs.childRef.focus()
    },
  },
};
</script>

<style scoped>
.b-input {
  width: 100%;
  /* margin-bottom: 1rem; */
}

.b-input__label {
  margin-bottom: 0.6rem;
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
}

.iconInput__inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--color-light-grey);
  padding-left: 10px;
  border-radius: 4px;
}

.b-input input {
  width: 100%;
  padding: 0.4rem 0.75rem;
  border: none;
  background-color: var(--color-light-grey);
  height: 45px;
  border-radius: 4px;
  color: var(--color-text);
  outline: 0;
  font-family: var(--font-primary);
  border: 1px solid transparent;
  font-weight: 500;
  transition: all 0.2s ease;
}

.b-input input:disabled {
  opacity: 0.8;
  background-color: var(--color-light-grey) !important;
}

.b-input input::placeholder {
  color: var(--color-text);
  font-weight: 500;
  font-size: 1rem;
  opacity: 0.8;
}

.b-input input:focus {
  border-color: transparent;
}
.b-input input:focus::placeholder {
  color: transparent !important;
}
.b-input input.outline {
  border-color: var(--color-light-grey-2);
  background-color: var(--color-white);
  font-weight: 400;
}

.b-input input.outline::placeholder {
  font-weight: 400;
}

.b-input input.outline:focus {
  border-color: var(--color-light-grey-2);
}
/* errors */
.b-input__error {
  color: var(--color-error);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.b-input input.error {
  border-color: var(--color-error);
  caret-color: var(--color-error);
  /* background-color: rgba(255, 82, 82, 0.18); */
}

.error::placeholder {
  color: var(--color-error);
}
</style>
