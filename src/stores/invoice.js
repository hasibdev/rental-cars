import { defineStore } from 'pinia'

export const useInvoiceStore = defineStore({
  id: 'invoicePreview',
  state: () => ({
    invoiceStage: {
      hasData: false,
      createPreviewId: null
    },
    form: {
      reservation_id: '',
      customer_id: '',
      invoice_no: '',
      invoice_date: new Date(),
      due_date: new Date(),
      payment_term: '',
      accepted_payment_method: '',
      price_rate_status: 'incl-vat',
      sub_total: 0,
      grand_total: 0, // new field
      introduction_text: '', // new field
      discount_type: '', // new field
      final_text: '', // new field
      tax: '',
      tax_amount: 0,
      discount: 0,
      discount_amount: 0,
      total_amount_paid: 0,
      paid_amount: 0,
      due_amount: 0,
      language: '',
      currency: 'Euro',
      singature: '',
      signature_label: '',
      termas_conditions: "",
      addiontal_notes: '',
      lines: [
        {
          description: "",
          quantity: 0,
          unit: '',
          rate: 0,
          amount: 0,
        }
      ]
    },
    edit: {
      reservation_id: '',
      customer_id: '',
      invoice_no: '',
      invoice_date: new Date(),
      due_date: new Date(),
      payment_term: '',
      accepted_payment_method: '',
      price_rate_status: 'incl-vat',
      sub_total: 0,
      grand_total: 0, // new field
      introduction_text: '', // new field
      discount_type: '', // new field
      final_text: '', // new field
      tax: '',
      tax_amount: 0,
      discount: 0,
      discount_amount: 0,
      total_amount_paid: 0,
      paid_amount: 0,
      due_amount: 0,
      language: '',
      currency: 'Euro',
      singature: '',
      signature_label: '',
      termas_conditions: "",
      addiontal_notes: '',
      lines: [
        {
          description: "",
          quantity: 0,
          unit: '',
          rate: 0,
          amount: 0,
        }
      ]
    },
    formCustomer: {
      full_name: '',
      phone: '',
      email: '',
      country: '',
      province: '',
      city: '',
      address: '',
      zip: '',
    },
    formPreview: {}
  }),

  actions: {
    clearForm() {
      this.form = {
        reservation_id: '',
        customer_id: '',
        invoice_no: '',
        invoice_date: new Date(),
        due_date: new Date(),
        payment_term: '',
        accepted_payment_method: '',
        price_rate_status: 'incl-vat',
        sub_total: 0,
        grand_total: 0, // new field
        introduction_text: '', // new field
        discount_type: '', // new field
        final_text: '', // new field
        tax: '',
        tax_amount: 0,
        discount: 0,
        discount_amount: 0,
        total_amount_paid: 0,
        paid_amount: 0,
        due_amount: 0,
        language: '',
        currency: 'Euro',
        singature: '',
        signature_label: '',
        termas_conditions: "",
        addiontal_notes: '',
        lines: [
          {
            description: "",
            quantity: 0,
            unit: '',
            rate: 0,
            amount: 0,
          }
        ]
      }

      this.formCustomer = {
        full_name: '',
        phone: '',
        email: '',
        country: '',
        province: '',
        city: '',
        address: '',
        zip: '',
      }

      this.invoiceStage.hasData = false
    }
  }

})
