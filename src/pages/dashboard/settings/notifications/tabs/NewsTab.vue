<script setup>
import { reactive, ref } from 'vue'
import InputControl from '@/components/form/InputControl.vue'
import TextControl from '@/components/form/TextControl.vue'
import SelectControl from '@/components/form/SelectControl.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { api } from '@/plugins/axios'
import { useAxios } from '@/use/useAxios'
import { useToast } from "vue-toastification"

const toast = useToast()
const { data: productList } = useAxios('/admin/productupload')

const form = reactive({
  title: '',
  description: '',
  car_id: ''
})

const savingState = ref(false)
const onSave = async () => {
  try {
    savingState.value = true

    await api.post('/admin/push_notifactions/store', form)

    toast.success('Created Successfuly')
  } catch (error) {
    console.error(error)
    toast.error('Request Fail')
  } finally {
    savingState.value = false
  }


}

</script>

<template>
  <div class="border-top mt-4">
    <div class="row pt-2">
      <div class="col-md-5">
        <InputControl v-model="form.title" label="Notification title" class="mt-3" errorField="title" />
        <TextControl v-model="form.description" label="Message" class="mt-3" errorField="description" />

        <SelectControl label="Vehicle (optional)" v-model="form.car_id" :options="productList?.data || []" trackBy="car_id" optionLabel="model_title" class="mt-3" errorField="car_id" />
      </div>
      <div class="col-md-5 offset-md-2">
        <div class="d-flex justify-content-between align-items-start mt-3">
          <p>Preview</p>

          <div>
            <img src="@/assets/images/iphoneImg.png" alt="">
          </div>

          <div class="d-flex">
            <div class="px-2 py-1 border rounded border-primary d-flex justify-content-center align-items-center">
              <svg width="22" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.98111 7.30873C7.71588 7.30874 8.60251 7.44798 9.64101 7.72642C10.6893 8.0049 11.3849 8.14413 11.7278 8.14411C12.1686 8.14413 12.8887 7.98693 13.888 7.67252C14.8873 7.35815 15.7544 7.20095 16.4892 7.20094C17.6942 7.20095 18.767 7.49738 19.7075 8.09022C20.2365 8.43157 20.7607 8.89418 21.2799 9.47803C20.4961 10.0889 19.923 10.6323 19.5605 11.1084C18.9041 11.9707 18.5759 12.9229 18.5759 13.9649C18.5759 15.1057 18.9237 16.1342 19.6193 17.0504C20.3149 17.9666 21.1084 18.546 22 18.7885C21.6277 19.8934 21.0105 21.0476 20.1484 22.2513C18.8453 24.0568 17.5521 24.9596 16.2687 24.9596C15.7593 24.9596 15.0539 24.8114 14.1526 24.5149C13.261 24.2185 12.5066 24.0703 11.8894 24.0703C11.2722 24.0703 10.5521 24.223 9.72918 24.5284C8.91602 24.8428 8.25472 25 7.74528 25C6.20713 25 4.69839 23.8053 3.21904 21.4159C1.73968 19.0535 0.999998 16.736 1 14.4634C0.999998 12.3525 1.56333 10.6323 2.68999 9.30287C3.82645 7.97346 5.25682 7.30874 6.98111 7.30873ZM16.2393 2C16.2785 2.1168 16.303 2.2201 16.3128 2.3099C16.3226 2.39975 16.3275 2.48957 16.3275 2.57938C16.3275 3.15429 16.1805 3.78307 15.8866 4.46573C15.5927 5.14843 15.1273 5.7817 14.4906 6.36555C13.9419 6.85961 13.3982 7.19197 12.8593 7.36262C12.5164 7.46145 11.9972 7.5378 11.3016 7.59168C11.3212 6.22634 11.7082 5.04513 12.4626 4.04804C13.2267 3.05099 14.4856 2.36831 16.2393 2Z" stroke="#AAAAAA" stroke-width="2" />
              </svg>
            </div>

            <div class="px-2 py-1 border rounded ms-2">
              <svg width="22" height="14" viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.0872 4.44901L22.3255 0.665151C22.4518 0.453027 22.3754 0.183568 22.161 0.0603051C21.9465 -0.0629554 21.6675 0.00870632 21.5441 0.220832L19.2765 4.05342C17.5465 3.28232 15.599 2.85233 13.5047 2.85233C11.4104 2.85233 9.46299 3.28231 7.73291 4.05342L5.46531 0.220832C5.339 0.00870632 5.0629 -0.0629554 4.84554 0.0603051C4.62818 0.183568 4.55474 0.453027 4.68105 0.665151L6.91927 4.44901C3.05965 6.49001 0.445446 10.3025 0.0136719 14.7657H26.9958C26.564 10.3025 23.9498 6.48997 20.0873 4.44901H20.0872ZM7.30994 11.0679C6.68429 11.0679 6.17908 10.572 6.17908 9.96427C6.17908 9.35369 6.68723 8.86065 7.30994 8.86065C7.93559 8.86065 8.4408 9.35656 8.4408 9.96427C8.44375 10.572 7.93559 11.0679 7.30994 11.0679ZM19.6966 11.0679C19.0709 11.0679 18.5657 10.572 18.5657 9.96427C18.5657 9.35369 19.0739 8.86065 19.6966 8.86065C20.3222 8.86065 20.8275 9.35656 20.8275 9.96427C20.8304 10.572 20.3222 11.0679 19.6966 11.0679Z" fill="#AAAAAA" />
              </svg>
              <p style="font-size: 7px;">android</p>
            </div>
          </div>
        </div>

        <p class="text-center w-75 mx-auto mt-3">*A Push Notification will be sent to your customers when when they have activated their settings.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="d-flex align-items-center justify-content-end mt-5 pt-5">
      <PrimaryButton text="Abbrechen" variant="light"></PrimaryButton>
      <PrimaryButton @click="onSave" text="Speichern" class="ms-3" :loading="savingState"></PrimaryButton>
    </div>
  </div>
</template>


<style lang="scss" scoped>
</style>
