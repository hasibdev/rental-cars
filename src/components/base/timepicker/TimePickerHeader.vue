<template>
  <div class="tp-sm__header">
    <div v-if="title" class="tp-sm__title">
      <h3 class="title">{{ title }}</h3>
      <button class="tp-sm__title-btn" @click="close">
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
    <div class="tp-sm__placeholder">
      <div class="start__date">
        <p class="label">{{ labelStart }}</p>
        <h5 v-if="dates" class="date">{{ formattedDate(dates.start) }}</h5>
        <h5 v-if="times" class="time">{{ times.start }}</h5>
      </div>
      <div class="end__date">
        <p class="label">{{ labelEnd }}</p>
        <h5 v-if="dates" class="date">{{ formattedDate(dates.end) }}</h5>
        <h5 v-if="times" class="time">{{ times.end }}</h5>
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
    dates: {
      type: Object,
      default: () => null,
    },
    times: {
      type: Object,
      default: () => null,
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
      de,
      en,
      format,
    };
  },
  methods: {
    formattedDate(date) {
      if (date) {
        return this.format(new Date(date), this.formatted, {
          locale: this.$i18n.locale === "de" ? this.de : this.en,
        });
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.tp-sm {
  &__header {
    // display: none;
    @media (max-width: 576px) {
      display: block;
    }
  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      justify-content: space-between;
    }

    .title {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 0;
    }

    &-btn {
      outline: none;
      border: none;
      background-color: transparent;
      display: none;

      @media (max-width: 768px) {
        display: block;
      }
    }
  }

  &__placeholder {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    display: none;

    @media (max-width: 768px) {
      border-bottom: 1px solid #eee;
      display: flex;
    }

    .label {
      font-size: 0.95rem;
      font-weight: 500;
      color: #808080;
      margin-bottom: 10px;
    }

    .date,
    .time {
      font-weight: 500;
      text-align: left;
      text-transform: capitalize;

      &.selected {
        color: var(--color-primary);
      }
    }
    .date {
      font-size: 0.95rem;
    }
    .time {
      font-size: 1rem;
    }
  }
}
</style>
