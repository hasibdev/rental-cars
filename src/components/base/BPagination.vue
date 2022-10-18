<template>
  <ul v-if="totalPages > 1" class="pagination">
    <template v-if="totalPages <= 5">
      <li v-for="page in totalPages" :key="page" class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === page }" @click="randonPage(page)">
          {{ page }}
        </button>
      </li>
    </template>
    <template v-else>
      <li class="pagination__item">
        <button @click="prev" class="pagination__btn pagination__btn--nav">
          <span class="icon">
            <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9312 2.57582C14.1655 2.81014 14.1655 3.19004 13.9312 3.42435L4.77973 12.5758C4.54542 12.8101 4.54542 13.19 4.77973 13.4244L13.9312 22.5758C14.1655 22.8101 14.1655 23.19 13.9312 23.4244L12.4227 24.9328C12.1884 25.1672 11.8085 25.1672 11.5742 24.9328L0.819936 14.1786C0.169063 13.5277 0.169063 12.4725 0.819936 11.8216L11.5742 1.06733C11.8085 0.833016 12.1884 0.833015 12.4227 1.06733L13.9312 2.57582Z" fill="#666666" />
            </svg>
          </span>
        </button>
      </li>
      <li class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === start }" @click="randonPage(start)">
          {{ start }}
        </button>
      </li>
      <li class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === start + 1 }" @click="randonPage(start + 1)">
          {{ start + 1 }}
        </button>
      </li>
      <li class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === start + 2 }" @click="randonPage(start + 2)">
          {{ start + 2 }}
        </button>
      </li>
      <li class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === start + 3 }" @click="randonPage(start + 3)">
          {{ start + 3 }}
        </button>
      </li>
      <li class="pagination__item">
        <button class="pagination__btn" :class="{ active: modelValue === start + 4 }" @click="randonPage(start + 4)">
          {{ start + 4 }}
        </button>
      </li>
      <li class="pagination__item">
        <button @click="next" class="pagination__btn pagination__btn--nav">
          <span class="icon">
            <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.0688 23.4242C0.834481 23.1899 0.834481 22.81 1.0688 22.5756L10.2203 13.4242C10.4546 13.1899 10.4546 12.81 10.2203 12.5756L1.06879 3.42418C0.83448 3.18986 0.834479 2.80996 1.06879 2.57565L2.57729 1.06715C2.8116 0.832838 3.1915 0.832838 3.42582 1.06715L14.1801 11.8214C14.8309 12.4723 14.8309 13.5275 14.1801 14.1784L3.42582 24.9327C3.1915 25.167 2.8116 25.167 2.57729 24.9327L1.0688 23.4242Z" fill="#666666" />
            </svg>
          </span>
        </button>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentPage: this.modelValue,
      showTotalPage: this.modelValue - 5,
    }
  },
  computed: {
    start() {
      if (this.currentPage < this.totalPages - 4) {
        return this.currentPage
      } else {
        return this.totalPages - 4
      }
    },
  },
  methods: {
    prev() {
      if (this.currentPage > 1) {
        this.$emit("update:modelValue", this.currentPage)
        this.$emit("change", this.currentPage)
        this.currentPage--
      } else {
        this.$emit("update:modelValue", this.currentPage)
        this.$emit("change", this.currentPage)
      }
    },
    next() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.$emit("update:modelValue", this.currentPage)
        this.$emit("change", this.currentPage)
      }
      return
    },
    randonPage(pageNum) {
      this.currentPage = pageNum
      this.$emit("update:modelValue", pageNum)
      this.$emit("change", pageNum)
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  --size: 35px;
  &__item {
    &:not(:last-child) {
      margin-right: 10px;
    }
    width: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  &__btn {
    outline: none;
    background-color: transparent;
    width: var(--size);
    height: var(--size);
    border: 1px solid var(--color-grey);
    display: flex;
    line-height: 1.3;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.1s ease-in;

    &.active,
    &:hover {
      background-color: var(--color-dark);
      color: var(--color-white);
      border-color: var(--color-dark);
    }

    &--nav {
      border: none;

      .icon svg {
        width: 22px;
        height: 22px;
      }

      &:hover {
        background-color: var(--color-light-grey);
        color: var(--color-text);
      }
    }
  }
}
</style>
