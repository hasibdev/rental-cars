<script setup>
import { reactive, ref, watch } from "vue"
import { DatePicker } from 'v-calendar'

import LoadingView from '@/components/common/LoadingView.vue'
import moment from "moment"
import { useAuthStore } from "@/stores/auth"
import { useI18n } from 'vue-i18n'
import { useAxios } from '@/use/useAxios'

const { t, locale } = useI18n({ useScope: 'global' })
const auth = useAuthStore()

auth.authCheckout()
const name = ''

const greetingTime = ref("")
let day = new Date()
let hour = day.getHours()

greetingTime.value =
  hour >= 0 && hour < 11
    ? `${t('dashboard.good-morning')}`
    : hour >= 11 && hour <= 18
      ? `${t('dashboard.good-afternoon')}`
      : `${t('dashboard.good-evening')}`

const { data: total_statistics, loading } = useAxios("/admin/dashboard")
// const { data: reservationList } = useAxios("/admin/reservation")
let filtered_data = []
const reservationKey = ref(1)
// let picker = ref(new Date())

const form = reactive({
  picker: new Date()
})

// filtered_data = reservationList.filter(x => x.date == moment(form.picker).format('YYYY-MM-DD'))

const changeDate = () => {

  // filtered_data = reservationList?.data?.filter(x => x.start_date == moment(form.picker).format('YYYY-MM-DD'))
  console.log(moment(form.picker).format('YYYY-MM-DD'))
}


// const rentalItems = [
//   {
//     i: 1,
//     id: '#4500',
//     statusId: 1,
//     status: 'Pending',
//     date: '2022-06-13',
//     time: '08:43 PM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mr. Joe Jackkos',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 2,
//     id: '#8930',
//     statusId: 2,
//     status: 'Rented',
//     date: '2022-06-13',
//     size: 'Small',
//     time: '11:43 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 3,
//     id: '#4501',
//     statusId: 3,
//     status: 'Reserved',
//     date: '2022-06-14',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     size: 'Small',
//     carModel: 'HHAD 4576',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 4,
//     id: '#8930',
//     statusId: 4,
//     status: 'Open',
//     date: '2022-06-14',
//     size: 'Small',
//     time: '11:43 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 5,
//     id: '#4501',
//     statusId: 3,
//     status: 'Reserved',
//     date: '2022-06-12',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     customerName: 'Mrs. Jiah ihuj',
//     size: 'Small',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 6,
//     id: '#4501',
//     statusId: 3,
//     status: 'Reserved',
//     date: '2022-06-12',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 7,
//     id: '#4501',
//     statusId: 4,
//     status: 'Open',
//     date: '2022-06-12',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 8,
//     id: '#4501',
//     statusId: 1,
//     status: 'Pending',
//     date: '2022-06-14',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 9,
//     id: '#4501',
//     statusId: 3,
//     status: 'Reserved',
//     date: '2022-06-15',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     customerName: 'Mrs. Jiah ihuj',
//     size: 'Small',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 10,
//     id: '#4501',
//     statusId: 3,
//     status: 'Reserved',
//     date: '2022-06-15',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 11,
//     id: '#4501',
//     statusId: 4,
//     status: 'Open',
//     date: '2022-06-12',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
//   {
//     i: 12,
//     id: '#4501',
//     statusId: 1,
//     status: 'Pending',
//     date: '2022-06-14',
//     time: '06:00 AM',
//     carName: 'BMW GH2890',
//     carModel: 'HHAD 4576',
//     size: 'Small',
//     customerName: 'Mrs. Jiah ihuj',
//     url: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ym13JTIwY2Fyc3xlbnwwfHwwfHw%3D&w=1000&q=80',
//   },
// ]



const chartData = reactive({
  chartData1: {
    data: { '00:00:00 ': 2, '01:00:00': 5, '02:00:00 ': 4, '03:00:00': 3, '04:00:00': 0, '05:00:00': 0, '06:00:00': 1, '07:08:00': 10, '08:09:00': 6, '09:10:00': 3, '10:10:00': 3, '11:00:00': 5, '12:00:00 ': 4, '13:00:00': 3, '14:00:00': 0, '15:00:00': 0, '16:00:00': 1, '17:08:00': 10, '18:09:00': 6, '19:10:00': 3, '20:10:00': 3, '21:10:00': 4, '22:10:00': 0, '23:10:00': 5, '24:10:00': 3 },
    options: {
      tooltips: {
        // See: https://stackoverflow.com/a/44010778/1762224
        callbacks: {
          title: function () {
            return `Rent Revenue Customers`
          }
        },
        backgroundColor: "#FAFAFA",
        borderColor: "lightgreen",
        borderWidth: 1,
        titleFontColor: "black",
        titleFontStyle: "bold",
        displayColors: false,
        bodyFontColor: "black"
      }
    }
  }
})

