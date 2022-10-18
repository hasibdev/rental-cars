<template>
  <div class="d-table">
    <!-- header -->
    <div v-if="header" class="d-table__header mb-3">
      <!-- <h3 class="d-table__header-title">{{ title }}</h3>
      <div class="d-table__header-filter">
        <b-select ref="location" v-model="filter" :options="filsterOptions" display-property="location_name" value-property="location_name" placeholder="All Users" required outline class="search-box__select">
        </b-select>
      </div> -->
      <slot name="tHeader" />
    </div>
    <!-- <slot name="theader" /> -->
    <!-- table -->
    <div class="d-table__container">
      <table class="d-table__table">
        <!-- table head -->
        <!-- <slot name="tHeader" /> -->
        <thead class="d-table__head">
          <slot name="thead" />
        </thead>
        <!-- table body -->
        <tbody class="d-table__body">
          <slot name="tbody" />
        </tbody>
      </table>
      <slot name="no-content" />
    </div>

    <!-- footer -->
    <div class="d-table__footer">
      <slot name="tfooter" />
    </div>
  </div>
</template>

<script>
// import BSelect from "../base/BSelect.vue"
export default {
  components: {
    // BSelect,
  },
  props: {
    header: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Table Title...'
    }
  },
  data() {
    return {
      filter: this.$t('form-fields.all-user')
    }
  },
  computed: {
    filsterOptions() {
      return [this.$t('form-fields.all-user'), this.$t('form-fields.active'), this.$t('form-fields.inactive')]
    }
  },
};
</script>

<style lang="scss">
.b-data-table {
  border-radius: 5px;
  border: 1px solid var(--color-light-grey);
  height: calc(100vh - 150px);
  overflow: hidden;
}

.d-table {
  width: 100%;
  padding: 1rem;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: inherit;

    &-title {
      font-size: 1.2rem;
      font-weight: 500;
      // text-transform: capitalize;
      color: var(--color-heading);
    }

    &-filter {
      width: 15%;
    }
  }

  &__container {
    height: calc(100vh - 300px);
    overflow-x: hidden;
    overflow-y: scroll;

    scrollbar-width: thin;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }
    &::-webkit-scrollbar-track {
      background-color: #fff;
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
    }
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.625rem;
      border-radius: 0.625rem;
      background: #dadce0;
    }
  }

  &__table {
    width: 100%;
    background-color: var(--color-white);
  }

  &__head {
    background-color: #f6f7fb;
    position: sticky;
    top: 0;
    z-index: 6;

    th {
      padding: 10px;
      text-transform: capitalize;
      font-weight: 500;
      font-size: 15px;
      color: var(--color-text);

      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        text-align: center;
        border-radius: 0 4px 4px 0;
      }
    }
  }

  &__body {
    font-size: 15px;

    tr {
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #f6f7fb;
      }
    }
    td {
      padding: 24px 10px;
      font-weight: 400;
      color: var(--color-text);
      vertical-align: middle;
      p {
        margin-bottom: 0;
      }

      &:last-child {
        text-align: right;
      }
    }
  }

  &__status-btn {
    padding: 6px 10px;
    font-weight: 400 !important;
    width: 75px;
    font-size: 0.9375rem !important;

    &.active {
      color: var(--color-success);
      background-color: #f3fff8;
    }
    &.inactive {
      color: var(--color-error);
      background-color: #fffafa;
    }
  }

  &__action {
    .base-btn {
      &:not(:last-child) {
        margin-right: 0;
      }
    }
    position: relative;
    &-btn {
      margin-right: 0;
      svg {
        pointer-events: none;
      }
    }
    &-list {
      border: 1px solid var(--color-light-grey);
      border-radius: 4px;
      overflow: hidden;
      position: absolute;
      top: 33px;
      right: 0;
      background: var(--color-white);
      width: 150px;
      text-align: left;
      display: none;
      z-index: 5;
      box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);

      &.active {
        display: block;
      }

      &-item {
        padding: 10px;
        font-size: 0.875rem;
        user-select: none;
        cursor: pointer;
        transition: background 0.3s ease;
        &:hover {
          background-color: var(--color-light-grey);
        }

        .icon {
          margin-right: 10px;
        }
      }
    }
  }

  &-user {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  
    &__avatar {
      height: 45px;
      width: 45px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__info {
      h5 {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
        @include responsive-max("md") {
           font-size: 12px;
        }
      }

      p {
        font-size: 14px;
      }
    }
  }

  &__footer {
    padding: 0.875rem 0;
    position: sticky;
    bottom: 0;
    background-color: var(--color-white);
    border-top: 1px solid var(--color-light-grey);
  }
}
</style>
