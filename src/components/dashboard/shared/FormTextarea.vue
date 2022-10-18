<template>
  <div class="d-form-input row mb-3">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-xl-4'" style="font-weight: 400">
      <div class="d-form-input__label">
        <div class="d-form-input-label">
          <p class="d-form-input-label__text">{{ label }}</p>
          <span v-if="hints" class="d-form-input-label__hint">{{ hints }}</span>
        </div>
      </div>
    </div>

    <div :class="`${(label && !stack) ? 'col-xl-8' : 'col-md-12'}`">
      <b-textarea rows="3" v-model="value" class="d-form-input__field" outline :placeholder="placeholder ? placeholder : ''" :error="error || hasError" />
      <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import BTextarea from "@/components/base/BTextarea.vue"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  emits: ['update:modelValue'],
  components: {
    BTextarea,
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
    }
  },
  watch: {
    value() {
      this.$emit("update:modelValue", this.value)
      delete this.errors[this.errorField]
    },
  },
};
</script>

<style lang="scss" scoped>
.d-form-input {
  // display: flex;

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
  .d-form-input {
    &__field {
      width: 100%;
    }
  }

  &__label {
    // width: 40%;
    // margin-bottom: 1rem;
    font-weight: 400 !important;
  }
}
</style>