// const chartData1 = [['10-06-2020', 1500], ['15-06-2020', 2000], ['20-06-2020', 800], ['22-06-2020', 1000], ['25-06-2020', 1500]]
const chartData2 = [['Sun', 100], ['Mon', 3000], ['Tue', 800], ['Wed', 5000], ['Thu', 1500], ['Fri', 1500], ['Sat', 1500]]
const chartData3 = [['Sun', 1500], ['Mon', 2000], ['Tue', 800], ['Wed', 1000], ['Thu', 1500]]

watch([auth], () => {
  Object.assign(name, auth.user)
  reservationKey.value = ++reservationKey.value
  // nextTick(() => {
  //   changeDate(form.picker)
  // })
},

  { immediate: true })

  // changeDate(picker)

</script>

<template>

  <!-- <pre>{{reservationList}}</pre> -->
  <!-- Dashboard Header -->
  <div class="dashboard__header">
    <div class="">
      <h4 class="mt-2">{{ greetingTime }}, {{ auth.user?.first_name || '' }}</h4>
    </div>
    <div class="">
      <button type="button" class="btn btn-dark " style="min-width:300px;">
        <app-link class="text-white d-flex align-items-center justify-content-center" path="/reservierungen/erstellen">
          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18.4215 3.1777H3.17769C1.97499 3.1777 1 4.15269 1 5.3554V20.5993C1 21.802 1.97499 22.7769 3.17769 22.7769H18.4215C19.6243 22.7769 20.5992 21.802 20.5992 20.5993V5.3554C20.5992 4.15269 19.6243 3.1777 18.4215 3.1777Z"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.155 1V5.35539" stroke="white" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M6.44424 1V5.35539" stroke="white" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M1 9.71078H20.5992" stroke="white" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M18.7391 25C21.6206 25 23.9565 22.6641 23.9565 19.7826C23.9565 16.9011 21.6206 14.5652 18.7391 14.5652C15.8576 14.5652 13.5217 16.9011 13.5217 19.7826C13.5217 22.6641 15.8576 25 18.7391 25Z"
              fill="black" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.9622 18.9206L18.0926 21.7902L16.7883 20.4858" stroke="white" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="ms-3 mb-0 h6 font-weight-normal">{{t('dashboard-reservation.add-reservation')}}</span>
        </app-link>
      </button>
    </div>
  </div>

  <!-- Summary Block -->
  <div class="row mb-4 mt-4">
    <div class="col-xl-3 col-lg-4 col-md-6  mb-md-3">
      <div class="card rounded-lg h-100" style="min-height:7.8125rem">
        <div class="card-body px-lg-4 px-md-3">
          <h5 class="card-title pb-1">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#EFE7FD"/>
              <path d="M27 12H13C11.8954 12 11 12.8954 11 14V28C11 29.1046 11.8954 30 13 30H27C28.1046 30 29 29.1046 29 28V14C29 12.8954 28.1046 12 27 12Z" stroke="#7454BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M24 10V14" stroke="#7454BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 10V14" stroke="#7454BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.3837 26.0122C23.0301 26.0122 25.1754 23.8669 25.1754 21.2205C25.1754 18.5741 23.0301 16.4288 20.3837 16.4288C17.7373 16.4288 15.592 18.5741 15.592 21.2205C15.592 23.8669 17.7373 26.0122 20.3837 26.0122Z" fill="#EFE7FD" stroke="#7454BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22.1806 20.1024L19.5451 22.7378L18.3472 21.5399" stroke="#7454BF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="ps-3"></span>
            {{t('dashboard.total-reservation')}}
          </h5>
          <h3 class="text-center">{{total_statistics?.total_reserve.toLocaleString() || ''}}</h3>
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6  mb-md-3">
      <div class="card rounded-lg h-100" style="min-height:7.8125rem">
        <div class="card-body px-lg-4 px-md-3">
          <h5 class="card-title pb-1">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#FDE7EA"/>
              <g clip-path="url(#clip0_2947_697)">
              <path d="M20 10.8333V29.1667" stroke="#FD7E4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M24.1667 14.1667H17.9167C17.1431 14.1667 16.4013 14.4739 15.8543 15.0209C15.3073 15.5679 15 16.3098 15 17.0833C15 17.8569 15.3073 18.5987 15.8543 19.1457C16.4013 19.6927 17.1431 20 17.9167 20H22.0833C22.8569 20 23.5987 20.3073 24.1457 20.8543C24.6927 21.4012 25 22.1431 25 22.9167C25 23.6902 24.6927 24.4321 24.1457 24.9791C23.5987 25.526 22.8569 25.8333 22.0833 25.8333H15" stroke="#FD7E4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_2947_697">
              <rect width="20" height="20" fill="white" transform="translate(10 10)"/>
              </clipPath>
              </defs>
            </svg>
            <span class="ps-3"></span>
            {{t('dashboard.total-revenue')}}
          </h5>
          <h3 class="text-center">${{total_statistics?.total_revenue.toLocaleString() || ''}}</h3>
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6  mb-md-3">
      <div class="card rounded-lg h-100" style="min-height:7.8125rem">
        <div class="card-body px-lg-4 px-md-3">
          <h5 class="card-title pb-1">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#C9FCE0"/>
              <path d="M14.5963 22.7204C15.2689 22.7204 15.8145 22.1753 15.8145 21.5027C15.8145 20.8301 15.2689 20.2845 14.5963 20.2845C13.9237 20.2845 13.3786 20.8301 13.3786 21.5027C13.3786 22.1752 13.9237 22.7204 14.5963 22.7204Z" fill="#46B276" stroke="#46B276" stroke-width="0.2"/>
              <path d="M25.2796 22.7204C25.9521 22.7204 26.4973 22.1752 26.4973 21.5027C26.4973 20.8301 25.9522 20.2845 25.2796 20.2845C24.607 20.2845 24.0614 20.8301 24.0614 21.5027C24.0614 22.1753 24.607 22.7204 25.2796 22.7204Z" fill="#46B276" stroke="#46B276" stroke-width="0.2"/>
              <path d="M27.5374 17.3365L26.5555 14.0842C26.5554 14.0839 26.5553 14.0837 26.5553 14.0835C26.1693 12.7332 24.9475 11.9 23.6021 11.9H16.2109C14.8597 11.9 13.7069 12.8005 13.2593 14.0786L13.2592 14.0785L13.2579 14.0827L12.2753 17.3374C10.8992 18.1657 9.9 19.6775 9.9 21.5028V23.9869C9.9 25.2842 10.9386 26.3229 12.2359 26.3229H12.2603V27.8996C12.2603 28.3898 12.6776 28.8071 13.1678 28.8071C13.658 28.8071 14.0754 28.3898 14.0754 27.8996V26.3229H25.9246V27.8996C25.9246 28.3898 26.342 28.8071 26.8322 28.8071C27.3224 28.8071 27.7397 28.3898 27.7397 27.8996V26.3229H27.7641C29.0614 26.3229 30.1 25.2843 30.1 23.9869V21.5028H30.1002L30.0998 21.4959C29.9737 19.6755 28.9759 18.1649 27.5374 17.3365ZM24.9352 14.5749L25.5802 16.7441H14.7208H14.7207L14.358 16.7444L15.0029 14.5753C15.0029 14.5753 15.0029 14.5752 15.0029 14.5752C15.1775 13.9932 15.6996 13.5908 16.2735 13.5908L23.6646 13.5904C24.2386 13.5904 24.7608 13.9933 24.9352 14.5749ZM28.2227 23.9869C28.2227 24.3043 27.9568 24.5701 27.6395 24.5701H12.2363C11.919 24.5701 11.6531 24.3043 11.6531 23.9869V21.5028C11.6531 19.8189 12.9747 18.4973 14.6586 18.4973H25.2171C26.8402 18.4973 28.2225 19.8202 28.2225 21.5028L28.2227 23.9869Z" fill="#46B276" stroke="#46B276" stroke-width="0.2"/>
            </svg>
            <span class="ps-3"></span>
            {{t('dashboard.total-cars')}}
          </h5>
          <h3 class="text-center">{{total_statistics?.total_cars.toLocaleString() || ''}}</h3>
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-lg-4 col-md-6  mb-md-3">
      <div class="card rounded-lg h-100" style="min-height:7.8125rem">
        <div class="card-body px-lg-4 px-md-3">
          <h5 class="card-title pb-1">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#E7EFFD" />
              <g clip-path="url(#clip0_258_123)">
                <path
                  d="M24.1667 27.5V25.8333C24.1667 24.9493 23.8155 24.1014 23.1904 23.4763C22.5652 22.8512 21.7174 22.5 20.8333 22.5H14.1667C13.2826 22.5 12.4348 22.8512 11.8097 23.4763C11.1845 24.1014 10.8333 24.9493 10.8333 25.8333V27.5"
                  stroke="#6B9CF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M17.5 19.1667C19.3409 19.1667 20.8333 17.6743 20.8333 15.8333C20.8333 13.9924 19.3409 12.5 17.5 12.5C15.659 12.5 14.1667 13.9924 14.1667 15.8333C14.1667 17.6743 15.659 19.1667 17.5 19.1667Z"
                  stroke="#6B9CF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M29.1667 27.5V25.8333C29.1661 25.0948 28.9203 24.3773 28.4678 23.7936C28.0153 23.2099 27.3818 22.793 26.6667 22.6083"
                  stroke="#6B9CF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M23.3333 12.6083C24.0504 12.7919 24.6859 13.2089 25.1397 13.7936C25.5935 14.3783 25.8399 15.0974 25.8399 15.8375C25.8399 16.5776 25.5935 17.2967 25.1397 17.8814C24.6859 18.4661 24.0504 18.8831 23.3333 19.0667"
                  stroke="#6B9CF1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_258_123">
                  <rect width="20" height="20" fill="white" transform="translate(10 10)" />
                </clipPath>
              </defs>
            </svg>
            <span class="ps-3"></span>
            {{t('dashboard.total-customers')}}
          </h5>
          <h3 class="text-center">{{total_statistics?.total_customers.toLocaleString() || ''}}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Graph Block -->
  <div class="graph-section mb-4">
    <div class="card rounded">
      <div class="card-body px-lg-5 px-md-3 py-4">
        <nav>
          <div class="nav nav-tabs d-flex justify-contents-end" id="nav-tab" role="tablist">
            <div class="me-auto h5">
              {{t('dashboard.statistics')}}
            </div>
            <a class="nav-link active me-2" id="nav-daily-tab" data-bs-toggle="tab" href="#nav-daily" role="tab"
              aria-controls="nav-daily" aria-selected="true">{{t('dashboard.daily')}}</a>
            <a class="nav-link me-2" id="nav-weekly-tab" data-bs-toggle="tab" href="#nav-weekly" role="tab"
              aria-controls="nav-weekly" aria-selected="false">{{t('dashboard.weekly')}}</a>
            <a class="nav-link" id="nav-monthly-tab" data-bs-toggle="tab" href="#nav-monthly" role="tab"
              aria-controls="nav-monthly" aria-selected="false">{{t('dashboard.monthly')}}</a>
          </div>
        </nav>

        <div class="tab-content mt-4" id="nav-tabContent">
          <div class="tab-pane fade show active" id="nav-daily" role="tabpanel" aria-labelledby="nav-daily-tab">
            <line-chart :data="chartData.chartData1.data" :curve="false" loading="Loading..."
              :options="chartData.chartData1.options"></line-chart>
          </div>
          <div class="tab-pane fade" id="nav-weekly" role="tabpanel" aria-labelledby="nav-weekly-tab">
            <line-chart :data="chartData2" :curve="false"></line-chart>
          </div>
          <div class="tab-pane fade" id="nav-monthly" role="tabpanel" aria-labelledby="nav-monthly-tab">
            <line-chart :data="chartData3" :curve="false"></line-chart>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Rental Info Block -->
  <div class="rental-section mb-4">
    <div class="row">
      <div class="col-lg-8 col-md-12">
        <div class="card rounded">
          <div class="card-body px-lg-5 px-md-3 py-4">
            <div class="d-flex align-center justify-content-between">
              <div class="h5">
                {{t('dashboard.rentals')}}
              </div>
              <div class="h6 font-weight-medium" :key="reservationKey">
                <span v-if="locale === 'de'">{{ moment(form.picker).format('DD.MM.YYYY') }}</span>
                <span v-else>{{ moment(form.picker).format('DD/MM/YYYY') }}</span>
              </div>
            </div>

            <div class="rental-info" :key="reservationKey">
              <p v-if="!loading && !filtered_data.length">{{t('text.no-data-found')}}</p>
              <LoadingView :loading="loading">
                <div class="card pt-3 rounded-0 rental-card" v-for="i in filtered_data" :key="i.id">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-lg-2 col-md-2 col-sm-12">
                        <img :src="i.url" :alt="i.carName" class="img-fluid rounded statistics-img" />
                      </div>
                      <div class="col-lg-2 col-md-3 col-sm-12">
                        <div class="h6 fw-500 pb-lg-2 pb-md-1">
                          {{i.carName}}
                        </div>
                        <div class="text-12 fw-400 pb-lg-2 pb-md-1">
                          {{i.carModel}}
                        </div>
                        <div class="text-12 fw-300 pb-lg-2 pb-md-1">
                          {{i.customerName}}
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-12">
                        <div class="text-12 fw-300 pb-2">
                          {{i.status}}
                        </div>
                        <div>
                          <span class="text-14 fw-500 pe-2">
                            {{i.time}}
                          </span>
                          <span class="text-10 color-lighter-gray fw-400 pe-2">
                            {{moment(i.date).format('DD MMM YYYY')}}
                          </span>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-3 col-sm-12 text-right">
                        <div class="text-14 fw-500 color-light-gray pb-3">
                          ID {{i.id}}
                        </div>
                        <button class="btn pointer-none text-12 fw-500 py-2 "
                          :style="i.statusId == 1 ? 'background-color:#FCEFAF; color: #D6B40D' : (i.statusId == 2 ? 'background-color: #FFF2E1; color: #FFA42F' :  ( i.statusId == 3 ? 'background-color: #F5E1FF; color: #B04CDF' : 'background-color: #C9FCE0; color: #1BCE6C')) ">
                          {{i.status}}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </LoadingView>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <div class="card rounded m-home__calander">
          <div class="card-body">
            <h5 class="mb-3">{{t('sidebar.calendar')}}</h5>
            <div class="calender-div d-flex justify-content-center">
              <DatePicker v-model="form.picker" @dayclick="changeDate(form.picker)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
