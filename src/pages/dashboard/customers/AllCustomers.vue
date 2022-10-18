<template>

  <PageHeader button-path="/customer/create" @search="onSearch"
    :button-text="` ${ $t('dashboard-customer.add-customer') }`">
    <template #addIcon>
      <svg class="me-2" width="24" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
          stroke="#EEEEEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
          stroke="#EEEEEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M23 20.9999V18.9999C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299"
          stroke="#EEEEEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799"
          stroke="#EEEEEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

    </template>
  </PageHeader>
  <div class="row">
    <div class="col-xl-9 col-lg-12 col-md-12">
      <CustomersTable @c-view="viewCustomer" :searchText="searchText" :c-info="customerInfo"
        :statusChanged="statusChanged" />
    </div>
    <div class="col-xl-3 col-lg-12 col-md-12 all-customer__table-m">
      <CustomerViewCard :key="staticKey" :c-info="customerInfo" @onStatusChanged="onStatusChanged" />
    </div>
  </div>

</template>

<script>
import CustomersTable from "../../../components/dashboard/customers/CustomersTable.vue"
import CustomerViewCard from "../../../components/dashboard/customers/CustomerViewCard.vue"
import PageHeader from "../../../components/dashboard/PageHeader.vue"

export default {
  components: {
    PageHeader,
    CustomersTable,
    CustomerViewCard,
  },
  name: "AllCustomers",
  data() {
    return {
      customerInfo: null,
      statusChanged: 1,
      staticKey: 1,
      searchText: ''
    }
  },
  methods: {
    async viewCustomer(data) {
      this.customerInfo = data
      this.staticKey = this.staticKey + 1
    },
    onSearch(text) {
      this.searchText = text
    },
    onStatusChanged() {
      this.statusChanged = ++this.statusChanged
    }
  },
}
</script>

<style lang="scss" scoped>
  @media only screen and (max-width: 1024px) {
    .all-customer__table-m{
      margin-top: 1.2rem;
    }
  }
</style>
