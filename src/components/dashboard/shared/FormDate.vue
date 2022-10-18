<template>
  <div class="d-form-input row mb-3" :class="{'variant-grey': variant == 'grey'}">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <label for="" :class="{ 'd-form-input__label--hide': hideLabel }" class="d-form-input__label">{{ label }}</label>
    </div>

    <div :class="`${(label && !stack) ? 'col-md-8' : 'col-md-12'}`">
      <Datepicker class="add__customer" :class="{ 'error': error || hasError }" v-model="value" :max-Date="maxDate" :placeholder="placeholder ? placeholder : 'MM.DD.YYYY'" :locale="$i18n.locale" format="MM.dd.yyyy" previewFormat="MM.dd.yyyy" :use-utc="true" cancelText="Cancel" selectText="Select"   />

      <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
  import Datepicker from "@vuepic/vue-datepicker"
  import '@vuepic/vue-datepicker/dist/main.css'
  import { mapState } from 'pinia'
  import { useValidationStore } from '@/stores/validation'
  export default {
    emits: ['update:modelValue'],
    components: {
      Datepicker,
    },
    props: {
      modelValue: {
        type: [String, Number],
        default: "",
      },
      max: {
        type: [String, Number, Date],
        default: "",
      },
      label: {
        type: String,
        default: null,
      },
      placeholder: {
        type: String,
        default: null,
      },
      hideLabel: {
        type: Boolean,
        default: false,
      },
      error: {
        type: Boolean,
        default: false,
      },
      errorField: { type: String },
      stack: { type: Boolean, default: false },
      variant: {
        type: String,
        default: 'default',
        validator(value) {
          // The value must match one of these strings
          return ['default', 'grey'].includes(value)
        }
      }
    },
    data() {
      return {
        value: this.modelValue,
        maxDate: this.max, 
      }
    },
    computed: {
      ...mapState(useValidationStore, ['errors']),
      hasError() {
        return this.errorField && this.errors[this.errorField]
      },
      errorMsg() {
        return this.errors[this.errorField] && this.errors[this.errorField][0]
      }
    },
    watch: {
      value() {
        const date = new Date(this.value).toISOString()
        this.$emit("update:modelValue", date)
        delete this.errors[this.errorField]
      },
    },
  };
</script>

<style lang="scss" scoped>
.d-form-input {
  // display: flex;
  align-items: center;
  // width: 100%;

  &__label {
    // width: 40%;
    // margin-bottom: 1rem;
    font-weight: 500;

    &--hide {
      visibility: hidden;
    }
  }
}
</style>

<style lang="scss">
.d-form-input {
  &.variant-grey {
    .dp__input_wrap {
      .dp__input {
        background-color: var(--color-light-grey) !important;
        border-color: var(--color-light-grey) !important;

        &::placeholder {
          font-weight: 500 !important;
          color: var(--color-text) !important;
          opacity: 0.8;
        }

        &:-ms-input-placeholder {
          font-weight: 500 !important;
          color: var(--color-text) !important;
          opacity: 0.8;
        }

        &::-ms-input-placeholder {
          font-weight: 500 !important;
          color: var(--color-text) !important;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