$dark-black: #020918;
$light-gray: #666666;
$lighter-gray: #808080;
$border-color: #276ef1;

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &_add-button {
    background: $dark-black;
    color: #fff;
    padding: 10px 45px;
    border-radius: 4px;
    display: block;
    text-align: center;

    .button-text {
      margin-left: 15px;
    }
  }
}

.nav-tabs {
  border-bottom: none;

  .nav-link {
    color: $light-gray !important;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    border-top: none;
    border-left: none;
    border-right: none;

    &:hover {
      color: $dark-black;
      background-color: #fff;
      border-bottom: 2px solid $border-color !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
    }
  }

  .nav-item.show .nav-link,
  .nav-link.active {
    color: $dark-black;
    background-color: #fff;
    border-bottom: 2px solid $border-color;
    border-top: none;
    border-left: none;
    border-right: none;
  }
}

.rental-card {
  border: none;
  border-bottom: 1px solid #eeeeee;
  color: $dark-black;
}

.rental-card:last-child {
  border-bottom: none;
}

.calender-div {
  .vc-container.vc-blue {
    border: none;
    // width: 100%;
  }

  .vc-highlight {
    border-radius: 4px !important;
    background-color: #000 !important;
  }
}

.block__card {
  border: 1px solid #dddddd;
  border-radius: 4px;
  padding: 25px 15px;

  &_title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title-text {
    margin-left: 15px;
    display: inline-block;
  }

  .text-number {
    text-align: center;
    font-weight: bold;
    margin-top: 10px;
  }
}

.statistics-img {
  // aspect-ratio: 4/2;
  object-fit: cover;
}

.text-10 {
  font-size: 10px;
}

.text-12 {
  font-size: 12px;
}

.text-13 {
  font-size: 13px;
}

.text-14 {
  font-size: 14px;
}

.color-grey {
  color: $light-gray;
}

.color-lighter-grey {
  color: $lighter-gray;
}

@media only screen and (max-width: 1024px) {
  .calender-div {
    width: 100%;
  }
}

@media only screen and (max-width: 768px) {
  .m-home__calander {
    margin-top: 1.3rem;
  }
}
</style>
