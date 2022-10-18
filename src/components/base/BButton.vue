<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :type="nativeType"
    v-bind="$attrs"
  >
    <span class="b-btn__slot"><slot /></span>
  </component>
</template>

<script>
const nativeTypes = ["button", "submit", "reset"];
const availableSizes = [null, "tiny", "small"];
const availableTags = [
  "button",
  "a",
  "input",
  "router-link",
  "nuxt-link",
  "n-link",
  "NuxtLink",
  "NLink",
];
const availableThemes = ["light", "dark", "primary", "secondary"];
export default {
  name: "BaseButton",
  inheritAttrs: false,
  props: {
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    nativeType: {
      type: String,
      default: "button",
      validator: (value) => nativeTypes.includes(value),
    },
    outline: { type: Boolean, default: false },
    size: {
      type: String,
      default: null,
      validator: (value) => availableSizes.includes(value),
    },
    tag: {
      type: String,
      default: "button",
      validator: (value) => availableTags.includes(value),
    },
    text: { type: Boolean, default: false },
    theme: {
      type: String,
      default: "primary",
      validator: (value) => availableThemes.includes(value),
    },
  },
  computed: {
    buttonClasses() {
      return {
        "b-btn": true,
        [`b-btn--${this.theme}`]: this.theme,
        [`b-btn--${this.size}`]: this.size,
        "b-btn--block": this.block,
        "b-btn--disabled": this.disabled,
        "b-btn--loading": this.loading,
        "b-btn--outlined": this.outline,
        "b-btn--text": this.text,
      };
    },
  },
};
</script>
<style>
.b-btn:not(:last-child) {
  margin-right: 1rem;
}
</style>
<style lang="scss" scoped>
.b-btn {
  border: none;
  outline: none;
  width: auto;
  white-space: nowrap;
  background-color: transparent;
  border-radius: 0.25rem;
  font-size: 16px;
  color: var(--color-text);
  font-weight: 500;
  transition: background-color 0.1s ease;
  padding: 0.5rem 1.3rem;
  line-height: 1.2;
  text-transform: capitalize;
  margin-bottom: 0.75rem;
  border: 1px solid transparent;

  &--primary {
    background-color: var(--color-primary);
    color: var(--color-white);

    &:hover {
      background-color: rgba(var(--color-primary), 0.5);
    }

    &.b-btn--outlined {
      color: var(--color-primary);
      background-color: transparent;
      border-color: var(--color-primary);

      &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    }
  }

  &--secondary {
    background-color: var(--color-secondary);
    color: var(--color-white);

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
    }

    &.b-btn--outlined {
      color: var(--color-secondary);
      background-color: transparent;
      border-color: var(--color-secondary);

      &:hover {
        background-color: var(--color-secondary);
        color: var(--color-white);
      }
    }
  }

  &--dark {
    background-color: var(--color-dark);
    color: var(--color-white);

    &.b-btn--outlined {
      color: var(--color-dark);
      background-color: transparent;
      border-color: var(--color-dark);

      &:hover {
        background-color: var(--color-dark);
        color: var(--color-white);
      }
    }
  }

  &--light {
    background-color: var(--color-light-grey);
    color: var(--color-dark);

    &.b-btn--outlined {
      color: var(--color-light-grey);
      background-color: transparent;
      border-color: var(--color-light-grey);

      &:hover {
        background-color: var(--color-light-grey);
      }
    }
  }
  // types
  &--block {
    width: 100%;
  }

  &--disabled {
    pointer-events: none;
    user-select: none;
    opacity: 0.75;
  }

  &--text {
    padding: 5px;
    background-color: transparent;
    border: none;
  }

  // sizes
  &--tiny {
    font-size: 80%;
    padding: 0.225rem;
  }
  &--small {
    font-size: 90%;
    padding: 0.5rem;
  }

  // loading
  &--loading {
    pointer-events: none;
    position: relative;
    .b-btn__slot {
      color: transparent;
      user-select: none;
    }
    &::after {
      animation: spin 0.5s infinite linear;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 1em;
      left: calc(50% - 0.5em);
      position: absolute;
      top: calc(50% - 0.5em);
      width: 1em;
    }
  }
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
