<template>
  <b-model v-model="isModal" width="450">
    <div class="alert-modal">
      <div class="alert-modal__icon">
        <IconCheckAlt />
      </div>
      <h5 class="alert-modal__title">Successful</h5>
    </div>
  </b-model>
</template>

<script>
import BModel from "../../base/BModel.vue";
import { IconCheckAlt } from "@/icons";
export default {
  components: {
    BModel,
    IconCheckAlt,
  },
  data() {
    return {
      isModal: false,
    };
  },
  methods: {
    showAlert() {
      this.isModal = true;
      setTimeout(() => {
        this.isModal = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-modal {
  text-align: center;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__icon {
    --size: 70px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: #c5fcde;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    margin-bottom: 1.5rem;

    svg {
      stroke: var(--color-success);
    }
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-success);
    margin-bottom: 2rem;
  }
}
</style>
