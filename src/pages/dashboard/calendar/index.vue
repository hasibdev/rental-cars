<script setup>
import { ref, reactive, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'

import CalenderControl from "@/components/dashboard/form/CalenderControl.vue"
import SelectControl from "@/components/dashboard/form/SelectControl.vue"
import ModalControl from '@/components/common/modals/ModalControl.vue'
import times from "@/static/times.json"
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAxios, api } from '../../../use/useAxios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import VueResizable from '@/components/common/Resizeable.vue'
import { useValidationStore } from '@/stores/validation'
import StatusButton from "@/components/dashboard/shared/StatusButton.vue"

const { data: calenderData, loading, reFetch } = useAxios('admin/calendar')
const { data: vehicleData } = useAxios('admin/vehicle')

const { t, locale } = useI18n({ useScope: 'global' })
const toast = useToast()
const router = useRouter()

const validationStore = useValidationStore()

const hasErrors = computed(() => {
  return !!Object.keys(validationStore.errors).length
})

const clearErrors = () => {
  validationStore.errors = {}
}

const activeDate = ref(new Date())
const activeFilter = ref(1)
const calendarKey = ref(1)
const reservationActionStatus = ref(false)
const calendarScrollTopPosition = ref(0)

const reRenderCalender = () => {
  calendarKey.value += 1
  nextTick(() => {
    document.querySelector('.calender__wrapper').scrollTo({
      top: calendarScrollTopPosition.value
    })
  })
}

const filters = [
  { label: t("Calendar.weekly-view"), id: 1 },
  { label: t("Calendar.15-days"), id: 2 }
]

const days = ref([])

// Calender width / height calculation
const rowHeight = ref(115)
const daysRef = ref()
const cellWidth = ref()
const cellWidthNumber = ref(0)
onMounted(() => {
  const withvalue = daysRef.value.offsetWidth / days.value.length

  cellWidth.value = `${withvalue}px`
  cellWidthNumber.value = withvalue
})

// Reservation Item Width
const getReservationWidth = reservation => {
  const given = moment(reservation.start_date)
  const current = moment(reservation.end_date)

  const width = (moment.duration(current.diff(given)).asDays() + 1) * cellWidthNumber.value

  return `${width - 40}px`
}

// Reservation Item Left Position
const getLeftPosition = reservation => {
  const startIndex = days.value.findIndex(r => reservation.start_date == r)
  const endIndex = days.value.findIndex(r => reservation.end_date == r)

  if (startIndex == -1 && endIndex >= 0) {
    const given = moment(reservation.start_date)
    const current = moment(days.value[0])

    const pos = (moment.duration(current.diff(given)).asDays()) * cellWidthNumber.value
    return `${-pos + 20}px`
  }

  const pos = startIndex * cellWidthNumber.value
  return `${pos + 20}px`
}

// Reservation Item Background
const getStatus = (val) => {
  if (val == 'Reserved') return 'info'
  if (val == 'Confirmed') return 'primary'
  if (val == 'Rented') return 'warning'
  if (val == 'Completed') return 'success'
  if (val == 'Cancelled') return 'danger'
  if (val == 'Declined') return 'danger'
  if (val == 'Expired') return 'grey'

  return 'primary'
}


// Get Visibility
const getReservationVisibility = reservation => {
  const startIndex = days.value.findIndex(r => reservation.start_date == r)
  const endIndex = days.value.findIndex(r => reservation.end_date == r)
  const startDiff = moment(reservation.start_date).diff(days.value[0])
  const endDiff = moment(reservation.end_date).diff(days.value[days.value.length - 1])


  if (startDiff < 0 && endDiff > 0) {
    return true
  }

  if (startIndex == -1 && endIndex == -1) {
    return false
  }

  return true
}

// Empty Border
const getEmptyBorderPos = i => {
  const pos = cellWidthNumber.value * i
  return `${pos}px`
}

const addDayToList = (current, total) => {
  days.value = []
  const currentMoment = moment(current).subtract(total, 'days')
  const endMoment = moment(current).add(1, 'days')
  while (currentMoment.isBefore(endMoment, 'day')) {
    days.value.push(currentMoment.format('YYYY-MM-DD'))

    currentMoment.add(1, 'days')
  }
}

// Watch for Filter
watch(() => [activeFilter.value, activeDate.value], () => {
  nextTick(() => {
    reRenderCalender()
    const totalWidth = daysRef.value.offsetWidth / days.value.length
    cellWidth.value = `${totalWidth}px`
    cellWidthNumber.value = totalWidth
  })

  if (activeFilter.value == 1) {
    addDayToList(moment(activeDate.value).add(6, 'days').format('YYYY-MM-DD'), 6)
  } else {
    addDayToList(moment(activeDate.value).add(14, 'days').format('YYYY-MM-DD'), 14)
  }

}, { immediate: true })

// Go Next days
const goNextDays = () => {
  if (activeFilter.value == 1) {
    addDayToList(moment(days.value[6]).add(6, 'days').format('YYYY-MM-DD'), 6)
  } else {
    addDayToList(moment(days.value[14]).add(14, 'days').format('YYYY-MM-DD'), 14)
  }

  reRenderCalender()
}
// Go Prev days
const goPreviousDays = () => {
  if (activeFilter.value == 1) {
    addDayToList(days.value[0], 6)
  } else {
    addDayToList(days.value[0], 14)
  }

  reRenderCalender()
}

const editForm = reactive({
  data: {
    id: '',
    reservation_no: '',

    vehicle_id: '',
    start_date: '',
    start_time: '',
    return_date: '',
    return_time: '',
    reservation_status: '',
    to_pay: '',
  }
})

const detailsModalStatus = ref(false)
const editModalStatus = ref(false)
const editingState = ref(false)

const editCaldendar = () => {
  editModalStatus.value = true
  reservationActionStatus.value = false
}
const opendetailsModal = () => {
  detailsModalStatus.value = true
  reservationActionStatus.value = false
}

const onEditCalendar = async () => {
  try {
    editingState.value = true
    await api.post(`admin/calendar/reservationupdate/${editForm.data.id}`, editForm.data)
    await reFetch()
    reRenderCalender()

    toast.success(`${t('toast.updateText')}`)
    editModalStatus.value = false
  }
  catch (error) {
    toast.error(`${t('toast.failureUpdateText')}`)
  }
  finally {
    editingState.value = false
  }
}

// Deleting
const activeDeleteId = ref()
const deleteModalStatus = ref(false)
const deleteState = ref(false)
const deleteCalendar = (data) => {
  Object.assign(editForm.data, data)
  deleteModalStatus.value = true

  activeDeleteId.value = data.id
  reservationActionStatus.value = false
}

const onDeleteCalendar = async () => {
  try {
    await api.delete(`admin/reservation/delete/${editForm.data.id}`)
    reFetch()
    deleteState.value = true

    deleteModalStatus.value = false
    toast.success(`${t('toast.deleteText')}`)
  } catch (error) {
    toast.error(`${t('toast.failureDeleteText')}`)
  }
  finally {
    deleteState.value = false
  }
}

// Mouse Cursor position
const mouseCursorPosition = reactive({
  clientY: 0,
  clientX: 0,
})

// Action position
const actionPositionleft = ref('0px')
const actionPositiontop = ref('0px')

// Drag Start
const dragingState = ref(false)
const currentDragEl = ref(null)
const allDragableEl = ref([])
const swapModalStatus = ref(false)
const swapData = ref(null)
const dragStartPos = reactive({ left: '', top: '' })

