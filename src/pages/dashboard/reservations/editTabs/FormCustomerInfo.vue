<script setup>
import { ref, watch } from 'vue'
import FormSelect from "@/components/dashboard/shared/FormSelect.vue"
import UserCard from "@/components/dashboard/reservations/components/UserCard.vue"
import { api } from '@/use/useAxios'
import { useReservationStore } from '@/stores/reservation'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const reserveStore = useReservationStore()
const customers = ref([])
const customersFirstLoad = ref(false)
const activeCustomer = ref(null)
// const form = reactive({
//   customer_id: ''
// })

// Get Customers and to default
const getCustomers = async (keyowrd = "") => {
  try {
    const res = await api.get(
      `/admin/customer/search?name=${keyowrd}`
    )
    customers.value = res.data
    customersFirstLoad.value = true
  } catch (err) {
    console.error(err)
  }
}
getCustomers()

const selectCustomer = async () => {
  const find = customers.value.find(
    ({ id }) => id === reserveStore.edit.customer_id
  )

  if (find) {
    activeCustomer.value = find
  } else {
    const res = await api.get(`/admin/customer/edit/${reserveStore.edit.customer_id}`)
    activeCustomer.value = res.data.datainfo
  }
}

watch(() => [reserveStore.edit.customer_id, customersFirstLoad.value], ([a, b]) => {
  if (a && b) {
    selectCustomer()
  }
})

const createNewCustomer = () => router.push(`/customer/create`)

</script>

<template>
  <div class="customer-info">
    <div class="row">
      <div class="col-md-6 col-xxl-4">
        <p class="text-muted mb-2">{{t('form-fields.customer-name')}}</p>
        <FormSelect v-model="reserveStore.edit.customer_id" :options="customers" no-border @search="getCustomers"
          displayProperty="full_name" valueProperty="id" :placeholder="t('form-fields.please-select')" search
          :search-placeholder="t('form-fields.search-location')">
          <template #append>
            <p class="text-right fw-500 mt-1"><span @click="createNewCustomer" class="pointer">+
                {{t('dashboard-customer.new-customer')}}</span></p>
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
