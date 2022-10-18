<template>
  <div class="d-form-input row">
    <div v-if="label" :class="stack ? 'col-md-12 mb-1' : 'col-md-4'">
      <label for="" class="d-form-input__label">{{ label }}</label>
    </div>

    <div :class="`${(label && !stack) ? 'col-md-8' : 'col-md-12'}`">
      <b-radio color="#276EF1" v-model="value" inline :options="options" />

      <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script>
import BRadio from "@/components/base/BRadio.vue"
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  components: {
    BRadio,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      default: null,
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
    modelValue(val) {
      this.value = val
    }
  },
};
</script>

<style lang="scss" scoped>
.d-form-input {
  // display: flex;
  align-items: center;
  width: 100%;

  &__label {
    // width: 29%;
    margin-bottom: 1rem;
    font-weight: 500;
  }
}
</style>
