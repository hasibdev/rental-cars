<template>
  <div class="form-action">
    <button
      v-if="!noBack"
      @click="handler('back')"
      class="base-btn form-action__btn"
      style="min-width: 180px;"
    >
      {{ buttonTextLeft }}
    </button>
    <button
      v-if="midButton"
      @click="handler('middle')"
      class="base-btn form-action__btn form-action__btn--mid"
      style="min-width: 180px;"
    >
      {{ buttonTextMid }}
    </button>
    <button
      @click="handler('next')"
      class="base-btn form-action__btn form-action__btn--action"
      style="min-width: 180px;"
    >
      {{ buttonTextRight }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttonTextRight: {
      type: String,
      default: "Next",
    },
    buttonTextMid: {
      type: String,
      default: "Add Reservation",
    },
    buttonTextLeft: {
      type: String,
      default: "Back",
    },
    noBack: {
      type: Boolean,
      default: false,
    },
    midButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handler(type) {
      this.$emit("submit", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.form-action {
  text-align: end;
  margin: 1rem 0;

  &__btn {
    color: var(--color-dark);
    min-width: 120px;

    &--mid {
      background-color: var(--color-white);
      border: 1px solid var(--color-dark);
    }

    &--action {
      background-color: var(--color-dark);
      color: var(--color-white);
    }
  }
}
</style>
