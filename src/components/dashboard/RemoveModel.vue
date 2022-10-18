<template>
  <b-model v-model="openModel" title="Block warning">
    <div class="block-model">
      <p class="block-model__dec">
        Are you sure want to {{ block ? "block" : "remove" }}
        <!-- <strong>{{ user.name }}</strong> ? -->
      </p>
      <BTextarea v-model="message" :height="150" :placeholder="$t('text.add-a-note-here')" />
      <div class="block-model__action">
        <button @click="close" class="block-model__action-btn base-btn base-btn--light">
          Cancel
        </button>
        <button @click="submit" class="block-model__action-btn base-btn base-btn--error">
          {{ block ? "Block" : "Remove" }}
        </button>
      </div>
    </div>
  </b-model>
</template>

<script>
import axios from "axios"
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
    endPoint: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      openModel: this.open,
      message: "",
    }
  },
  methods: {
    submit(id) {
      if (this.block) {
        try {
          axios.post(this.endPoint, this.selectToBlock.message)
        } catch (err) {
          console.error(err)
        }
        this.$emit("submit", this.user.id)
        console.error("customer", id, this.message)
      } else {
        try {
          axios.get(this.endPoint)
        } catch (err) {
          console.error(err)
        }
        this.$emit("submit", this.user.id)
      }
    },
    close() {
      this.$emit("close", true)
    },
  },
};
</script>

<style lang="scss" scoped>
.block-model {
  &__action {
    text-align: left;
    display: flex;
    justify-content: flex-end;

    &-btn {
      padding: 8px 25px;
    }
  }
}
</style>
