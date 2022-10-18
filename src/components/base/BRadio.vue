<template>
  <div>
    <p v-if="title" class="title">{{ title }}</p>
    <div :class="{ inline: inline }" :style="cssVars" class="b-radio">
      <label v-for="(option, idx) in options" :key="idx" class="b-radio__control">
        <input type="radio" :name="option.name" v-model="pick" class="form-check-input mt-0" :value="option.label" />
        {{ option.label }}
      </label>
    </div>
    <p v-if="hasError" class="text-danger text-13 mt-1 mb-0">{{ errorMsg }}</p>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useValidationStore } from '@/stores/validation'
export default {
  props: {
    modelValue: {
      type: [Boolean, Number, String],
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    errorField: { type: String },
    color: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      pick: ''
    }
  },
  computed: {
    cssVars() {
      return this.color ? { "--color-primary": this.color } : ""
    },
    ...mapState(useValidationStore, ['errors']),
    hasError() {
      return this.errorField && this.errors[this.errorField]
    },
    errorMsg() {
      return this.errors[this.errorField] && this.errors[this.errorField][0]
    }
  },
  mounted() {
    if (this.modelValue) {
      this.pick = this.modelValue
    }
  },
  watch: {
    pick(val) {
      this.$emit('update:modelValue', val)
      delete this.errors[this.errorField]
    },
    modelValue(val) {
      this.pick = val
    }
  },
};
</script>

<style scoped>
.title {
  margin-bottom: 0.65rem;
}

.b-radio.inline {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* margin-bottom: 1rem; */
}

.b-radio.inline .b-radio__control:not(:last-child) {
  margin-right: 1rem;
  margin-bottom: 0;
}

.b-radio__control {
  font-family: var(--font-primary);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.1;
  display: grid;
  grid-template-columns: 1em auto;
  gap: 0.5em;
  display: inline-flex;
  align-items: center;
}

.b-radio__control:not(:last-child) {
  margin-bottom: 1rem;
}

.b-radio__control:focus-within {
  color: var(--color-primary);
}

/* input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: var(--color-white);
  margin: 0;
  font: inherit;
  color: var(--color-text);
  width: 1.15em;
  height: 1.15em;
  border: 2px solid var(--color-text);
  border-radius: 50%;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
} */

/* input[type="radio"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--color-primary);
} */

/* input[type="radio"]:checked::before {
  transform: scale(1);
}

input[type="radio"]:checked {
  border-color: var(--color-primary);
} */
</style>
