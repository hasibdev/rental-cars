<template>
  <div class="d-form-input row mb-3">

    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-xl-4'">
      <div class="d-form-input__label">
        <div class="d-form-input-label">
          <p class="d-form-input-label__text">{{ label }}</p>
          <span v-if="hints" class="d-form-input-label__hint" style="color: #666666;">{{ hints }}</span>
        </div>
      </div>
    </div>

    <div :class="`${(label && !stack) ? 'col-xl-8' : 'col-md-12'}`">
      <b-input v-model="value" :type="type" class="d-form-input__field" :disabled="disabled" outline :placeholder="placeholder ? placeholder : ''" :error="error || getError || hasError" />
      <p v-if="getError || hasError" class="text-danger text-13 mt-1 mb-0">{{ getError || errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import BInput from "@/components/base/BInput.vue"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  emits: ["update:modelValue"],
  components: {
    BInput,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    hints: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorField: { type: String },
    stack: { type: Boolean, default: false },
    disabled: {
      type: Boolean,
      default: false,
    },
    frontError: {
      type: Object,
      default: () => { }
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
    value() {
      this.$emit("update:modelValue", this.value)
      delete this.errors[this.errorField]
    },
    modelValue() {
      this.value = this.modelValue
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
}
</style>
