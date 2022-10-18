import { defineStore } from 'pinia'

// import { past21years } from '../use/useUtil'

export const useReservationStore = defineStore({
  id: 'reservation',
  state: () => ({
    keys: {
      requestFormKey: 1,
    },
    createInfo: {
      day_rate: 0,
      week_rate: 0,
      month_rate: 0,

      artCopy: '',
    },
    formCurrency: {
      per_hour_rate: null,
      total_rental_price: null,
      pick_up_fee: null,
      out_of_hours_fee: null,
      others_costs: null,
      charges_for_extras: null,
      cost_per_extra_km: null,
      deposit: null,
      deductible_fire_theft: null,
      deductible_damage: null,
      deductible_liability: null,
      total_without_vat: null,
    },
    editCurrency: {
      per_hour_rate: null,
      total_rental_price: null,
      pick_up_fee: null,
      out_of_hours_fee: null,
      others_costs: null,
      charges_for_extras: null,
      cost_per_extra_km: null,
      deposit: null,
      deductible_fire_theft: null,
      deductible_damage: null,
      deductible_liability: null,
    },
    endRentalCurrency: {
      per_hour_rate: null,
      total_rental_price: null,
      pick_up_fee: null,
      return_fee: null,
      refueling_fee: null,
      out_of_hours_fee: null,
      others_costs: null,
      charges_for_extras: null,
      cost_per_extra_km: null,
      charges_for_additional_km: null,
      deposit: null,
      deductible_fire_theft: null,
      deductible_damage: null,
      deductible_liability: null,
      withheld_deductible: null,
    },
    // Create Form
    form: {
      vat_rate: 0,
      total_rental_price: null,
      calculate_value: 'Automatic',
      rent_option: 'day_rate',
      rent_days: 0,

      non_smoking_agreement: true,
      customer_id: '',
      origin_of_customer: '',
      create_by: '',
      vehicle_id: '',
      pick_up_loaction: '',
      return_location: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      fuel_level_at_pick_up_id: '',
      km_included: '',
      cost_per_extra_km: '',
      km_at_pick_up: '',
      contact_language: '',
      note: '',
      driver_id: '',
      other_driver_id: '',
      damages_content: '',
      damages_art: '',
      photos_handover: [],
      per_hour_rate: 0,
      rental_hours: '',
      pick_up_fee: null,
      out_of_hours_fee: null,
      others_costs: null,
      charges_for_extras: null,
      discount: null,
      discount_type: 'Percentage',
      vat_amount: 0,
      total_without_vat: 0,
      total_amount_paid: 0,
      to_pay: 0,
      payment_method: '',
      deposit: null,
      payment_method_for_deposit: '',
      preauthorization_code: '',
      deductible_fire_theft: '',
      deductible_damage: '',
      deductible_liability: '',
      status: '',
      vehicleclass_id: '',
      subtotal: 0,
      discount_amount: 0,
    },

    editInfo: {
      day_rate: 0,
      week_rate: 0,
      month_rate: 0,

      artCopy: '',
      handover_photos: []
    },
    // Edit Form
    edit: {
      vat_rate: 0,
      total_rental_price: null,
      calculate_value: 'Automatic',
      rent_option: 'day_rate',
      rent_days: 0,

      non_smoking_agreement: true,
      customer_id: '',
      origin_of_customer: '',
      create_by: '',
      vehicle_id: '',
      pick_up_loaction: '',
      return_location: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      fuel_level_at_pick_up_id: '',
      km_included: '',
      cost_per_extra_km: null,
      km_at_pick_up: '',
      contact_language: '',
      note: '',
      driver_id: '',
      other_driver_id: '',
      damages_content: '',
      damages_art: '',
      photos_handover: [],
      per_hour_rate: 0,
      rental_hours: '',
      pick_up_fee: null,
      out_of_hours_fee: null,
      others_costs: null,
      charges_for_extras: null,
      discount: null,
      vat_amount: 0,
      total_without_vat: 0,
      total_amount_paid: 0,
      to_pay: 0,
      payment_method: '',
      deposit: 0,
      payment_method_for_deposit: '',
      preauthorization_code: '',
      deductible_fire_theft: '',
      deductible_damage: '',
      deductible_liability: '',
      status: '',
      vehicleclass_id: '',
      subtotal: 0,
      discount_amount: 0,
    },

    // End Rental Form
    endRental: {
      customer_id: '',
      origin_of_customer: '',
      create_by: '',
      closed_by: '',
      closed_by_name: '',
      vehicle_id: '',
      pick_up_loaction: '',
      return_location: '',
      actual_return_location: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      actual_end_date: '',
      actual_end_time: '',
      fuel_level_at_pick_up_id: '',
      fuel_level_at_return: '',
      km_included: '',
      cost_per_extra_km: '',
      km_at_pick_up: '',
      km_at_return: '',
      contact_language: '',
      note: '',
      driver_id: '',
      other_driver_id: '',
      damages_content_return: '',
      damages_art_return: '',
      photos_handover: '',
      per_hour_rate: 0,
      rental_hours: '',
      return_fee: '',
      refueling_fee: '',
      pick_up_fee: '',
      total_rental_price: '',
      out_of_hours_fee: '',
      others_costs: '',
      charges_for_extras: '',
      charges_for_additional_km: '',
      discount: '',
      vat_amount: '',
      total_without_vat: '',
      total_amount_paid: '',
      to_pay: '',
      payment_method: '',
      deposit: '',
      payment_method_for_deposit: '',
      preauthorization_code: '',
      deductible_fire_theft: '',
      deductible_damage: '',
      deductible_liability: '',
      withheld_deductible: '',
      status: '',
      subtotal: 0,
      discount_amount: 0,
    },


    bookingForm: {
      vehicleClass: "",
      location: "",
      pickup_date: "",
      pickup_time: "",
      return_date: "",
      return_time: "",

      company_name: "",
      name_title: "", 
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: "",
      date_of_birth: "",
      place_of_birth: "",
      address: "",
      country: "",
      city: "",
      zip: "",
      id_no: "",
      driving_license: "",
      lang: "",
    }
  }),

  actions: {
    clearForm() {
      this.form = {
        vat_rate: 0,
        total_rental_price: null,
        calculate_value: 'Automatic',
        rent_option: 'day_rate',
        rent_days: 0,

        non_smoking_agreement: true,
        customer_id: '',
        origin_of_customer: '',
        create_by: '',
        vehicle_id: '',
        pick_up_loaction: '',
        return_location: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        fuel_level_at_pick_up_id: '',
        km_included: '',
        cost_per_extra_km: '',
        km_at_pick_up: '',
        contact_language: '',
        note: '',
        driver_id: '',
        other_driver_id: '',
        damages_content: '',
        damages_art: '',
        photos_handover: [],
        per_hour_rate: 0,
        rental_hours: '',
        pick_up_fee: null,
        out_of_hours_fee: null,
        others_costs: null,
        charges_for_extras: null,
        discount: null,
        discount_type: 'Percentage',
        vat_amount: 0,
        total_without_vat: 0,
        total_amount_paid: 0,
        to_pay: 0,
        payment_method: '',
        deposit: null,
        payment_method_for_deposit: '',
        preauthorization_code: '',
        deductible_fire_theft: '',
        deductible_damage: '',
        deductible_liability: '',
        status: '',
      }
    },
    clearFormCurrency() {
      this.formCurrency = {
        per_hour_rate: null,
        total_rental_price: null,
        pick_up_fee: null,
        out_of_hours_fee: null,
        others_costs: null,
        charges_for_extras: null,
        cost_per_extra_km: null,
        deposit: null,
        deductible_fire_theft: null,
        deductible_damage: null,
        deductible_liability: null,
        total_without_vat: null,
      }
    },
    clearBookingForm() {
      this.bookingForm = {
        vehicleClass: "",
        location: "",
        pickup_date: "",
        pickup_time: "",
        return_date: "",
        return_time: "",

        company_name: "",
        name_title: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
        date_of_birth: "",
        place_of_birth: "",
        address: "",
        country: "",
        city: "",
        zip: "",
        id_no: "",
        driving_license: "",
        lang: "",
      }
    }
  }
})