const onDragStart = (e, vId, reservation) => {
  dragingState.value = true
  reservationActionStatus.value = false
  dragStartPos.left = e.left
  dragStartPos.top = e.top

  const currentEl = document.querySelector(`.vehicle_id_${vId}.reservation_id_${reservation.id}`)
  currentDragEl.value = currentEl
  currentEl.classList.remove('show_resize_icon')

  allDragableEl.value = [...document.querySelectorAll(`.reservation__item:not(.vehicle_id_${vId}.reservation_id_${reservation.id})`)].map(el => {
    const rect = el.getBoundingClientRect()

    return {
      el,
      rect: {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
      },
      vehicleId: el.getAttribute('data-vehicleid'),
      reservationId: el.getAttribute('data-reservationid'),
      reservationNo: el.getAttribute('data-reservationno')
    }
  })
}

// Drag Move
const onDragMove = (e, vId, reservation) => {
  const pos = currentDragEl.value.getBoundingClientRect()

  // Find swap Element
  const find = allDragableEl.value.find(item => {
    const topLogic = pos.top + pos.height >= item.rect.top && pos.top <= item.rect.top + item.rect.height
    const leftLogic = pos.left + pos.width >= item.rect.left && pos.left <= item.rect.left + item.rect.width

    return topLogic && leftLogic
  })

  const removeClasses = () => document.querySelectorAll('.dragover__active').forEach(el => el.classList.remove('dragover__active'))
  if (find) {
    removeClasses()
    find.el.classList.add('dragover__active')

    swapData.value = {
      from_vechile_id: vId,
      reservation_from: reservation.id,
      to_vechile_id: Number(find.vehicleId),
      reservation_to: Number(find.reservationId),
      reservation_form_no: reservation.reservation_no,
      reservation_to_no: Number(find.reservationNo)
    }
  } else {
    removeClasses()
    swapData.value = null
  }

}

// Drag End
const onDragEnd = (e, vId, reservation) => {
  dragingState.value = false
  if (swapData.value) {
    swapModalStatus.value = true
  } else {
    const pos = currentDragEl.value.getBoundingClientRect()
    const wrapperpos = document.querySelector('.reservation__wrapper').getBoundingClientRect()
    const leftcell = Math.floor(e.left / cellWidthNumber.value)
    const rightCell = Math.floor((e.left + e.width) / cellWidthNumber.value)
    const startDate = days.value[leftcell]
    const endDate = days.value[rightCell]

    const topIndex = Math.floor((pos.top - wrapperpos.top + (pos.height / 2)) / rowHeight.value)
    const vehicleId = calenderData.value.vehicles[topIndex]?.id

    if (startDate && endDate && vehicleId) {
      const ifNoChanges = startDate != reservation.start_date || endDate != reservation.end_date || vehicleId != reservation.vehicle_id

      if (ifNoChanges) {
        editForm.data.id = reservation.id
        editForm.data.vehicle_id = vehicleId
        editForm.data.start_date = startDate
        editForm.data.start_time = reservation.start_time
        editForm.data.return_date = endDate
        editForm.data.return_time = reservation.end_time
        editForm.data.reservation_no = reservation.reservation_no
        editForm.data.reservation_status = reservation.reservation_status
        editForm.data.to_pay = reservation.to_pay

        editModalStatus.value = true
        return
      }
    }


    // Edit Form
    if (dragStartPos.top == e.top && dragStartPos.left == e.left) {
      editForm.data.id = reservation.id
      editForm.data.vehicle_id = reservation.vehicle_id
      editForm.data.start_date = reservation.start_date
      editForm.data.start_time = reservation.start_time
      editForm.data.return_date = reservation.end_date
      editForm.data.return_time = reservation.end_time
      editForm.data.reservation_no = reservation.reservation_no
      editForm.data.reservation_status = reservation.reservation_status
      editForm.data.to_pay = reservation.to_pay

      actionPositionleft.value = `${mouseCursorPosition.clientX}px`
      actionPositiontop.value = `${mouseCursorPosition.clientY}px`

      reservationActionStatus.value = true
    } else {
      reRenderCalender()
    }
  }
}

// Apply swap
const swapLoading = ref(false)
const applySwap = async () => {
  try {
    swapLoading.value = true
    await api.post('admin/reservation/calendar-reservationmove', swapData.value)

    swapModalStatus.value = false

    await reFetch()
    reRenderCalender()
  } catch (error) {
    console.error(error)
  } finally {
    swapLoading.value = false
  }
}

// Cancle Swap
const closeSwapModal = () => {
  swapModalStatus.value = false
  swapData.value = null
  reRenderCalender()

  clearErrors()
}

// Resizing
const startResizePos = ref({})
const resizingState = ref(false)
const resizeConfirmModal = ref(false)
const changingDate = ref(false)
const resizeStartDate = ref()
const resizeEndDate = ref()
const prevStartDate = ref()
const prevEndDate = ref()
const resizeReservationId = ref()
const resizeVehicleId = ref()
const resizeStartTime = ref()
const resizeEndTime = ref()

const onResizeStart = (e, vId, reservation) => {
  Object.assign(startResizePos.value, { ...e })
  resizingState.value = true
  reservationActionStatus.value = false
  resizeStartDate.value = reservation.start_date
  resizeEndDate.value = reservation.end_date

  resizeVehicleId.value = vId
  resizeStartTime.value = reservation.start_time
  resizeEndTime.value = reservation.end_time

}

const increaseableValue = ref(0)
const descableValue = ref(0)
const onResizeMove = (e, vId, reservation) => {
  const itemEl = document.querySelector(`.vehicle_id_${vId}.reservation_id_${reservation.id}`)
  itemEl.classList.add('show_resize_icon')

  const wt = e.width - startResizePos.value.width
  if (wt > increaseableValue.value) {
    increaseableValue.value = wt
  }

  // Right side changes
  if (startResizePos.value.left === e.left) {
    itemEl.classList.add('show_resize_content', 'right')
    const dt = Math.ceil(Math.abs(wt - 20) / cellWidthNumber.value)

    // End Date Change
    if (e.width > startResizePos.value.width) {
      if (wt > 20) {
        resizeEndDate.value = moment(reservation.end_date).add(dt, 'days').format('YYYY-MM-DD')
      }

      // Reset date
      if (wt > 0 && wt < 20 && increaseableValue.value > 20) {
        if (moment(resizeEndDate.value).diff(reservation.end_date, 'days') > 0) {
          // resizeEndDate.value = moment(resizeEndDate.value).subtract(dt, 'days').format('YYYY-MM-DD')
          resizeEndDate.value = reservation.end_date
        }
      }

    }
    // Start Date Change
    else {
      const minusWt = Math.abs(wt)
      const minusDt = Math.ceil((minusWt + 20 - cellWidthNumber.value) / cellWidthNumber.value)

      if (minusWt > descableValue.value) {
        descableValue.value = minusWt
      }

      if (minusWt + 20 > cellWidthNumber.value) {
        resizeEndDate.value = moment(reservation.end_date).subtract(minusDt, 'days').format('YYYY-MM-DD')
      }

      if (minusWt < cellWidthNumber.value - 20 && descableValue.value > cellWidthNumber.value - 20) {
        if (Math.abs(moment(resizeEndDate.value).diff(reservation.end_date, 'days')) > 0) {
          // resizeEndDate.value = moment(resizeEndDate.value).add(dt, 'days').format('YYYY-MM-DD')
          resizeEndDate.value = reservation.end_date
        }
      }
    }

  }
  // Left side changes
  else {
    itemEl.classList.add('show_resize_content', 'left')
    const dt = Math.ceil(Math.abs(wt - 20) / cellWidthNumber.value)

    // Start change
    if (e.width > startResizePos.value.width) {
      if (wt > 20) {
        resizeStartDate.value = moment(reservation.start_date).subtract(dt, 'days').format('YYYY-MM-DD')
      }

      if (wt > 0 && wt < 20 && increaseableValue.value > 20) {
        if (Math.abs(moment(resizeStartDate.value).diff(reservation.start_date, 'days')) > 0) {
          // resizeStartDate.value = moment(resizeStartDate.value).add(dt, 'days').format('YYYY-MM-DD')
          resizeStartDate.value = reservation.start_date
        }
      }

    } else {
      const minusWt = Math.abs(wt)
      const minusDt = Math.ceil((minusWt + 20 - cellWidthNumber.value) / cellWidthNumber.value)

      if (minusWt > descableValue.value) {
        descableValue.value = minusWt
      }

      if (minusWt + 20 > cellWidthNumber.value) {
        resizeStartDate.value = moment(reservation.start_date).add(minusDt, 'days').format('YYYY-MM-DD')
      }

      if (minusWt < cellWidthNumber.value - 20 && descableValue.value > cellWidthNumber.value - 20) {
        if (Math.abs(moment(resizeStartDate.value).diff(reservation.start_date, 'days')) > 0) {
          // resizeStartDate.value = moment(resizeStartDate.value).add(dt, 'days').format('YYYY-MM-DD')
          resizeStartDate.value = reservation.start_date
        }
      }

    }

  }
}
const onResizeEnd = async (e, vId, reservation) => {
  prevStartDate.value = reservation.start_date
  prevEndDate.value = reservation.end_date
  resizeReservationId.value = reservation.id

  if (resizeStartDate.value != reservation.start_date || resizeEndDate.value != reservation.end_date) {
    resizeConfirmModal.value = true

    clearErrors()

    // Right side change
    if (startResizePos.value.left === e.left) {
      const payload = {
        vehicle_id: resizeVehicleId.value,
        start_date: reservation.end_date,
        end_date: resizeEndDate.value,
        start_time: reservation.start_time,
        end_time: reservation.end_time,
        status: 'right',
        reservation_id: reservation.id
      }
      try {
        await api.post(`/admin/reservation/datefromdatetodatecheck`, payload)
      } catch (error) {
        console.error(error)
      }
    }
    // Left side change
    else {
      const payload = {
        vehicle_id: resizeVehicleId.value,
        start_date: resizeStartDate.value,
        end_date: reservation.start_date,
        start_time: reservation.start_time,
        end_time: reservation.end_time,
        status: 'left',
        reservation_id: reservation.id
      }
      try {
        await api.post(`/admin/reservation/datefromdatetodatecheck`, payload)
      } catch (error) {
        console.error(error)
      }
    }

  } else {
    reRenderCalender()
  }
}

