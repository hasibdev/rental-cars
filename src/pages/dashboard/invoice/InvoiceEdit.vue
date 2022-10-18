<script setup>
import { ref, markRaw, watch, onUnmounted, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BackButton from "@/components/buttons/BackButton.vue"
import EditInvoice from './edit-steps/EditInvoice.vue'
import CheckInvoice from './edit-steps/CheckInvoice.vue'
import PublishInvoice from './edit-steps/PublishInvoice.vue'
import { useAxios, api } from '@/use/useAxios'
import { useInvoiceStore } from '@/stores/invoice'
import { useToast } from "vue-toastification"

const { data: generalInfo, loading } = useAxios('admin/general-information')

const router = useRouter()
const route = useRoute()
const { t, } = useI18n({ useScope: 'global' })
const toast = useToast()
const { edit, clearForm } = useInvoiceStore()

onUnmounted(() => {
  clearForm()
})


const activeStep = ref({})

const steps = ref([
  {
    id: 1,
    name: t('dashboard-invoice.edit-invoice'),
    backLabel: t('dashboard-invoice.create-invoice'),
    component: markRaw(EditInvoice)
  },
  {
    id: 2,
    name: t('dashboard-invoice.check-invoice'),
    backLabel: t('dashboard-invoice.invoice-preview'),
    component: markRaw(CheckInvoice)
  },
  {
    id: 3,
    name: t('dashboard-invoice.publish-invoice'),
    backLabel: t('dashboard-invoice.publish-invoice'),
    component: markRaw(PublishInvoice)
  },
])

watch(() => generalInfo.value, (val) => {
  edit.currency = val.store_currency
})

const changeTab = (id) => {
  activeStep.value = steps.value.find(step => step.id == id)
  document.querySelector('.scrollbar')?.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (route.query.invoiceId) {
    changeTab(3)
  } else {
    changeTab(1)
  }
})


const savingStatus = ref(false)
const saveInvoice = async () => {
  try {
    savingStatus.value = true
    const res = await api.post(`admin/invoice/update/${route.params.id}`, edit)
    router.push({ query: { invoiceId: res.data.invoice_id } })
    toast.success(`${t('toast.addText')}`)

    changeTab(3)
  } catch (error) {
    toast.error(`${t('toast.failureAddText')}`)
  } finally {
    savingStatus.value = false
  }
}


  </script>

  <template>
  <div>
    <h5 class="d-flex align-items-center mb-3">
      <BackButton /> <span class="ms-3"> {{activeStep.backLabel}} </span>
    </h5>

    <!-- Stepper -->
    <div class="stepper_wrapper my-4">
      <div v-for="(step, i) in steps" :key="i" @click="changeTab(step.id)" class="step" :class="{'active': step.id <= activeStep.id }">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C19.713 2 23.274 3.475 25.8995 6.1005C28.525 8.72601 30 12.287 30 16C30 19.713 28.525 23.274 25.8995 25.8995C23.274 28.525 19.713 30 16 30C12.287 30 8.72601 28.525 6.1005 25.8995C3.475 23.274 2 19.713 2 16C2 12.287 3.475 8.72601 6.1005 6.1005C8.72601 3.475 12.287 2 16 2ZM14.256 18.762L11.146 15.65C11.0345 15.5385 10.9021 15.4501 10.7565 15.3897C10.6108 15.3294 10.4547 15.2983 10.297 15.2983C10.1393 15.2983 9.9832 15.3294 9.83752 15.3897C9.69185 15.4501 9.55949 15.5385 9.448 15.65C9.22283 15.8752 9.09633 16.1806 9.09633 16.499C9.09633 16.8174 9.22283 17.1228 9.448 17.348L13.408 21.308C13.5192 21.4201 13.6514 21.509 13.7972 21.5697C13.9429 21.6304 14.0992 21.6616 14.257 21.6616C14.4148 21.6616 14.5711 21.6304 14.7168 21.5697C14.8626 21.509 14.9948 21.4201 15.106 21.308L23.306 13.106C23.419 12.995 23.5089 12.8627 23.5705 12.7167C23.6321 12.5708 23.6641 12.4141 23.6649 12.2557C23.6656 12.0973 23.635 11.9403 23.5748 11.7938C23.5145 11.6473 23.4259 11.5142 23.3139 11.4021C23.202 11.29 23.069 11.2012 22.9225 11.1408C22.7761 11.0804 22.6191 11.0496 22.4607 11.0501C22.3023 11.0507 22.1456 11.0826 21.9996 11.144C21.8536 11.2054 21.7212 11.2951 21.61 11.408L14.256 18.762Z" fill="#DDDDDD" />
        </svg>
        <p class="mt-2">{{ step.name }}</p>
      </div>
    </div>

    <!-- Steps Output -->
    <div>
      <!-- Loading -->
      <Loading v-if="loading" class="my-3" />
      <keep-alive v-else>
        <component :is="activeStep.component" :info="generalInfo" :savingStatus="savingStatus" @changeTab="changeTab" @save="saveInvoice" />
      </keep-alive>
    </div>
  </div>
</template>

  <style lang="scss" scoped>
.stepper_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  width: 630px;
  .step {
    text-align: center;
    width: 110px;
    position: relative;
    &:not(:first-child)::after {
      content: "";
      width: 150px;
      height: 1px;
      background: #ddd;
      position: absolute;
      right: 100%;
      top: 15px;
    }

    &.active {
      color: #46b276;

      &::after {
        background: #46b276;
      }

      svg path {
        fill: #46b276;
      }
    }
  }
}
</style>
