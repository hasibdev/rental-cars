<script setup>
import { ref, defineEmits, defineProps } from "vue"
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const emit = defineEmits(["onSearch"])
const props = defineProps({
  data: { type: [Array, null], required: true },
  fields: { type: Array, required: true },
  tableRootClass: { type: String, default: "" },
  tableClasses: { type: String, default: "base-table" },
  searchable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
})

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Get the table Head
const getTh = (col) => {
  if (typeof col === "object") {
    // eslint-disable-next-line no-prototype-builtins
    if (col.hasOwnProperty("label")) {
      return col.label
    }
    return col.field
      .split("_")
      .map((t) => capitalize(t))
      .join(" ")
  }

  return col
    .split("_")
    .map((t) => capitalize(t))
    .join(" ")
}

// Get the table Data
const getTd = (row, col) => {
  if (typeof col === "object") {
    // eslint-disable-next-line no-prototype-builtins
    if (col.hasOwnProperty("handler")) {
      return col.handler(row)
    }
    return row[col.field]
  }

  return row[col]
}

// Get Coulmn Name
const getColName = (col) => {
  if (typeof col === "object") {
    return col.field
  }
  return col
}

// Searching
const searchText = ref("")
const onSearch = () => {
  emit("onSearch", searchText.value)
}
</script>

