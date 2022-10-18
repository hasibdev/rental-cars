<template>
  <div class="documents">
    <h3 class="documents__title">documents</h3>
    <ul class="documents__list">
      <li
        v-for="(doc, index) in 4"
        :key="doc"
        class="documents__list-item"
      >
        <app-link class="documents-title" path="/">
          {{ index + 1 }}. Amet minim mollit non deserunt ullamco est sit aliqua
          dolor do
        </app-link>
        <button class="base-btn documents-btn">
          <span class="icon">
            <IconDownload />
          </span>
          Download
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import IconDownload from "@/icons/IconDownload.vue";
export default {
    components: {
        IconDownload,
    },
};
</script>

<style lang="scss" scoped>
.documents {
  padding: 1rem 0;
  border: 1px solid var(--color-light-grey-2);
  border-radius: 5px;

  &__title {
    padding: 0 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: capitalize;
    color: var(--color-heading);
    margin-bottom: 1rem;
  }
  &__list {
    padding: 0 1rem;
    height: 200px;
    overflow: auto;
    scrollbar-width: thin;

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

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 1rem;
      }

      .documents-title {
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0;
        margin-right: 1.5rem;
        white-space: nowrap;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .documents-btn {
        border: 1px solid var(--color-secondary);
        color: var(--color-secondary);
        display: flex;
        align-items: flex-end;

        svg {
          stroke: var(--color-secondary);
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
