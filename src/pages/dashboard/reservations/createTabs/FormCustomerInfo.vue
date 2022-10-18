<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import UserCard from "@/components/dashboard/reservations/components/UserCard.vue"
import { api } from '../../../../plugins/api'
import { useReservationStore } from '@/stores/reservation'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const reserveStore = useReservationStore()
const customers = ref([])
const activeCustomer = ref(null)
const form = reactive({
  customer_id: ''
})


const getCustomers = async (keyowrd = "") => {
  try {
    const res = await api.get(
      `/admin/customer/search?name=${keyowrd}`
    )
    customers.value = res.data

    if (!form.customer_id) {
      form.customer_id = customers.value[0].id
    }
  } catch (err) {
    console.error(err)
  }
}
getCustomers()

const selectCustomer = () => {
  activeCustomer.value = customers.value.find(
    ({ id }) => id === +form.customer_id
  )
}

watch(() => form.customer_id, () => {
  selectCustomer()
  reserveStore.form.customer_id = form.customer_id
})

const createNewCustomer = () => router.push(`/customer/create`)

</script>

<template>
  <div class="customer-info">
    <div class="row">
      <div class="col-md-6 col-xxl-4">
        <p class="text-muted mb-2">{{t('form-fields.customer-name')}}</p>
        <FormSelect v-model="form.customer_id" :options="customers" no-border @search="getCustomers"
          displayProperty="full_name" valueProperty="id" :placeholder="t('form-fields.customer-name')" search
          :search-placeholder="t('form-fields.search-customer')">
          <template #append>
            <p class="text-right fw-500 mt-1"><span @click="createNewCustomer" class="pointer">+
                {{t('dashboard-reservation.new-customer')}}</span></p>
          </template>
        </FormSelect>
      </div>
      <div class="col-xxl-8">
        <UserCard v-if="activeCustomer !== null" :user="activeCustomer" />
        <!-- Loading -->
        <Loading v-else class="my-3" />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>

</style>