<template>
  <div class="table-root">
    <!-- Toolbar -->
    <div class="d-flex justify-content-end align-items-center mb-3">
      <!-- Brefore content slot -->
      <slot name="toolbar-prepend" />

      <!-- Search Input -->
      <div v-if="props.searchable" class="search-input-root">
        <input v-model="searchText" @input="onSearch" type="text" class="search-input" :placeholder="t('form-fields.search')" />
        <div class="search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.9984 20.9999L16.6484 16.6499" stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- Filter Icon -->
      <slot name="filter">
        <div v-if="props.filterable">
          <svg width="40" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 33V26" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 22V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 33V24" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M24 20V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 33V28" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M32 24V15" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 26H19" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21 20H27" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29 28H35" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#DDDDDD" />
          </svg>
        </div>
      </slot>

      <!-- After content slot -->
      <slot name="toolbar-append" />
    </div>

    <!-- Table -->
    <div :class="props.tableRootClass" class="table__wrapper">
      <div class="table-responsive">
        <table class="table table-borderless w-100" :class="props.tableClasses">
          <thead>
            <tr>
              <th v-for="(col, i) in props.fields" :key="i" :class="col.thClass" scope="col">
                <span class="span" :class="`${col.hideTh ? 'text-transparent' : ''}`">
                  <slot :name="`th-${getColName(col)}`" :col="col">
                    {{ getTh(col) }}
                  </slot>
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-if="!props.loading">
            <tr v-for="(row, i) in props.data" :key="i" :class="{ bordered: props.bordered }">
              <td v-for="(col, i) in props.fields" :key="i" :class="col.tdClass">
                <slot :name="getColName(col)" :row="row" :col="row[getColName(col)]">
                  {{ getTd(row, col) ?? "-" }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- No data -->
        <div v-if="!props.loading && !props.data.length" class="d-flex flex-column align-items-center justify-content-center w-100 h-100">
          <div class="icon mb-4">
            <svg width="132" height="128" viewBox="0 0 132 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_4322_1348)">
                <path d="M116.535 14.9965C95.915 -4.99851 62.3639 -4.99851 41.7441 14.9965C21.7356 34.3989 21.1425 65.6077 39.9648 85.7103L32.8352 92.6238L28.989 88.8941C28.5055 88.4253 27.8495 88.1617 27.1656 88.1617C26.4818 88.1617 25.8258 88.4253 25.3423 88.8941L3.10387 110.459C1.10236 112.4 0 114.98 0 117.725C0 120.47 1.10236 123.05 3.10361 124.991C5.10513 126.931 7.76625 128 10.5965 128C13.4271 128 16.0879 126.931 18.0895 124.991L40.3282 103.426C40.8116 102.957 41.0834 102.321 41.0834 101.658C41.0834 100.995 40.8116 100.359 40.3282 99.8899L36.4819 96.1602L43.6115 89.2467C53.6601 98.0938 66.3999 102.517 79.1396 102.517C92.6824 102.517 106.225 97.5187 116.535 87.5211C137.155 67.5258 137.155 34.9915 116.535 14.9965ZM14.4428 121.454C13.4155 122.45 12.0496 122.999 10.5965 122.999C9.14375 122.999 7.7776 122.451 6.75028 121.454C5.72296 120.458 5.15722 119.134 5.15722 117.725C5.15722 116.316 5.72296 114.991 6.75054 113.995L27.1656 94.1983L34.8582 101.658L14.4428 121.454ZM112.888 83.9847C94.2794 102.03 64 102.03 45.391 83.9849C26.7817 65.9395 26.7817 36.5778 45.3907 18.5327C54.6954 9.50996 66.9177 4.99862 79.1396 4.99862C91.3616 4.99862 103.584 9.50996 112.888 18.5327C131.497 36.5778 131.497 65.9395 112.888 83.9847Z" fill="black" />
                <path d="M120.609 50.7703C120.39 49.7248 119.496 48.9137 118.403 48.7784C117.33 48.6456 116.245 49.2082 115.771 50.1526C115.305 51.0806 115.473 52.2138 116.203 52.9689C116.94 53.7311 118.118 53.9659 119.106 53.552C120.205 53.0919 120.848 51.9095 120.609 50.7703Z" fill="black" />
                <path d="M117.047 60.2998C115.688 59.8842 114.24 60.6151 113.812 61.9321C112.046 67.3589 109.036 72.161 104.866 76.2053C97.9941 82.8685 88.8579 86.5385 79.1396 86.5385C69.4216 86.5385 60.2851 82.8688 53.4134 76.2053C39.2282 62.4497 39.2282 40.068 53.4134 26.3124C60.2851 19.6489 69.4216 15.9792 79.1396 15.9792C88.8579 15.9792 97.9941 19.6489 104.866 26.3124C108.989 30.3112 112.088 35.2626 113.827 40.6311C114.253 41.9489 115.701 42.6812 117.059 42.2674C118.418 41.8538 119.174 40.4501 118.747 39.1326C116.76 32.9984 113.221 27.3424 108.512 22.776C100.667 15.1678 90.2351 10.9781 79.1396 10.9781C68.0441 10.9781 57.6126 15.1678 49.7667 22.776C33.5704 38.4815 33.5704 64.036 49.7667 79.7415C57.6126 87.3494 68.0439 91.5394 79.1396 91.5394C90.2354 91.5394 100.667 87.3496 108.512 79.7415C113.208 75.1886 116.741 69.5505 118.73 63.4369C119.158 62.1196 118.405 60.7151 117.047 60.2998Z" fill="black" />
                <path d="M63.3147 66.6042C66.6483 69.8368 72.0726 69.8368 75.4063 66.6042L79.1398 62.9838L82.8731 66.6042C84.54 68.2205 86.7295 69.0287 88.919 69.0287C91.1084 69.0287 93.2979 68.2205 94.9648 66.6042C98.2984 63.3716 98.2984 58.1116 94.9648 54.879L91.2312 51.2586L94.9648 47.6382C98.2984 44.4056 98.2984 39.1458 94.9648 35.913C91.6311 32.6804 86.2068 32.6804 82.8731 35.913L79.1396 39.5337L75.406 35.913C72.0721 32.6804 66.6483 32.6804 63.3144 35.913C59.9808 39.1456 59.9808 44.4056 63.3147 47.6382L67.0482 51.2586L63.3144 54.879C59.981 58.1114 59.9808 63.3714 63.3147 66.6042ZM66.9613 58.4152L72.5182 53.0267C73.0017 52.5578 73.2735 51.9217 73.2735 51.2586C73.2735 50.5955 73.0017 49.9594 72.5182 49.4905L66.9613 44.102C65.6385 42.8193 65.6385 40.7321 66.9613 39.4494C68.2839 38.1669 70.4368 38.1666 71.7593 39.4494L77.3162 44.8379C77.8 45.307 78.4557 45.5703 79.1396 45.5703C79.8234 45.5703 80.4794 45.3067 80.9629 44.8379L86.5198 39.4494C87.8426 38.1666 89.9953 38.1666 91.3178 39.4494C92.6407 40.7321 92.6407 42.8193 91.3178 44.102L85.7609 49.4905C85.2774 49.9594 85.0057 50.5955 85.0057 51.2586C85.0057 51.9217 85.2774 52.5578 85.7609 53.0267L91.3178 58.4152C92.6407 59.6979 92.6407 61.7851 91.3178 63.0678C89.9955 64.3506 87.8429 64.3508 86.5198 63.0678L80.9629 57.6793C80.4794 57.2102 79.8234 56.9469 79.1396 56.9469C78.4557 56.9469 77.7997 57.2105 77.3162 57.6793L71.7593 63.0678C70.4368 64.3506 68.2841 64.3506 66.9613 63.0678C65.6385 61.7851 65.6382 59.6979 66.9613 58.4152Z" fill="black" />
              </g>
              <defs>
                <clipPath id="clip0_4322_1348">
                  <rect width="132" height="128" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="fw-400 pb-3" style="font-size: 25px; color: #020918;">{{t('text.there-is-no-data-in-the-table')}}
          </div>
          <slot name="createNew">
          </slot>
        </div>

        <!-- Loading -->
        <Loading v-if="loading" class="my-3" />
      </div>

      <!-- Pagination -->
      <div class="pt-3">
        <slot v-if="props.data.length" name="pagination"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-root {
  .search-input-root {
    position: relative;
    background-color: #f2f2f2;
    border-radius: 5px;

    .search-input {
      width: 100%;
      border: 0;
      outline: 0;
      height: 45px;
      border-radius: 4px;
      padding: 6px 10px 6px 45px;
      background: transparent;
      color: #444;
      display: block;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.table__wrapper {
  display: flex;
  flex-direction: column;
  // min-height: 60vh;
  justify-content: space-between;

  .table-responsive {
    height: calc(100vh - 190px);
    overflow: auto;

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
}

.base-table {
  color: #666;

  thead {
    position: sticky;
    top: 0;
    z-index: 6;

    th {
      padding: 0 !important;
      white-space: nowrap;

      .span {
        background-color: #f6f7fb;
        display: block;
        padding: 10px;
        margin-bottom: 5px;
        font-weight: 500;
      }

      &:first-child {
        .span {
          padding-left: 25px;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
      }

      &:last-child {
        .span {
          padding-right: 25px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
    }
  }

  tbody {
    tr {
      &.bordered:not(:last-child) {
        border-bottom: 1px solid #eee;
      }

      td {
        padding: 1rem 0.5rem;
        color: #666;

        &:first-child {
          padding-left: 25px;
        }

        &:last-child {
          padding-right: 25px;
        }
      }

      td.dark-black {
        color: #020918 !important;
      }
    }
  }
}

.pagination_wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .page_item {
    background-color: #fff;
    padding: 5px 15px;
    border-radius: 5px;
    cursor: pointer;
    color: #444;
    font-weight: bold;

    &:hover {
      background-color: var(--color-primary);
      color: #fff;
    }
  }
}
</style>
