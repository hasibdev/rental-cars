<template>
  <div class="section__header" :class="textLeft ? 'section__header-left' : ''">
    <h6 v-if="subtitle" class="section__header-subtitle">{{ subtitle }}</h6>
    <h1 v-if="title" class="section__header-title">{{ title }}</h1>
    <p
      v-if="description"
      class="section__header-desc"
      :style="{ width: descriptionWidth + '%' }"
    >
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    descriptionWidth: {
      type: Number,
      default: 40,
    },
    textLeft: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.section {
  &__header {
    text-align: center;
    &-subtitle {
      font-weight: 400;
      font-size: 1rem;
      color: var(--color-grey);
      margin-bottom: 0.75rem;
    }

    &-title {
      font-weight: 600;
      font-size: 3rem;
      color: var(--color-heading);
      margin-bottom: 1rem;
      line-height: 1.1;
      text-transform: capitalize;

      @include responsive-max('md') {
        font-size: 2.7rem;
        line-height: 1.2;
      }
    }

    &-desc {
      font-weight: 400;
      font-size: 1rem;
      color: var(--color-text);
      margin-bottom: 2rem;
      margin-right: auto;
      margin-left: auto;

      @include responsive-max('md') {
        width: 80% !important;
      }

      @include responsive-max('xs') {
        width: 95% !important;
      }
    }

    &-left {
      text-align: left;
      .section__header-desc {
        margin-left: 0;
        margin-right: auto;
      }
    }
  }
}
</style>
