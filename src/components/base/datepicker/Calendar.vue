<template>
  <div class="date-range-picker">
    <div class="drp-calendar">
      <!-- small device placeholder -->
      <MobilePlaceholder
        :formatted="formatted"
        :date="{ start: startDate, end: endDate }"
        :title="sdTitle"
        :label-start="labelStartSd"
        :label-end="labelEndSd"
        @close="forceToClose"
      />
      <!-- calendar header -->
      <div class="drp-calendar__header">
        <button class="drp-calendar__nav" @click="prevMonth">
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.9898 1.57589C8.22411 1.8102 8.22411 2.1901 7.9898 2.42441L2.83833 7.57589C2.60401 7.8102 2.60401 8.1901 2.83833 8.42441L7.9898 13.5759C8.22411 13.8102 8.22411 14.1901 7.9898 14.4244L7.42411 14.9901C7.1898 15.2244 6.8099 15.2244 6.57558 14.9901L0.292742 8.70726C-0.0977825 8.31673 -0.0977824 7.68357 0.292742 7.29304L6.57558 1.0102C6.8099 0.775887 7.1898 0.775887 7.42411 1.0102L7.9898 1.57589Z"
              fill="#666666"
            />
          </svg>
        </button>
        <h2 class="drp-calendar__title">
          {{ getCurrentMonth(currentYear, currentMonth) }}
          {{ currentYear }}
        </h2>
        <button class="drp-calendar__nav" @click="nextMonth">
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.01008 14.4241C0.775765 14.1898 0.775765 13.8099 1.01008 13.5756L6.16155 8.42411C6.39587 8.1898 6.39587 7.8099 6.16155 7.57558L1.01008 2.42411C0.775764 2.1898 0.775764 1.8099 1.01008 1.57559L1.57576 1.0099C1.81008 0.775585 2.18998 0.775586 2.42429 1.0099L8.70713 7.29274C9.09766 7.68327 9.09766 8.31643 8.70713 8.70696L2.42429 14.9898C2.18998 15.2241 1.81008 15.2241 1.57576 14.9898L1.01008 14.4241Z"
              fill="#666666"
            />
          </svg>
        </button>
      </div>
      <div class="drp-calendar__inner">
        <!-- days -->
        <ul class="drp-calendar__day">
          <li
            v-for="(day, index) in days"
            :key="index"
            class="drp-calendar__day-item"
          >
            {{ $t(`date-format.days.${day}`) }}
          </li>
        </ul>

        <!-- dates -->
        <ul class="drp-calendar__dates">
          <li
            v-for="date in getFirstDayOfMonth(currentYear, currentMonth)"
            :key="`oldDate_${date}`"
            class="disabled date"
          ></li>
          <li
            v-for="date in getDaysInMonth(currentYear, currentMonth)"
            :key="`currentDate__${date}`"
            class="date"
            :class="dayClass(date)"
            @click="clickDate(date)"
            @mouseover="hoverDate(date)"
          >
            {{ date.getDate() }}
          </li>
        </ul>
      </div>
      <!-- sm devices select button -->
      <button class="drp-sm__set-date-btn" @click="confirmDate">
        {{ buttonTextSd }}
      </button>
    </div>
    <!-- next month calendar -->
    <div class="drp-calendar">
      <div class="drp-calendar__header">
        <button class="drp-calendar__nav" @click="prevMonth">
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.9898 1.57589C8.22411 1.8102 8.22411 2.1901 7.9898 2.42441L2.83833 7.57589C2.60401 7.8102 2.60401 8.1901 2.83833 8.42441L7.9898 13.5759C8.22411 13.8102 8.22411 14.1901 7.9898 14.4244L7.42411 14.9901C7.1898 15.2244 6.8099 15.2244 6.57558 14.9901L0.292742 8.70726C-0.0977825 8.31673 -0.0977824 7.68357 0.292742 7.29304L6.57558 1.0102C6.8099 0.775887 7.1898 0.775887 7.42411 1.0102L7.9898 1.57589Z"
              fill="#666666"
            />
          </svg>
        </button>
        <h2 class="drp-calendar__title">
          {{ getCurrentMonth(currentYear, currentMonth + 1) }}

          {{ currentMonth === 11 ? currentYear + 1 : currentYear }}
        </h2>
        <button class="drp-calendar__nav" @click="nextMonth">
          <svg
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.01008 14.4241C0.775765 14.1898 0.775765 13.8099 1.01008 13.5756L6.16155 8.42411C6.39587 8.1898 6.39587 7.8099 6.16155 7.57558L1.01008 2.42411C0.775764 2.1898 0.775764 1.8099 1.01008 1.57559L1.57576 1.0099C1.81008 0.775585 2.18998 0.775586 2.42429 1.0099L8.70713 7.29274C9.09766 7.68327 9.09766 8.31643 8.70713 8.70696L2.42429 14.9898C2.18998 15.2241 1.81008 15.2241 1.57576 14.9898L1.01008 14.4241Z"
              fill="#666666"
            />
          </svg>
        </button>
      </div>
      <div class="drp-calendar__inner">
        <!-- days -->
        <ul class="drp-calendar__day">
          <li
            v-for="(day, index) in days"
            :key="index"
            class="drp-calendar__day-item"
          >
            {{ $t(`date-format.days.${day}`) }}
          </li>
        </ul>

        <!-- dates -->
        <ul class="drp-calendar__dates">
          <li
            v-for="date in getFirstDayOfMonth(currentYear, currentMonth + 1)"
            :key="`oldDate_${date}`"
            class="disabled date"
          ></li>
          <li
            v-for="date in getDaysInMonth(currentYear, currentMonth + 1)"
            :key="`currentDate__${date}`"
            class="date"
            :data="date.toISOString().substring(0, 10)"
            :class="dayClass(date)"
            @click="clickDate(date)"
            @mouseover="hoverDate(date)"
          >
            {{ date.getDate() }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MobilePlaceholder from "./MobilePlaceholder.vue";

export default {
  name: "Calendar",
  components: {
    MobilePlaceholder,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ start: "", end: "" }),
    },
    sdTitle: {
      type: String,
      default: null,
    },
    buttonTextSd: {
      type: String,
      required: true,
    },
    labelStartSd: {
      type: String,
      required: true,
    },
    labelEndSd: {
      type: String,
      required: true,
    },
    formatted: {
      type: String,
      default: "dd MMM, yyyy",
    },
  },
  data() {
    return {
      days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      startDate: null,
      endDate: null,
      selectedAsStartDate: false,
    };
  },
  watch: {
    "modelValue.start": {
      handler(after) {
        this.startDate = after;
      },
      deep: true,
    },
    "modelValue.end": {
      handler(after) {
        this.endDate = after;
      },
      deep: true,
    },
  },
  mounted() {
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.startDate = this.modelValue.start;
    this.endDate = this.modelValue.end;
  },

  methods: {
    getDaysInMonth(year, month) {
      const date = new Date(year, month, 1);
      const days = [];
      if (month > 11) {
        while (date.getMonth() === 0) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
      } else {
        while (date.getMonth() === month) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
      }

      return days;
    },
    dayClass(date) {
      let classes = {};
      const dt = new Date(date);
      const today = new Date();

      if (this.startDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);

        dt.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const dtMinCompare = new Date(dt);
        dtMinCompare.setHours(23, 59, 59, 999);

        classes = {
          hover: dt >= start && dt <= end,
          disabled: dt.getTime() <= today.getTime(),
          "active-start": dt.getTime() === start.getTime(),
          "active-end": dt.getTime() === end.getTime(),
        };
      } else {
        classes = {
          disabled: dt.getTime() <= today.getTime(),
        };
      }
      return classes;
    },
    getFirstDayOfMonth(year, month) {
      return new Date(year, month, 1).getDay();
    },
    getLastDayOfMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    },
    getCurrentMonth(year, month) {
      return new Date(year, month).toLocaleString(this.$i18n.locale, {
        month: "long",
      });
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentYear--;
        this.currentMonth = 11;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentYear++;
        this.currentMonth = 0;
      } else {
        this.currentMonth++;
      }
    },
    clickDate(date) {
      const start = this.startDate
        ? new Date(this.startDate).setHours(0, 0, 0, 0)
        : false;
      const newDate = new Date(date).setHours(0, 0, 0, 0);

      // this.startDate = date
      if (this.selectedAsStartDate) {
        if (start && start > newDate) {
          this.startDate = date;
          this.selectedAsStartDate = true;
        } else {
          this.endDate = date;
          this.selectedAsStartDate = false;
          this.confirmDate();
        }
      } else {
        this.startDate = date;
        this.selectedAsStartDate = true;
      }
    },
    hoverDate(date) {
      if (this.selectedAsStartDate) {
        this.endDate = date;
        this.handleChange();
      }
    },
    // emit data
    handleChange() {
      const dateObj = {
        start: this.startDate,
        end: this.endDate,
      };
      this.$emit("update:modelValue", dateObj);
    },

    confirmDate(isCloseForce = false) {
      if (isCloseForce) {
        this.$emit("close", true);
      } else {
        this.$emit("close", false);
      }
    },
    forceToClose() {
      this.$emit("update:modelValue", {
        start: "",
        end: "",
      });
      this.$emit("close", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.date-range-picker {
  display: flex;
  z-index: 99999;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #dddddd;
  padding: 1rem;
  width: 800px;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.drp-calendar {
  background-color: #fff;
  padding: 1rem;
  width: 50%;

  &:not(:last-child) {
    margin-right: 2rem;
  }

  @media (max-width: 576px) {
    width: 100%;

    &:not(:last-child) {
      margin-right: 0;
    }

    &:last-child {
      display: none;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__inner {
    @media (max-width: 768px) {
      margin-bottom: 30px;
      width: 100%;
    }
  }

  &__nav {
    outline: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;

    svg {
      --dimention: 16px;
      width: var(--dimention);
      height: var(--dimention);
    }
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 0;
    color: #333333;
  }

  &__day {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    list-style: none;

    &-item {
      width: calc(100% / 7);
      text-align: center;
      text-transform: uppercase;
      font-size: 0.75rem;
      line-height: 12px;
      letter-spacing: 1px;
      font-weight: 500;
      color: #b2b2b2;
    }
  }

  &__dates {
    display: flex;
    flex-wrap: wrap;

    .date {
      width: calc(100% / 7);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      cursor: pointer;
      font-size: 0.95rem;
      height: 40px;
      transition: background-color 0.1s ease;

      &.hover,
      &.active-start,
      &.active-end,
      &:hover {
        background-color: #f23e3d;
        color: #fff;
      }

      &.active-start,
      &.active-end {
        --b-radius: 4px;
        position: relative;
        overflow: hidden;
        border-radius: var(--b-radius) 0 0 var(--b-radius);

        &::before {
          --dimention: 11px;
          content: "";
          width: var(--dimention);
          height: var(--dimention);
          background-color: #020918;
          position: absolute;
          top: 50%;
          left: -6px;
          transform: translateY(-50%) rotate(45deg);
        }
      }

      &.active-end {
        border-radius: 0 var(--b-radius) var(--b-radius) 0;
        &::before {
          right: -6px;
          left: auto;
        }
      }

      &.active-end.active-start {
        --b-radius: 4px;
        position: relative;
        overflow: hidden;
        border-radius: var(--b-radius);

        &::before {
          --dimention: 11px;
          content: "";
          width: var(--dimention);
          height: var(--dimention);
          background-color: #020918;
          position: absolute;
          top: 50%;
          left: -6px;
          transform: translateY(-50%) rotate(45deg);
        }

        &::after {
          --dimention: 11px;
          content: "";
          width: var(--dimention);
          height: var(--dimention);
          background-color: #020918;
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%) rotate(45deg);
        }
      }

      &.disabled,
      &.today {
        user-select: none;
        cursor: auto;
        pointer-events: none;
        color: #dddddd;
        &:hover {
          background-color: transparent;
        }
      }

      &:nth-child(7n + 0) {
        --b-radius: 4px;
        border-radius: 0 var(--b-radius) var(--b-radius) 0;
      }

      &:nth-child(7n + 1) {
        --b-radius: 4px;
        border-radius: var(--b-radius) 0 0 var(--b-radius);
      }
    }
  }

  .drp-sm__set-date-btn {
    outline: 0;
    border: 0;
    background-color: #f23e3d;
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    border-radius: 4px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1rem;
    display: none;
    margin-top: 0.2rem;

    @media (max-width: 768px) {
      display: block;
    }
  }
}
</style>
