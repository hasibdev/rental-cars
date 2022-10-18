<script setup>
import {defineEmits, defineProps} from 'vue'
const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
   modelValue: {
      type: [Boolean, Number],
      required: false
   },
   activeBackground: {
      type: String,
      default: '#95f0be'
   },
   defaultBackground: {
      type: String,
      default: '#ddd'
   },
   defaultColor: {
      type: String,
      default: '#808080'
   },
   activeColor: {
      type: String,
      default: '#1BCE6C'
   },
})

const onChange = e => {
   emit('update:modelValue', e.target.checked)
   emit('change', e)
}
</script>

<template>
   <label class="switch">
      <input :checked="props.modelValue" @change="onChange" type="checkbox" />
      <span class="slider"></span>
   </label>
</template>

<style lang="scss" scoped>
.switch input {
   display: none;
}
.switch {
   display: inline-block;
   width: 34px; /*=w*/
   height: 20px; /*=h*/
   margin: 4px;
   position: relative;
}
.slider {
   position: absolute;
   top: 0;
   bottom: 0;
   left: 0;
   right: 0;
   border-radius: 30px;
   // box-shadow: 0 0 0 2px #777, 0 0 4px #777;
   cursor: pointer;
   border: 4px solid transparent;
   overflow: hidden;
   transition: 0.2s;
   background-color: v-bind("props.defaultBackground");
}
.slider:before {
   position: absolute;
   content: "";
   width: 100%;
   height: 100%;
   background-color: v-bind("props.defaultColor");
   border-radius: 30px;
   transform: translateX(-13px); /*translateX(-(w-h))*/
   transition: 0.2s;
}
input:checked + .slider:before {
   transform: translateX(13px); /*translateX(w-h)*/
   background-color: v-bind("props.activeColor");
}
input:checked + .slider {
   // box-shadow: 0 0 0 2px #95f0be, 0 0 8px #95f0be;
   background-color: v-bind("props.activeBackground");
}
</style>
