<i18n lang="yaml">
{
  'en':
    {
      'first-name': 'First Name',
      'last-name': 'Last Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'text': 'Write you message here',
      'btn': 'SEND',
      'success-text': 'Request sent successfully',
      'error-text': 'Something wrong please try again',
    },
  'de':
    {
      'first-name': 'Vorname',
      'last-name': 'Nachname',
      'email': 'E-mail',
      'phone': 'Mobiltelefonnummer',
      'text': 'Nachricht',
      'btn': 'SENDEN',
      'success-text': 'Anfrage erfolgreich gesendet',
      'error-text': 'Etwas falsch, bitte versuchen Sie es erneut',
    },
}
</i18n>
<template>
  <div class="container p-0">
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col">
          <input v-model="form.first_name" class="contact_input" :class="{ error: errors.includes('firstName') }" type="text" :placeholder="$t('profile.first-name')" />
        </div>
        <div class="col">
          <input v-model="form.last_name" class="contact_input" :class="{ error: errors.includes('lastName') }" type="text" :placeholder="$t('profile.last-name')" />
        </div>
      </div>
      <div class="row mt-4">
        <div class="col">
          <input v-model="form.email" class="contact_input" :class="{ error: errors.includes('email') }" type="text" :placeholder="$t('form-fields.email')" />
        </div>
        <div class="col">
          <input v-model="form.phone_number" class="contact_input" :class="{ error: errors.includes('phone') }" type="text" :placeholder="$t('form-fields.phone')" />
        </div>
      </div>
      <div class="mt-4">
        <textarea v-model="form.messages" style="resize: none" class="textarea_input" :class="{ error: errors.includes('messages') }" rows="8" :placeholder="$t('form-fields.message')"></textarea>
      </div>
      <div class="d-grid mt-3">
        <button type="submit" class="contact_btn">
          {{ $t('button.submit') }}
        </button>
      </div>
    </form>
    <p v-if="message.title" class="message" :class="`${message.type}__message`">
      {{ message.title }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      errors: [],
      message: {
        title: null,
        type: null,
      },
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        messages: '',
      },
      initForm: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        messages: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      this.errors = []
      if (!this.form.first_name) {
        this.errors.push('firstName')
      }

      if (!this.form.last_name) {
        this.errors.push('lastName')
      }

      if (!this.form.email) {
        this.errors.push('email')
      }

      if (!this.form.phone_number) {
        this.errors.push('phone')
      }

      if (!this.form.messages) {
        this.errors.push('messages')
      }

      if (!this.errors.length) {
        this.submitForm()
      }
    },

    async submitForm() {
      try {
        const data = await this.$axios.$post('api/contact-store', this.form)
        if (data) {
          this.message.title = this.$t('success-text')
          this.message.type = 'success'
          this.reset()
        }
      } catch (error) {
        if (error.response.data) {
          this.message.title = this.$t('error-text')
          this.message.type = 'error'
        }
      }
    },

    reset() {
      Object.assign(this.form, this.initForm)
    },
  },
}
</script>

<style scoped>
.contact_input {
  width: 100%;
  height: 2.75rem;
  border: none;
  outline: none;
  padding: 0rem 0.8rem;
  background: #f0f0f0;
  border-radius: 0.25rem;
}
.textarea_input {
  width: 100%;
  border: none;
  outline: none;
  padding: 1rem 0.8rem;
  background: #f0f0f0;
  border-radius: 0.25rem;
}
::placeholder {
  color: #4f4444;
  font-size: 1rem;
}
.contact_btn {
  outline: none;
  box-shadow: none;
  border-radius: 0.25rem;
  border: none;
  background-color: var(--color-dark);
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  padding: 0.6rem;
  transition: all 0.5s ease;
}

.message {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}
.success__message {
  color: var(--color-success);
}
.error__message {
  color: var(--color-error);
}

.error {
  border-color: var(--color-error);
  caret-color: var(--color-error);
  /* background-color: rgba(255, 82, 82, 0.18); */
}
.contact_btn:hover {
  background-color: var(--color-primary);
}
@media (max-width: 768px) {
}
@media (max-width: 576px) {
  ::placeholder {
    font-size: 0.938rem;
  }
}
</style>
