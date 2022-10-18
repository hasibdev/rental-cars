<template>
  <div class="b-textarea" :style="[{ height: height + 'px' }]">
    <textarea :class="{
        error: error,
        outline: outline,
        noresize: !resize,
      }" cols="30" rows="6" :placeholder="placeholder" :required="required" @input="$emit('update:modelValue', $event.target.value)"></textarea>
  </div>
</template>

<script>
export default {
  name: "BInput",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: " ",
    },
    required: {
      type: Boolean,
      default: false,
      required: false,
    },
    height: {
      type: Number,
      default: 100,
    },
    resize: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.b-textarea {
  position: relative;
  margin-bottom: 1rem;
}

.b-textarea + .b-textarea {
  margin-top: 1rem;
}

.b-textarea textarea {
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 100%;
  padding: 0.4rem 0.75rem;
  font-size: 1rem;
  transition: border-width 0.2s linear;
  color: var(--color-text);
  /* background-color: var(--color-light-grey); */
  font-family: var(--font-primary);
  height: 100%;
}

.b-textarea textarea::placeholder {
  color: var(--color-text);
  font-weight: 400;
  transition: opacity 0.2s ease-in-out;
}

.b-textarea textarea.outline::placeholder {
  font-weight: 400;
}
.b-textarea textarea.outline {
  border-color: var(--color-light-grey-2);
  background-color: var(--color-white);
  font-weight: 400;
}
.b-textarea textarea.outline:focus {
  border-color: var(--color-light-grey-2);
}

/* errors */
/* .b-input__error {
  color: var(--color-error);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
} */

.b-textarea textarea.error {
  border-color: var(--color-error);
  caret-color: var(--color-error);
  /* background-color: rgba(255, 82, 82, 0.18); */
}

.error::placeholder {
  color: var(--color-error);
}

/*
.b-textarea label {
  pointer-events: none;
  position: absolute;
  top: 10px;
  left: 10px;
  transition: all 0.2s linear, background-color 0.3s cubic-bezier(0.4, 0, 1, 1);
  background-color: var(--color-white);
  padding: 5px;
  box-sizing: border-box;
  color: var(--color-grey);
}

.b-textarea textarea:focus {
  border-color: var(--color-primary);
}

.b-textarea textarea:focus + label {
  color: var(--color-primary);
}



.b-textarea textarea:focus::placeholder {
  opacity: 1;
}

.b-textarea textarea:focus:required:invalid + label {
  color: var(--color-error);
}

.b-textarea textarea:focus:required:invalid {
  border-color: var(--color-error);
  caret-color: var(--color-error);
}

.b-textarea textarea:required:invalid + label::after {
  content: ' *';
}

.b-textarea textarea:focus + label {
  font-size: 13px;
  top: -14px;
}

.b-textarea textarea:focus + label,
.b-textarea textarea:not(:placeholder-shown) + label {
  font-size: 13px;
  top: -13px;
} */

.noresize {
  resize: none;
}
</style>
