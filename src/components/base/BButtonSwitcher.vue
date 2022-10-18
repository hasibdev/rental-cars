<script setup>
import { computed, defineEmits, defineProps } from "vue"
const emit = defineEmits(["update:modelValue", "change"])

const props = defineProps({
   modelValue: {
      type: [Boolean, Number],
      required: false,
   },
   onChangeValue: {
      type: [String, Number, Object],
      required: false,
   },
   activeColor: {
      type: String,
      default: "#1BCE6C",
   },
   iactiveColor: {
      type: String,
      default: "#888888",
   },
   activeText: {
      type: String,
      default: "form-fields.active",
   },
   inactiveText: {
      type: String,
      default: "form-fields.inactive",
   },
   uniqueId: {
      type: String,
      default: "bBtnSwitcher",
   },
   width: {
      type: [String, Number],
      default: "100%",
   },
})

const colors = computed(() => {
   return {
      "--width": props.width,
      "--active-color": props.activeColor,
      "--active-bg-color": props.activeColor + "99",
      "--inactive-color": props.iactiveColor,
      "--inactive-bg-color": props.iactiveColor + "99",
   }
})
const onChange = (e) => {
   emit("update:modelValue", e.target.checked)
   emit("change", { status: e.target.checked, value: props.onChangeValue })
};
</script>

<template>
   <label :style="colors" :for="props.uniqueId" :class="{ active: props.modelValue }" class="b-btn-switcher">
      {{ props.modelValue ? $t(activeText) : $t(inactiveText) }}
      <div class="b-btn-switcher__swicth">
         <input :id="props.uniqueId" :checked="props.modelValue" @change="onChange" type="checkbox" />
         <span class="b-btn-switcher__swicth-slider"></span>
      </div>
   </label>
</template>

<style lang="scss" scoped>
.b-btn-switcher {
   --width: 100%;
   --active-color: #1bce6c;
   --active-bg-color: #1bce6c99;
   --inactive-color: #888888;
   --inactive-bg-color: #88888899;

   border: 1px solid var(--inactive-color);
   border-radius: 4px;
   display: inline-flex;
   align-items: center;
   justify-content: center;
   padding: 4px 5px;
   text-transform: capitalize;
   user-select: none;
   cursor: pointer;
   font-size: 0.9375rem;
   font-weight: 500;
   color: var(--inactive-color);
   width: var(--width);

   &.active {
      border-color: var(--active-color);
      color: var(--active-color);
   }

   &__swicth {
      display: inline-block;
      width: 34px;
      height: 20px;
      margin: 4px;
      position: relative;

      &-slider {
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         border-radius: 30px;
         cursor: pointer;
         border: 4px solid transparent;
         overflow: hidden;
         transition: 0.2s;
         background-color: var(--inactive-bg-color);

         &:before {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            background-color: var(--inactive-color);
            border-radius: 30px;
            transform: translateX(-13px);
            transition: 0.2s;
         }
      }

      input {
         display: none;

         &:checked + .b-btn-switcher__swicth-slider:before {
            transform: translateX(13px);
            background-color: var(--active-color);
         }
         &:checked + .b-btn-switcher__swicth-slider {
            background-color: var(--active-bg-color);
         }
      }
   }
}
</style>
