<template>
  <div class="drp-sm__header">
    <div v-if="title" class="drp-sm__title">
      <h3 class="title">{{ title }}</h3>
      <button class="drp-sm__title-btn" @click="close">
        <span class="icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
    <div class="drp-sm__placeholder">
      <div class="start__date">
        <p class="label">{{ labelStart }}</p>
        <h5 v-if="date" class="value">{{ formattedDate(date.start) }}</h5>
      </div>
      <div class="end__date">
        <p class="label">{{ labelEnd }}</p>
        <h5 v-if="date" class="value">{{ formattedDate(date.end) }}</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import de from "date-fns/locale/de";
import en from "date-fns/locale/en-US";
export default {
  props: {
    date: {
      type: Object,
      default: () => {},
    },
    formatted: {
      type: String,
      default: "dd MMM, yyyy",
    },
    title: {
      type: String,
      default: null,
    },
    labelStart: {
      type: String,
      required: true,
    },
    labelEnd: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      format,
      de,
      en,
    };
  },
  methods: {
    formattedDate(date) {
      return date
        ? this.format(new Date(date), this.formatted, {
            locale: this.$i18n.locale === "de" ? this.de : this.en,
          })
        : "";
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.drp-sm {
  &__header {
    display: none;
    @media (max-width: 576px) {
      display: block;
    }
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;

    .title {
      font-size: 1.3rem;
      font-weight: 500;
      text-transform: capitalize;
      margin-bottom: 0;
    }

    &-btn {
      outline: none;
      border: none;
      background-color: transparent;
    }
  }

  &__placeholder {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    display: none;

    @media (max-width: 576px) {
      display: flex;
    }

    .label {
      font-size: 0.95rem;
      font-weight: 500;
      color: #808080;
      margin-bottom: 4px;
    }

    .value {
      font-size: 1rem;
      font-weight: 500;
      text-transform: capitalize;
    }
  }
}
</style>
