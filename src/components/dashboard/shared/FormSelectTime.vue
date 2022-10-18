<template>
  <div class="d-form-input row mb-3">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-xl-4'">
      <div class="d-form-input__label" :class="{ 'd-form-input__label--hide': hideLabel }">
        <div class="d-form-input-label">
          <p class="d-form-input-label__text">{{ label }}</p>
          <span v-if="hints" class="d-form-input-label__hint">{{ hints }}</span>
        </div>
      </div>
    </div>

    <div :class="`${(label && !stack) ? 'col-xl-8' : 'col-md-12'}`" style="position: relative">
      <b-select class="d-form-input__field" :variant="variant" :options="options" v-model="value" :disabled="disabled" :placeholder="placeholder ? placeholder : ''" :display-property="displayProperty" :value-property="valueProperty" required outline :no-border="noBorder" :error="error || getError || hasError" />
      <!-- <span class="clock-icon">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22.6914C17.5228 22.6914 22 18.2143 22 12.6914C22 7.16856 17.5228 2.69141 12 2.69141C6.47715 2.69141 2 7.16856 2 12.6914C2 18.2143 6.47715 22.6914 12 22.6914Z"
            stroke="#276EF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6.69141V12.6914L16 14.6914" stroke="#276EF1" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </span> -->
      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>

    <slot name="append" />
  </div>

</template>

<script>
import BSelect from "@/components/base/BSelectTime.vue"
// import IconClock from "@/icons/IconClock.vue"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  emits: ['update:modelValue', 'search'],
  components: {
    BSelect,
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    hints: {
      type: String,
      default: null,
    },
    errorField: { type: String },
    stack: { type: Boolean, default: false },
    placeholder: {
      type: String,
      default: null,
    },
    displayProperty: {
      type: String,
      default: "title",
    },
    valueProperty: {
      type: String,
      default: "value",
    },
    searchPlaceholder: {
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
    frontError: {
      type: Object,
      default: () => { }
    },
    disabled: {
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
    noBorder: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'default',
    }
  },
  data() {
    return {
      value: this.modelValue,
    }
  },
  computed: {
    ...mapState(useValidationStore, ['errors']),
    hasError() {
      return this.errorField && this.errors[this.errorField]
    },
    errorMsg() {
      return this.errors[this.errorField] && this.errors[this.errorField][0]
    },
    getError() {
      if (this.frontError?.$errors?.length) {
        const find = this.frontError?.$errors?.find(err => err.$property == this.errorField)
        if (find) {
          return find.$message
        }
      }
      return ''
    }
  },
  watch: {
    modelValue() {
      this.value = this.modelValue
    },
    value() {
      this.$emit("update:modelValue", this.value)
      delete this.errors[this.errorField]
    },
  },
  methods: {
    searchHendlar(e) {
      this.$emit("search", e)
    },
  },
}
</script>

<style lang="scss" scoped>
.d-form-input {
  // display: flex;
  align-items: center;
  // width: 100%;

  .d-form-input-label {
    // padding-right: 10px;
    &__text {
      margin-bottom: 0;
      font-weight: 400;
      color: #666666;
    }

    &__hint {
      font-size: 15px;
    }
  }

  &__label {
    // margin-bottom: 1rem;
    &--hide {
      opacity: 0;
    }
  }

  // .clock-icon{
  //   position: absolute;
  //   right: 1.125rem;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   pointer-events: none;

  //   // top: 0.65rem;
  //   // right: 0;
  //   // width: 100%;
  //   // height: 100%;
  //   // text-align: end;
  //   // margin-right: 1.25rem;
  // }
  // .b-select{
  //   span.icon{
  //     display: none !important;
  //     opacity: 0 !important;
  //     svg{
  //       opacity: 0 !important;
  //     }
  //   }
  // }
}
</style>