const closeresizeModal = () => {
  resizeConfirmModal.value = false
  reRenderCalender()

  clearErrors()
}

const applyChangeDate = async () => {
  try {
    changingDate.value = true

    await api.post('admin/reservation/calendar-datechange', {
      reservation_id: resizeReservationId.value,
      from_date: resizeStartDate.value,
      to_date: resizeEndDate.value,
      vehicleId: resizeVehicleId.value
    })

    await reFetch()

    closeresizeModal()
  } catch (error) {
    // reRenderCalender()
  } finally {
    changingDate.value = false
  }
}

const onMouseMoveTodocument = (e) => {
  mouseCursorPosition.clientX = e.clientX
  mouseCursorPosition.clientY = e.clientY
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMoveTodocument)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMoveTodocument)
})


const showResizeIcon = (e, vId, rId) => {
  const targetEl = document.querySelector(`.vehicle_id_${vId}.reservation_id_${rId}`)

  if (!dragingState.value)
    targetEl.classList.add('show_resize_icon')
}
const hideResizeIcon = (e, vId, rId) => {
  const targetEl = document.querySelector(`.vehicle_id_${vId}.reservation_id_${rId}`)
  if (!dragingState.value)
    targetEl.classList.remove('show_resize_icon')
}

const visitReservation = () => {
  detailsModalStatus.value = false
  router.push(`/reservierungen/reservierungsvorschau/${editForm.data.id}`)
}

const onCalendarScroll = (e) => {
  calendarScrollTopPosition.value = e.target.scrollTop
  if (reservationActionStatus.value) {
    reservationActionStatus.value = false
  }
}

const whenEditModalClose = () => {
  clearErrors()

  reRenderCalender()
}

</script>

