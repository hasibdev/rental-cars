<template>
  <div class="d-form-input row">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-xl-4'">
      <div class="d-form-input__label" :class="{ 'd-form-input__label--hide': hideLabel }">
        <div class="d-form-input-label">
          <p class="d-form-input-label__text" :class="`${labelClasses}`">{{ label }}</p>
          <span v-if="hints" class="d-form-input-label__hint">{{ hints }}</span>
        </div>
      </div>
    </div>

    <div :class="`${(label && !stack) ? 'col-xl-8' : 'col-md-12'}`">
      <b-select class="d-form-input__field" :disabled="disabled" :searching="searching" :variant="variant" :options="options" v-model="value" :placeholder="placeholder ? placeholder : ''" :display-property="displayProperty" :value-property="valueProperty" required outline :no-border="noBorder" :search="search" :error="error || getError || hasError" :search-placeholder="searchPlaceholder" @search="searchHendlar" />
      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>

    <slot name="append" />
  </div>

</template>

<script>
import BSelect from "@/components/base/BSelect.vue"
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
    disabled: {
      type: Boolean,
      default: false,
    },
    labelClasses: { type: String, default: '' },
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
};
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
    &--hide {
      opacity: 0;
    }
  }
}
.variant-dark {
  border-color: #000 !important;
  background-color: #000 !important;
}
</style>
