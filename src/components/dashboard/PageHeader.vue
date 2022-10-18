<template>
  <div class="header"> 
    <div class="row">
      <div class="col-lg-2 col-md-1" :class="this.$i18n.locale === 'de' ? 'col-xl-6' : 'col-xl-7' "></div>
      <div class="col-xl-3 col-lg-6 col-md-5">
        <div class="header__search-container">
          <div v-if="searchBar" class="header__search-bar">
            <b-input v-model="searchText" icon :placeholder="$t('form-fields.search')">
              <IconSearch />
            </b-input>
          </div>

          <slot name="filter">
            <div v-if="filter" class="header__filters">
              <button @click="showFilter" class="base-btn header__filters-btn">
                <IconSlider />
              </button>
              <ul :class="{ show: isFilter }" class="header__filters-list">
                <li v-for="(opetion, idx) in filterOptions" :key="idx" @click="selectFilter(opetion, idx)"
                  :class="{ active: idx === filterAcitiveIndex }">
                  {{ $t(opetion) }}
                </li>
              </ul>
            </div>
          </slot>
        </div>
      </div>
      <div class="col-lg-4 col-md-6" :class="this.$i18n.locale === 'de' ? 'col-xl-3' : 'col-xl-2' ">
        <app-link class="header__btn base-btn__dark base-btn" :path="buttonPath">
          <slot name="addIcon"></slot> {{ buttonText }}
        </app-link>
      </div>
    </div>
  </div>
</template>

<script>
import IconSearch from "@/icons/IconSearch.vue"
import IconSlider from "@/icons/IconSlider.vue"
import BInput from "../base/BInput.vue"
export default {
  emits: ['search'],
  components: {
    BInput,
    IconSearch,
    IconSlider,
  },
  props: {
    buttonText: {
      type: String,
      default: "+ Add ",
    },
    buttonPath: {
      type: String,
      default: "/customer/add",
    },
    filter: {
      type: Boolean,
      default: false,
    },
    filterOptions: {
      type: Array,
      default: () => ['form-fields.all', "form-fields.active", "form-fields.inactive"],
    },
    searchBar: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      isFilter: false,
      filterAcitiveIndex: 0,
      searchText: ''
    }
  },
  methods: {
    showFilter() {
      this.isFilter = !this.isFilter
    },
    selectFilter(val, idx) {
      this.$emit("filter", val)
      this.isFilter = false
      this.filterAcitiveIndex = idx
    },
  },
  watch: {
    searchText(val) {
      this.$emit('search', val)
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 0.5rem;

  &__btn {
    width: 100%;
    display: block;
    text-align: center;
    padding: 12px;
    color: var(--color-white);
  }

  &__search-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__search-bar {
    flex: 1 1 auto;
  }

  &__filters {
    position: relative;

    &-list {
      position: absolute;
      right: 0;
      top: 60px;
      background-color: var(--color-white);
      z-index: 99;
      width: 200px;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
      visibility: hidden;
      transition: all 0.3s ease;

      li {
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.1s ease;
        font-size: 0.975rem;

        &.active,
        &:hover {
          background-color: var(--color-light-grey);
        }
      }

      &.show {
        visibility: visible;
        top: 50px;
      }
    }

    &-btn {
      border: 1px solid var(--color-light-grey);
      margin-left: 1rem;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child) {
        margin-right: 0 !important;
      }

      svg {
        stroke: var(--color-text);
      }
    }
  }
}
</style>