<template>
  <!-- <pre>{{ calenderData }}</pre> -->

  <!-- Header -->
  <div class="row mb-4">
    <div class="col-lg-6 col-md-12">
      <div class="d-flex align-items-center">
        <CalenderControl v-model="activeDate" class="el-w-220">
          <template #apend-icon>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.8333 3.33331H4.16667C3.24619 3.33331 2.5 4.07951 2.5 4.99998V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99998C17.5 4.07951 16.7538 3.33331 15.8333 3.33331Z"
                stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13.3333 1.66669V5.00002" stroke="#666666" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M6.66669 1.66669V5.00002" stroke="#666666" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M2.5 8.33331H17.5" stroke="#666666" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </template>
        </CalenderControl>

        <SelectControl v-model="activeFilter" :options="filters" placeholder="Filter By" class="ms-2 el-w-220" />

        <div class="ms-4 color-code dropdown">
          <a class="" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
            <svg width="48" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 34C29.5228 34 34 29.5228 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34Z"
                fill="black" fill-opacity="0.5" />
              <path d="M24 28V24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M24 20H24.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#EEEEEE" />
            </svg>
          </a>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            <li class="dropdown-item d-flex mb-4">
              <div class="color-box info-bg"></div>
              <div class="text-14 fw-400 text-dark ms-4">{{t('form-fields.reserved')}}</div>
            </li>
            <li class="dropdown-item d-flex mb-4">
              <div class="color-box warning-bg"></div>
              <div class="text-14 fw-400 text-dark ms-4">{{t('form-fields.rented')}}</div>
            </li>
            <li class="dropdown-item d-flex mb-4">
              <div class="color-box primary-bg"></div>
              <div class="text-14 fw-400 text-dark ms-4">{{t('form-fields.confirmed')}}</div>
            </li>
            <li class="dropdown-item d-flex mb-4">
              <div class="color-box success-bg"></div>
              <div class="text-14 fw-400 text-dark ms-4">{{t('form-fields.completed')}}</div>
            </li>
            <li class="dropdown-item d-flex mb-4">
              <div class="color-box danger-bg"></div>
              <div class="text-14 fw-400 text-dark ms-4">{{t('form-fields.cancelled')}}</div>
            </li>
            <!-- <li class="dropdown-item d-flex">
              <div class="color-box grey-bg"></div> 
              <div class="text-14 fw-400 text-dark ms-4">{{t('text.expired')}}</div>
            </li> -->
          </ul>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="d-flex justify-content-end align-items-center calander-m__header">
        <div class="simple_search">
          <input type="text" :placeholder="t('form-fields.search')">
          <div class="prepend_icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#555555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M21 21L16.65 16.65" stroke="#555555" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <div class="ms-3">
          <svg width="45" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    </div>
  </div>

  <!-- Arrow Controller -->
  <div class="row">
    <div class="col-3"></div>
    <div class="col-9">
      <div class="row">
        <div class="col">
          <svg @click="goPreviousDays" class="pointer" width="25" height="25" viewBox="0 0 25 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M19.332 12.0972H5.33203" stroke="black" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M12.332 19.0972L5.33203 12.0972L12.332 5.09717" stroke="black" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col text-end pe-4">
          <svg @click="goNextDays" class="pointer" width="24" height="25" viewBox="0 0 24 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12.0972H19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 5.09717L19 12.0972L12 19.0972" stroke="black" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Calender  -->
  <div :key="calendarKey" @scroll="onCalendarScroll" class="calender__wrapper">
    <div class="row">
      <!-- Vehicle -->
      <div class="col-3 pe-0">
        <p class="sticky-top bg-white d-flex justify-content-center align-items-center mb-0 fw-500 top_height"
          style="color: #333333; border-bottom: 1px solid #ddd">
          {{t('Calendar.vehicles')}}
        </p>

        <div v-for="(vehicle, i) in calenderData?.vehicles || []" :key="i" class="d-flex vehicle_row w-100">
          <div class="d-flex p-3 vehicle_div w-100">
            <img v-if="vehicle.picture" :src="imageBaseUrl(`/documents/${vehicle.picture}`)" alt="Vehicle" class="rounded" style="width: 115px; height:73px">
            <img v-else src="../../../assets/images/carPlaceholder.svg" alt="Vehicle" class="rounded" style="width: 115px; height:73px">
            <div class="ms-3">
              <h6 class="mb-1">{{vehicle.vehicle_name}}</h6>
              <div class="text-12 mb-3">{{ vehicle.model }}</div>
              <!-- <div class="text-14"><span class="green__dot me-2"></span> {{ vehicle.reservations.length }} </div> -->
            </div>
          </div>
        </div>
      </div>
      <!-- Reservation -->
      <div class="col-9 ps-0">
        <!-- Days -->
        <div ref="daysRef" class="days__wrapper sticky-top bg-white top_height" style="border-bottom: 1px solid #ddd;">
          <div v-for="(day, i) in days" :key="i" class="day__item">
            <p class="text-12 fw-500 mb-0" style="color:#B2B2B2">{{ moment(day).format('ddd') }}</p>
            <p class="mb-0 text-14 fw-500" style="color:#333333">{{ moment(day).format('DD MMM') }}</p>
          </div>
        </div>

        <div class="reservation__wrapper">
          <div v-for="(vehicle, i) in calenderData?.vehicles || []" :key="i" class="vehicle_row">
            <!-- Reservation Item Loop -->
            <div v-for="(reservation, i) in vehicle.reservations" :key="i"
              @mouseenter="showResizeIcon($event, vehicle.id, reservation.id)"
              @mouseleave="hideResizeIcon($event, vehicle.id, reservation.id)" class="reservation-loop-item">
              <VueResizable @resize:start="onResizeStart($event, vehicle.id, reservation)"
                @resize:move="onResizeMove($event, vehicle.id, reservation)"
                @resize:end="onResizeEnd($event, vehicle.id, reservation)"
                @drag:start="onDragStart($event, vehicle.id, reservation)"
                @drag:move="onDragMove($event, vehicle.id, reservation)"
                @drag:end="onDragEnd($event, vehicle.id, reservation)" dragSelector=".reservation__item"
                v-if="getReservationVisibility(reservation)" :active="['l', 'r']"
                :width="getReservationWidth(reservation)" :left="getLeftPosition(reservation)" top="25px">
                <div class="reservation__item"
                  :class="`vehicle_id_${vehicle.id} reservation_id_${reservation.id} ${getStatus(reservation.reservation_status)}`"
                  :data-vehicleid="vehicle.id" :data-reservationid="reservation.id"
                  :data-reservationno="reservation.reservation_no">
                  <div class="text-center px-md-3 px-sm-1">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_4660_1133)">
                        <path
                          d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
                          stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 13.3333V10" stroke="black" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                        <path d="M10 6.66663H10.0083" stroke="black" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round" />
                      </g>
                      <defs>
                        <clipPath id="clip0_4660_1133">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p class="mb-0 mt-2 text-10">ID #{{ reservation.reservation_no }}</p>
                  </div>
                  <div class="mx-2">
                    <p class="mb-2 text-12 fw-500">
                      <span class="">{{t('Calendar.start')}}</span>:
                      <span v-if="locale == 'en'">{{ moment(reservation.start_time, "HH:mm:ss").format("hh:mm A") }},
                      </span>
                      <span v-if="locale == 'de'">{{ moment(reservation.start_time, "HH:mm:ss").format("HH:mm") }},
                      </span>
                      <span class="" v-if="locale == 'en'">{{ moment(reservation.start_date).format('DD/MM/YYYY')
                      }}</span>
                      <span class="" v-if="locale == 'de'">{{ moment(reservation.start_date).format('DD.MM.YYYY')
                      }}</span>
                    </p>
                    <p class="mb-0 text-12 fw-500">
                      <span class="">{{t('Calendar.end')}}</span>:
                      <span v-if="locale == 'en'">{{ moment(reservation.end_time, "HH:mm:ss").format("hh:mm A")
                      }},</span>
                      <span v-if="locale == 'de'">{{ moment(reservation.end_time, "HH:mm:ss").format("HH:mm") }},</span>
                      <span class="" v-if="locale == 'en'">{{ moment(reservation.end_date).format('DD/MM/YYYY')
                      }}</span>
                      <span class="" v-if="locale == 'de'">{{ moment(reservation.end_date).format('DD.MM.YYYY')
                      }}</span>
                    </p>
                  </div>
                  <div class="ms-3 text-center">
                    <p class="mb-2 text-10">{{t('form-fields.price')}}</p>
                    <p class="mb-0 text-14 fw-500">{{moneyFormat(reservation.to_pay, locale)}}</p>
                  </div>
                </div>
                <!-- Resize Date -->
                <span class="resize_date start">{{ moment(resizeStartDate).format('DD MMM YYYY') }}</span>
                <span class="resize_date end">{{ moment(resizeEndDate).format('DD MMM YYYY') }}</span>
                <!-- <span class="status-div text-white text-12 fw-500"> {{reservation.reservation_status}} </span> -->
              </VueResizable>
            </div>

            <!-- Empty Border Div -->
            <div v-for="(day, i) in days" :key="day" :style="{left: getEmptyBorderPos(i)}" class="empty_border"></div>
          </div>
          <!-- End Reservation Wrapper -->
        </div>

        <div v-if="reservationActionStatus" v-click-outside="() => reservationActionStatus = false"
          class="reservation__action">
          <ul>
            <li @click="opendetailsModal">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_258_3207)">
                  <path
                    d="M0.666664 8.00008C0.666664 8.00008 3.33333 2.66675 8 2.66675C12.6667 2.66675 15.3333 8.00008 15.3333 8.00008C15.3333 8.00008 12.6667 13.3334 8 13.3334C3.33333 13.3334 0.666664 8.00008 0.666664 8.00008Z"
                    stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                    stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_258_3207">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span class="ms-4 text-14">{{ $t("form-fields.view") }}</span>
            </li>
            <li @click="editCaldendar()" class="">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1738 1.49653 12.419 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5035 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5035 3.82619 14.4088 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z"
                  stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-4 text-14">{{ $t("button.edit") }}</span>
            </li>
            <li @click="deleteCalendar()" class="">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H3.33333H14" stroke="#B2B2B2" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M5.33334 3.99992V2.66659C5.33334 2.31296 5.47381 1.97382 5.72386 1.72378C5.97391 1.47373 6.31305 1.33325 6.66667 1.33325H9.33334C9.68696 1.33325 10.0261 1.47373 10.2761 1.72378C10.5262 1.97382 10.6667 2.31296 10.6667 2.66659V3.99992M12.6667 3.99992V13.3333C12.6667 13.6869 12.5262 14.026 12.2761 14.2761C12.0261 14.5261 11.687 14.6666 11.3333 14.6666H4.66667C4.31305 14.6666 3.97391 14.5261 3.72386 14.2761C3.47381 14.026 3.33334 13.6869 3.33334 13.3333V3.99992H12.6667Z"
                  stroke="#B2B2B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span class="ms-4 text-14">{{ $t("button.delete") }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Loading -->
    <Loading v-if="loading" class="my-3" />

    <!-- <p v-if="!loading && !calenderData?.vehicles?.length" class="text-center mt-3">No Data found!</p> -->
    <div v-if="!loading && !calenderData?.vehicles?.length"
      class="my-5 d-flex flex-column align-items-center justify-content-center w-100 h-100">
      <div class="icon mb-4">
        <svg width="132" height="128" viewBox="0 0 132 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4322_1348)">
            <path
              d="M116.535 14.9965C95.915 -4.99851 62.3639 -4.99851 41.7441 14.9965C21.7356 34.3989 21.1425 65.6077 39.9648 85.7103L32.8352 92.6238L28.989 88.8941C28.5055 88.4253 27.8495 88.1617 27.1656 88.1617C26.4818 88.1617 25.8258 88.4253 25.3423 88.8941L3.10387 110.459C1.10236 112.4 0 114.98 0 117.725C0 120.47 1.10236 123.05 3.10361 124.991C5.10513 126.931 7.76625 128 10.5965 128C13.4271 128 16.0879 126.931 18.0895 124.991L40.3282 103.426C40.8116 102.957 41.0834 102.321 41.0834 101.658C41.0834 100.995 40.8116 100.359 40.3282 99.8899L36.4819 96.1602L43.6115 89.2467C53.6601 98.0938 66.3999 102.517 79.1396 102.517C92.6824 102.517 106.225 97.5187 116.535 87.5211C137.155 67.5258 137.155 34.9915 116.535 14.9965ZM14.4428 121.454C13.4155 122.45 12.0496 122.999 10.5965 122.999C9.14375 122.999 7.7776 122.451 6.75028 121.454C5.72296 120.458 5.15722 119.134 5.15722 117.725C5.15722 116.316 5.72296 114.991 6.75054 113.995L27.1656 94.1983L34.8582 101.658L14.4428 121.454ZM112.888 83.9847C94.2794 102.03 64 102.03 45.391 83.9849C26.7817 65.9395 26.7817 36.5778 45.3907 18.5327C54.6954 9.50996 66.9177 4.99862 79.1396 4.99862C91.3616 4.99862 103.584 9.50996 112.888 18.5327C131.497 36.5778 131.497 65.9395 112.888 83.9847Z"
              fill="black" />
            <path
              d="M120.609 50.7703C120.39 49.7248 119.496 48.9137 118.403 48.7784C117.33 48.6456 116.245 49.2082 115.771 50.1526C115.305 51.0806 115.473 52.2138 116.203 52.9689C116.94 53.7311 118.118 53.9659 119.106 53.552C120.205 53.0919 120.848 51.9095 120.609 50.7703Z"
              fill="black" />
            <path
              d="M117.047 60.2998C115.688 59.8842 114.24 60.6151 113.812 61.9321C112.046 67.3589 109.036 72.161 104.866 76.2053C97.9941 82.8685 88.8579 86.5385 79.1396 86.5385C69.4216 86.5385 60.2851 82.8688 53.4134 76.2053C39.2282 62.4497 39.2282 40.068 53.4134 26.3124C60.2851 19.6489 69.4216 15.9792 79.1396 15.9792C88.8579 15.9792 97.9941 19.6489 104.866 26.3124C108.989 30.3112 112.088 35.2626 113.827 40.6311C114.253 41.9489 115.701 42.6812 117.059 42.2674C118.418 41.8538 119.174 40.4501 118.747 39.1326C116.76 32.9984 113.221 27.3424 108.512 22.776C100.667 15.1678 90.2351 10.9781 79.1396 10.9781C68.0441 10.9781 57.6126 15.1678 49.7667 22.776C33.5704 38.4815 33.5704 64.036 49.7667 79.7415C57.6126 87.3494 68.0439 91.5394 79.1396 91.5394C90.2354 91.5394 100.667 87.3496 108.512 79.7415C113.208 75.1886 116.741 69.5505 118.73 63.4369C119.158 62.1196 118.405 60.7151 117.047 60.2998Z"
              fill="black" />
            <path
              d="M63.3147 66.6042C66.6483 69.8368 72.0726 69.8368 75.4063 66.6042L79.1398 62.9838L82.8731 66.6042C84.54 68.2205 86.7295 69.0287 88.919 69.0287C91.1084 69.0287 93.2979 68.2205 94.9648 66.6042C98.2984 63.3716 98.2984 58.1116 94.9648 54.879L91.2312 51.2586L94.9648 47.6382C98.2984 44.4056 98.2984 39.1458 94.9648 35.913C91.6311 32.6804 86.2068 32.6804 82.8731 35.913L79.1396 39.5337L75.406 35.913C72.0721 32.6804 66.6483 32.6804 63.3144 35.913C59.9808 39.1456 59.9808 44.4056 63.3147 47.6382L67.0482 51.2586L63.3144 54.879C59.981 58.1114 59.9808 63.3714 63.3147 66.6042ZM66.9613 58.4152L72.5182 53.0267C73.0017 52.5578 73.2735 51.9217 73.2735 51.2586C73.2735 50.5955 73.0017 49.9594 72.5182 49.4905L66.9613 44.102C65.6385 42.8193 65.6385 40.7321 66.9613 39.4494C68.2839 38.1669 70.4368 38.1666 71.7593 39.4494L77.3162 44.8379C77.8 45.307 78.4557 45.5703 79.1396 45.5703C79.8234 45.5703 80.4794 45.3067 80.9629 44.8379L86.5198 39.4494C87.8426 38.1666 89.9953 38.1666 91.3178 39.4494C92.6407 40.7321 92.6407 42.8193 91.3178 44.102L85.7609 49.4905C85.2774 49.9594 85.0057 50.5955 85.0057 51.2586C85.0057 51.9217 85.2774 52.5578 85.7609 53.0267L91.3178 58.4152C92.6407 59.6979 92.6407 61.7851 91.3178 63.0678C89.9955 64.3506 87.8429 64.3508 86.5198 63.0678L80.9629 57.6793C80.4794 57.2102 79.8234 56.9469 79.1396 56.9469C78.4557 56.9469 77.7997 57.2105 77.3162 57.6793L71.7593 63.0678C70.4368 64.3506 68.2841 64.3506 66.9613 63.0678C65.6385 61.7851 65.6382 59.6979 66.9613 58.4152Z"
              fill="black" />
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
      <div class="text-25 fw-400 pointer" style="font-size: 25px; color: #276EF1;">
        <app-link path="/reservierungen/erstellen">{{t('button.click-here-to-create-a-new-record')}}</app-link>
      </div>
    </div>

  </div>

  <!-- Swap Modal / Drag and Drop -->
  <ModalControl v-model="swapModalStatus" @onHide="closeSwapModal">
    <div class="modal-header mx-0 ps-4">
      <p class="mb-1">{{t('Calendar.swap-events')}}</p>
    </div>

    <div class="modal-body">
      <div class="row align-items-center">
        <div class="col-1">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z"
              stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.3335 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.6665 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M2.5 8.33325H17.5" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col-5">
          <!-- <input type="text" :value="`ID #${swapData?.reservation_form_no}`" class="form-control" readonly> -->
          <InputControl :modelValue="`ID #${swapData?.reservation_form_no}`" readonly />
        </div>
        <div class="col-1">
          <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.4001 20.1995L3.2002 20.1995" stroke="#666666" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M7.14282 24.9995L2 19.8567L7.14282 14.7139" stroke="#666666" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6 5.80005L21.1999 5.80005" stroke="#666666" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M16.7427 1L21.8855 6.14282L16.7427 11.2856" stroke="#666666" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col-5">
          <!-- <input type="text" :value="`ID #${swapData?.reservation_to_no}`" class="form-control" readonly> -->
          <InputControl :modelValue="`ID #${swapData?.reservation_to_no}`" errorField="reservation_to" readonly />
        </div>
      </div>
    </div>

    <div class="modal-footer border-0 mt-2">
      <button @click="closeSwapModal" type="button"
        class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="applySwap" :loading="swapLoading" style="min-width: 180px;">{{t('button.apply')}}
      </PrimaryButton>
    </div>
  </ModalControl>

  <!-- Resize Confirm -->
  <ModalControl v-model="resizeConfirmModal" @onHide="closeresizeModal">
    <div class="modal-header mx-0 ps-4">
      <p class="mb-1">{{t('Calendar.resize-confirm')}}</p>
    </div>

    <div class="modal-body">
      <div class="row align-items-center">
        <div class="col-1">
          Start
        </div>
        <div class="col-5">
          <InputControl :modelValue="moment(prevStartDate).format('DD MMM YYYY')" readonly />
        </div>
        <div class="col-1">
          To
        </div>
        <div class="col-5">
          <InputControl :modelValue="moment(resizeStartDate).format('DD MMM YYYY')" readonly errorField="start_date" />
        </div>
      </div>
      <div class="row align-items-center mt-3">
        <div class="col-1">
          End
        </div>
        <div class="col-5">
          <InputControl :modelValue="moment(prevEndDate).format('DD MMM YYYY')" readonly />
        </div>
        <div class="col-1">
          To
        </div>
        <div class="col-5">
          <InputControl :modelValue="moment(resizeEndDate).format('DD MMM YYYY')" readonly errorField="end_date" />
        </div>
      </div>
    </div>

    <div class="modal-footer border-0 mt-2">
      <button @click="closeresizeModal" type="button"
        class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="applyChangeDate" :disabled="hasErrors" :loading="changingDate" style="min-width: 180px;">
        {{t('button.apply')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Edit Modal -->
  <ModalControl v-model="editModalStatus" @onHide="whenEditModalClose" dialogClass="modal-md">
    <div class="modal-header mx-0 ps-4">
      <p class="mb-1">{{t('Calendar.edit-event')}} ID #{{editForm.data.reservation_no}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <!-- <p class="fw-500">{{t('locationSettings.edit-modal-text')}}</p> -->

      <div class="row mx-0">
        <div class="col-sm-11 offset-sm-1">
          <div class="p mb-2 text-12 fw-500 ps-1">{{t('Calendar.vehicles')}}</div>
        </div>
      </div>
      <div class="row mx-0">
        <div class="col-sm-1 pt-2">
          <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.71458 9.50271C5.71458 10.1201 5.21375 10.6205 4.59639 10.6205C3.97902 10.6205 3.47864 10.1201 3.47864 9.50271C3.47864 8.88536 3.97903 8.38452 4.59639 8.38452C5.21374 8.38452 5.71458 8.88535 5.71458 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M16.3973 9.50271C16.3973 10.1201 15.8969 10.6205 15.2796 10.6205C14.6622 10.6205 14.1614 10.1201 14.1614 9.50271C14.1614 8.88536 14.6622 8.38452 15.2796 8.38452C15.8969 8.38452 16.3973 8.88535 16.3973 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M17.4532 5.40342L16.4593 2.11162C16.0867 0.807092 14.9066 0 13.6021 0H6.21093C4.90641 0 3.78866 0.869512 3.35367 2.11162L2.35982 5.40342C0.993859 6.21098 0 7.70137 0 9.50277V11.9869C0 13.229 0.993851 14.2229 2.23594 14.2229H2.36028V14.2848V15.8996C2.36028 16.3345 2.73287 16.7071 3.16783 16.7071C3.60281 16.7071 3.97539 16.3345 3.97539 15.8996V14.2848V14.2229H16.0246V14.2848V15.8996C16.0246 16.3345 16.3972 16.7071 16.8322 16.7071C17.2671 16.7071 17.6397 16.3345 17.6397 15.8996V14.2848V14.2229H17.7641C19.0061 14.2229 20 13.229 20 11.9869V9.50277C19.8752 7.70137 18.8814 6.21096 17.453 5.40342H17.4532ZM4.22386 4.84454L4.90708 2.54659C5.09338 1.92532 5.65226 1.49079 6.27349 1.49079L13.6646 1.49035C14.2859 1.49035 14.8448 1.92533 15.031 2.54616L15.7143 4.8441H4.72078L4.22386 4.84454ZM18.3227 11.9869C18.3227 12.3595 18.0121 12.6701 17.6395 12.6701H2.23634C1.86375 12.6701 1.55311 12.3595 1.55311 11.9869V9.50276C1.55311 7.76369 2.91952 6.39728 4.65858 6.39728H15.2171C16.8941 6.39728 18.3225 7.76369 18.3225 9.50276L18.3227 11.9869Z"
              fill="#B2B2B2" />
          </svg>
        </div>
        <div class="col-sm-11" v-show="vehicleData">
          <SelectControl v-model="editForm.data.vehicle_id" :options="vehicleData?.data || []"
            optionLabel="vehicle_name" class="mb-3" />
        </div>
      </div>
      <div class="row mx-0 mt-2">
        <div class="col-sm-1"></div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6 ">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.start')}}</div>
            </div>
            <div class="col-sm-6">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.end')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mx-0 pt-2">
        <div class="col-sm-1 pt-2 ">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z"
              stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.3334 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.66663 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M2.5 8.33325H17.5" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6">
              <CalenderControl v-model="editForm.data.start_date" class="" errorField="start_date" />
            </div>
            <div class="col-sm-6">
              <!-- <CalenderControl v-model="editForm.data.end_date" class="" errorField="end_date" /> -->
              <CalenderControl v-model="editForm.data.return_date" class="" errorField="end_date" />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.start_time" :options="times[locale]" trackBy="24_hour"
                optionLabel="time" :placeholder="t('form-fields.start-time')" errorField="start_time" caret="clock" />
            </div>
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.return_time" :options="times[locale]" trackBy="24_hour"
                optionLabel="time" :placeholder="t('form-fields.end-time')" errorField="end_time" caret="clock" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="editModalStatus = false" type="button"
        class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="onEditCalendar" style="min-width: 180px;" :loading="editingState">{{t('button.apply')}}
      </PrimaryButton>
    </div>
  </ModalControl>

  <!-- Details Modal -->
  <ModalControl v-model="detailsModalStatus" dialogClass="modal-md">
    <div class="modal-header mx-0 ps-4">
      <div>
        <p class="mb-0">{{t('generalSettings.reservation')}}</p>
        <p class="mb-0 text-12 fst-italic">#{{editForm.data?.reservation_no}}</p>
      </div>
      <div> 
        <StatusButton :type="getStatus(editForm.data?.reservation_status)">
          <span v-if="editForm.data?.reservation_status == 'Reserved'">{{ t('form-fields.reserved') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Rented'">{{ t('form-fields.rented') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Cancelled'">{{ t('form-fields.cancelled') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Completed'">{{ t('form-fields.completed') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Confirmed'">{{ t('form-fields.confirmed') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Declined'">{{ t('requests.declined') }}</span>
          <span v-if="editForm.data?.reservation_status == 'Expired'">{{ t('text.expired') }}</span>
        </StatusButton>
      </div>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <div class="row mx-0">
        <div class="col-sm-11 offset-sm-1">
          <div class="p mb-2 text-12 fw-500 ps-1">{{t('Calendar.vehicles')}}</div>
        </div>
      </div>
      <div class="row mx-0">
        <div class="col-sm-1 pt-2">
          <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.71458 9.50271C5.71458 10.1201 5.21375 10.6205 4.59639 10.6205C3.97902 10.6205 3.47864 10.1201 3.47864 9.50271C3.47864 8.88536 3.97903 8.38452 4.59639 8.38452C5.21374 8.38452 5.71458 8.88535 5.71458 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M16.3973 9.50271C16.3973 10.1201 15.8969 10.6205 15.2796 10.6205C14.6622 10.6205 14.1614 10.1201 14.1614 9.50271C14.1614 8.88536 14.6622 8.38452 15.2796 8.38452C15.8969 8.38452 16.3973 8.88535 16.3973 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M17.4532 5.40342L16.4593 2.11162C16.0867 0.807092 14.9066 0 13.6021 0H6.21093C4.90641 0 3.78866 0.869512 3.35367 2.11162L2.35982 5.40342C0.993859 6.21098 0 7.70137 0 9.50277V11.9869C0 13.229 0.993851 14.2229 2.23594 14.2229H2.36028V14.2848V15.8996C2.36028 16.3345 2.73287 16.7071 3.16783 16.7071C3.60281 16.7071 3.97539 16.3345 3.97539 15.8996V14.2848V14.2229H16.0246V14.2848V15.8996C16.0246 16.3345 16.3972 16.7071 16.8322 16.7071C17.2671 16.7071 17.6397 16.3345 17.6397 15.8996V14.2848V14.2229H17.7641C19.0061 14.2229 20 13.229 20 11.9869V9.50277C19.8752 7.70137 18.8814 6.21096 17.453 5.40342H17.4532ZM4.22386 4.84454L4.90708 2.54659C5.09338 1.92532 5.65226 1.49079 6.27349 1.49079L13.6646 1.49035C14.2859 1.49035 14.8448 1.92533 15.031 2.54616L15.7143 4.8441H4.72078L4.22386 4.84454ZM18.3227 11.9869C18.3227 12.3595 18.0121 12.6701 17.6395 12.6701H2.23634C1.86375 12.6701 1.55311 12.3595 1.55311 11.9869V9.50276C1.55311 7.76369 2.91952 6.39728 4.65858 6.39728H15.2171C16.8941 6.39728 18.3225 7.76369 18.3225 9.50276L18.3227 11.9869Z"
              fill="#B2B2B2" />
          </svg>
        </div>
        <div class="col-sm-11" v-show="vehicleData">
          <SelectControl v-model="editForm.data.vehicle_id" disabled :options="vehicleData?.data || []"
            optionLabel="vehicle_name" class="mb-3" />
        </div>
      </div>
      <div class="row mx-0">
        <div class="col-sm-1 pt-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.94238 1.19202C5.11035 1.19202 1.19238 5.10999 1.19238 9.94202C1.19238 14.774 5.11035 18.692 9.94238 18.692C14.7744 18.692 18.6924 14.774 18.6924 9.94202C18.6924 5.10999 14.7744 1.19202 9.94238 1.19202ZM9.94238 17.2076C5.93066 17.2076 2.67676 13.9537 2.67676 9.94202C2.67676 5.9303 5.93066 2.67639 9.94238 2.67639C13.9541 2.67639 17.208 5.9303 17.208 9.94202C17.208 13.9537 13.9541 17.2076 9.94238 17.2076ZM12.2412 5.71155C11.9307 5.64319 11.5693 5.60608 11.1611 5.60608C9.07715 5.60608 7.66699 6.69397 7.28223 8.53381H6.66113C6.5752 8.53381 6.50488 8.60413 6.50488 8.69006V9.22131C6.50488 9.30725 6.5752 9.37756 6.66113 9.37756H7.17676C7.1709 9.45764 7.1709 9.54163 7.1709 9.62756V10.3483H6.66113C6.5752 10.3483 6.50488 10.4186 6.50488 10.5045V11.0358C6.50488 11.1217 6.5752 11.192 6.66113 11.192H7.25098C7.58691 13.1295 9.0166 14.278 11.1611 14.278C11.5693 14.278 11.9307 14.2448 12.2412 14.1783C12.3135 14.1627 12.3662 14.1002 12.3662 14.026V13.1901C12.3662 13.0924 12.2764 13.0182 12.1807 13.0377C11.8936 13.0924 11.5576 13.1178 11.1689 13.1178C9.83105 13.1178 8.93262 12.403 8.63379 11.192H11.1846C11.2705 11.192 11.3408 11.1217 11.3408 11.0358V10.5045C11.3408 10.4186 11.2705 10.3483 11.1846 10.3483H8.52051V9.64514C8.52051 9.55334 8.52051 9.46155 8.52637 9.37561H11.1807C11.2666 9.37561 11.3369 9.3053 11.3369 9.21936V8.68811C11.3369 8.60217 11.2666 8.53186 11.1807 8.53186H8.6748C9.01074 7.42053 9.8916 6.76624 11.167 6.76624C11.5557 6.76624 11.8916 6.79553 12.1768 6.85217C12.1994 6.85679 12.2228 6.85634 12.2452 6.85083C12.2677 6.84533 12.2886 6.83492 12.3065 6.82035C12.3245 6.80578 12.339 6.78741 12.3489 6.76657C12.3589 6.74573 12.3641 6.72294 12.3643 6.69983V5.86389C12.3643 5.78967 12.3135 5.72717 12.2412 5.71155Z"
              fill="#B2B2B2" />
          </svg>
        </div>
        <div class="col-sm-11">
          <InputControl :modelValue="moneyFormat(editForm.data.to_pay, locale)" disabled class="mb-3" />
        </div>
      </div>
      <div class="row mx-0 mt-2">
        <div class="col-sm-1"></div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6 ">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.start')}}</div>
            </div>
            <div class="col-sm-6">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.end')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mx-0 pt-2">
        <div class="col-sm-1 pt-2 ">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z"
              stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.3334 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.66663 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M2.5 8.33325H17.5" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6">
              <CalenderControl v-model="editForm.data.start_date" disabled class="" errorField="start_date" />
            </div>
            <div class="col-sm-6">
              <CalenderControl v-model="editForm.data.return_date" disabled class="" errorField="start_date" />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.start_time" disabled :options="times[$i18n.locale]"
                trackBy="24_hour" optionLabel="time" placeholder="Start Time" errorField="start_time" caret="clock" />
            </div>
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.return_time" disabled :options="times[$i18n.locale]"
                trackBy="24_hour" optionLabel="time" placeholder="Start Time" errorField="start_time" caret="clock" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="detailsModalStatus = false" type="button"
        class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <PrimaryButton @click="visitReservation" style="min-width: 180px;">{{t('button.more-details')}}</PrimaryButton>
    </div>
  </ModalControl>

  <!-- Delete Modal -->
  <ModalControl v-model="deleteModalStatus" dialogClass="modal-md">
    <div class="modal-header mx-0 ps-4">
      <p class="mb-1">{{t('Calendar.remove-event')}} ID #{{editForm.data.reservation_no}}</p>
    </div>
    <div v-if="editForm.data" class="modal-body">
      <div class="row mx-0">
        <div class="col-sm-11 offset-sm-1">
          <div class="p mb-2 text-12 fw-500 ps-1">{{t('Calendar.vehicles')}}</div>
        </div>
      </div>
      <div class="row mx-0">
        <div class="col-sm-1 pt-2">
          <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.71458 9.50271C5.71458 10.1201 5.21375 10.6205 4.59639 10.6205C3.97902 10.6205 3.47864 10.1201 3.47864 9.50271C3.47864 8.88536 3.97903 8.38452 4.59639 8.38452C5.21374 8.38452 5.71458 8.88535 5.71458 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M16.3973 9.50271C16.3973 10.1201 15.8969 10.6205 15.2796 10.6205C14.6622 10.6205 14.1614 10.1201 14.1614 9.50271C14.1614 8.88536 14.6622 8.38452 15.2796 8.38452C15.8969 8.38452 16.3973 8.88535 16.3973 9.50271Z"
              fill="#B2B2B2" />
            <path
              d="M17.4532 5.40342L16.4593 2.11162C16.0867 0.807092 14.9066 0 13.6021 0H6.21093C4.90641 0 3.78866 0.869512 3.35367 2.11162L2.35982 5.40342C0.993859 6.21098 0 7.70137 0 9.50277V11.9869C0 13.229 0.993851 14.2229 2.23594 14.2229H2.36028V14.2848V15.8996C2.36028 16.3345 2.73287 16.7071 3.16783 16.7071C3.60281 16.7071 3.97539 16.3345 3.97539 15.8996V14.2848V14.2229H16.0246V14.2848V15.8996C16.0246 16.3345 16.3972 16.7071 16.8322 16.7071C17.2671 16.7071 17.6397 16.3345 17.6397 15.8996V14.2848V14.2229H17.7641C19.0061 14.2229 20 13.229 20 11.9869V9.50277C19.8752 7.70137 18.8814 6.21096 17.453 5.40342H17.4532ZM4.22386 4.84454L4.90708 2.54659C5.09338 1.92532 5.65226 1.49079 6.27349 1.49079L13.6646 1.49035C14.2859 1.49035 14.8448 1.92533 15.031 2.54616L15.7143 4.8441H4.72078L4.22386 4.84454ZM18.3227 11.9869C18.3227 12.3595 18.0121 12.6701 17.6395 12.6701H2.23634C1.86375 12.6701 1.55311 12.3595 1.55311 11.9869V9.50276C1.55311 7.76369 2.91952 6.39728 4.65858 6.39728H15.2171C16.8941 6.39728 18.3225 7.76369 18.3225 9.50276L18.3227 11.9869Z"
              fill="#B2B2B2" />
          </svg>
        </div>
        <div class="col-sm-11" v-if="vehicleData">
          <SelectControl v-model="editForm.data.vehicle_id" :options="vehicleData?.data || []"
            optionLabel="vehicle_name" class="mb-3" disabled />
        </div>
      </div>
      <div class="row mx-0 mt-2">
        <div class="col-sm-1"></div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6 ">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.start')}}</div>
            </div>
            <div class="col-sm-6">
              <div class="p mb-1 text-12 fw-500">{{t('Calendar.end')}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mx-0 pt-2">
        <div class="col-sm-1 pt-2 ">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z"
              stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.3334 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.66663 1.66675V5.00008" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M2.5 8.33325H17.5" stroke="#B2B2B2" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <div class="col-sm-11">
          <div class="row">
            <div class="col-sm-6">
              <CalenderControl v-model="editForm.data.start_date" class="" errorField="start_date" disabled />
            </div>
            <div class="col-sm-6">
              <CalenderControl v-model="editForm.data.return_date" class="" errorField="start_date" disabled />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.start_time" :options="times[$i18n.locale]" trackBy="24_hour"
                optionLabel="time" placeholder="Start Time" errorField="start_time" class="pointer" disabled />
            </div>
            <div class="col-sm-6">
              <SelectControl v-model="editForm.data.return_time" :options="times[$i18n.locale]" trackBy="24_hour"
                optionLabel="time" placeholder="Start Time" errorField="start_time" class="pointer" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 mt-2">
      <button @click="deleteModalStatus = false" type="button"
        class="btn btn-cancel px-5 py-2 btn-sm ">{{t('button.cancel')}}</button>
      <button class="btn btn-danger" @click="onDeleteCalendar" :loading="deleteState"
        style="min-width: 180px;">{{t('button.remove')}}</button>
    </div>
  </ModalControl>

</template>

<style lang="scss">
.relative {
  position: relative;
}

.resizable-component {
  position: absolute !important;

  .resizable-l::before {
    content: "\2190";
    padding-left: 5px;
  }

  .resizable-r::after {
    content: "\2192";
    padding-left: 5px;
  }
}

.resize_date {
  position: absolute;
  font-size: 12px;
  display: none;

  &.start {
    bottom: 0;
  }

  &.end {
    top: 62px;
  }
}

.reservation__item {
  &.show_resize_icon {
    &~.resizable-l {
      display: block;
    }

    &~.resizable-r {
      display: block;
    }
  }

  &.show_resize_content {
    box-shadow: 0px 0px 16px 2px rgba(0, 0, 0, 0.32);

    &~.resize_date {
      display: block;
    }

    &.left {
      &~.resize_date {
        left: 0;
      }
    }

    &.right {
      &~.resize_date {
        right: 0;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.z-index-99 {
  z-index: 99 !important;
}

.el-w-220 {
  width: 220px;
}

#dropdownMenuLink {
  &:focus {
    outline: none;
  }
}

.reservation__action {
  position: fixed;
  top: v-bind(actionPositiontop);
  left: v-bind(actionPositionleft);
  z-index: 1000;
  background: #ffffff;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  width: 146px;

  ul {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px #ddddddbf;
    min-width: 135px;
    overflow: hidden;

    li {
      padding: 10px 15px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: #f9f9f9;
      }
    }
  }
}

.reservation-loop-item {
  position: relative;

  &:hover {
    z-index: 99 !important;
  }
}

.calender__wrapper {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 0.5rem;
  max-height: calc(100vh - 200px);
  overflow-x: hidden;
  overflow-y: scroll;

  scrollbar-width: thin;
  z-index: 1;
  position: relative;

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

  .days__wrapper {
    display: flex;
    width: 100%;
    // width: calc(100% - 327px);
    height: 100%;
  }

  .reservation__wrapper {
    position: relative;
    // width: calc(100% - 327px);
    overflow: hidden;

    .reservation__item {
      display: flex;
      align-items: center;
      border-radius: 5px;
      color: #000000;
      background: white;
      font-size: 12px;
      padding: 5px;
      white-space: nowrap;
      position: relative;
      z-index: 22;
      width: 100%;
      overflow-x: scroll;
      // cursor: move;

      -ms-overflow-style: none;
      /* IE and Edge */
      scrollbar-width: none;
      /* Firefox */
      box-shadow: 0px 4px 8px rgba(39, 110, 241, 0.16);
      border: 1px solid;
      border-left: 12px solid;

      &::-webkit-scrollbar {
        display: none;
      }

      &.dragover__active {
        box-shadow: 0px 4px 8px rgba(39, 110, 241, 0.16);
      }
    }

    .empty_border {
      top: 0;
      position: absolute;
      height: 100%;
      width: 1px;
      background-color: #ddd;
      z-index: 1;
    }

    .text-grey {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .day__item {
    width: v-bind(cellWidth);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ddd;
  }

  .vehicle_row {
    height: 115px;
    position: relative;

    &:not(:last-child) {
      border-bottom: 1px solid #ddd;
    }
  }

  .vehicle_div {
    color: #020918;

    &:hover {
      background: #e7effd;
    }
  }

  .top_height {
    height: 50px;
  }
}

.simple_search {
  background: #f2f2f2;
  border-radius: 4px;
  position: relative;
  width: 303px;

  input[type="text"] {
    border: 0;
    display: block;
    width: 100%;
    background-color: transparent;
    padding: 10px 10px 10px 40px;

    &:focus {
      outline: 0;
    }
  }

  .prepend_icon {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}

.green__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0be06b;
  display: inline-block;
}

.red__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f56c6b;
  display: inline-block;
}

.btn-cancel {
  background: #eeeeee;
  border-radius: 4px;
  padding: 10px 45px !important;
  color: $light-gray;
}

.modal-content {
  padding: 0 !important;
}

.primary {
  border-color: #276ef1 !important;
}

.info {
  border-color: #7454BF !important;
}

.warning {
  border-color: #FFC044 !important;
}

.success {
  border-color: #46B276 !important;
}

.danger {
  border-color: #F25037 !important;
}

.primary-bg {
  background: #276ef1 !important;
}

.info-bg {
  background: #7454BF !important;
}


.warning-bg {
  background: #FFC044 !important;
}

.success-bg {
  background: #46B276 !important;
}

.danger-bg {
  background: #F25037 !important;
}

.grey-bg {
  background: rgba(0, 0, 0, 0.6) !important;
}

.color-code.dropdown .dropdown-menu {
  z-index: 2;
  inset: 16px auto auto 0px !important;
  background: #ffffff;
  box-shadow: 0px 4px 56px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 18px 12px;

  .dropdown-item {
    .color-box {
      width: 52px;
      height: 22px;
      border-radius: 4px;
    }

    &:hover {
      background-color: #ffffff;
    }
  }
}
@media only screen and (max-width: 768px) {
  .calander-m__header{
    margin-top: 1rem;
  }
}
</style>
