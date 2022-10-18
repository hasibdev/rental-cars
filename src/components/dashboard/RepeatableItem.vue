<script setup>
import { defineProps, defineEmits } from 'vue'
const emits = defineEmits(['update:items', 'input'])
const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  ignoreFirstDelete: {
    type: Boolean,
    default: false
  },
  showSerial: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
})


const removeRow = (i) => {
  emits('update:items', props.items.filter((x, _i) => i !== _i))
}

</script>
<template>
  <div>
    <table class="table table-borderless mb-0 w-100">
      <thead v-if="!hideHeader">
        <tr>
          <th v-if="showSerial"></th>
          <th v-for="(field, i) in fields" :key="i" class="v-middle" :style="{width: field.width || 'auto'}">
            <span class="span">{{ field.label }}</span>
          </th>
          <th class="v-middle">
            <span class="span"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, ii) in items" :key="ii">
          <!-- setial -->
          <td v-if="showSerial" class="v-middle" :style="{width: '35px'}">{{ ++ii }}.</td>
          <!-- Fields loop -->
          <td v-for="(field, i) in fields" :key="i" class="v-middle">
            <div class="relative">
              <slot :name="field.name">
                <component :is="field.component" v-model="item[field.name]" @update:modelValue="emits('input', {item, index: ii})" v-bind="{...field.props}"></component>
              </slot>
              <div v-if="field.appendIcon" v-html="field.appendIcon" class="append__icon"></div>
            </div>
          </td>
          <!-- X remove icon -->
          <td class="v-middle" :style="{width: '80px'}">
            <div v-if="ignoreFirstDelete ? ii !==0 : true" class="d-flex justify-content-center align-items-center">
              <svg @click="removeRow(ii)" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="pointer">
                <path d="M18 6L6 18" stroke="#9A9DA3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 6L18 18" stroke="#9A9DA3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss" scoped>
.table {
  thead {
    th {
      padding: 0 !important;
      white-space: nowrap;
      background-color: #f6f7fb;
      .span {
        display: block;
        padding: 10px;
        margin-bottom: 5px;
        font-weight: 500;
        color: #666666;
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
}
.v-middle {
  vertical-align: middle;
}

.relative {
  position: relative;
}
.append__icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
