<template>
  <div class="profile-uploader">
    <div class="profile-uploader__preview">
      <img v-if="url || image" :src="url || image" alt="" />
      <span v-else class="icon"><svg width="92" height="93" viewBox="0 0 92 93" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M46 87.3998C68.8643 87.3998 87.4 68.8641 87.4 45.9998C87.4 23.1355 68.8643 4.59976 46 4.59976C23.1357 4.59976 4.6 23.1355 4.6 45.9998C4.6 68.8641 23.1357 87.3998 46 87.3998ZM46 91.9998C71.4058 91.9998 92 71.4056 92 45.9998C92 20.594 71.4058 -0.000244141 46 -0.000244141C20.5942 -0.000244141 0 20.594 0 45.9998C0 71.4056 20.5942 91.9998 46 91.9998Z" fill="#CCCCCC" />
          <path d="M18.4004 72.7484C18.4004 70.3725 20.176 68.3646 22.5404 68.1024C40.2849 66.1382 51.7964 66.3153 69.5018 68.1461C70.3859 68.239 71.2239 68.5873 71.9133 69.1485C72.6028 69.7098 73.1139 70.4597 73.3841 71.3066C73.6544 72.1535 73.6722 73.0608 73.4353 73.9177C73.1984 74.7746 72.7171 75.5439 72.0502 76.1317C51.1547 94.3454 39.2131 94.0947 19.8724 76.1501C18.9294 75.2761 18.4004 74.0341 18.4004 72.7507V72.7484Z" fill="#CCCCCC" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M69.2641 70.4339C51.699 68.6169 40.3531 68.4467 22.7903 70.3902C22.2122 70.4576 21.6792 70.7358 21.2935 71.1716C20.9077 71.6075 20.6963 72.1703 20.6996 72.7523C20.6996 73.4101 20.9733 74.0334 21.4356 74.4658C31.022 83.3576 38.2854 87.3757 45.3855 87.401C52.5109 87.4263 60.1653 83.4404 70.5383 74.4014C70.8679 74.1081 71.1051 73.7254 71.2212 73.2997C71.3373 72.8741 71.3272 72.424 71.1923 72.0039C71.0573 71.5839 70.8032 71.2122 70.4609 70.9338C70.1186 70.6555 69.7028 70.4826 69.2641 70.4362V70.4339ZM22.2866 65.8178C40.2174 63.8329 51.8968 64.0123 69.7402 65.8592C71.0703 65.998 72.3311 66.5217 73.3682 67.366C74.4052 68.2103 75.1736 69.3387 75.5793 70.613C75.9849 71.8873 76.0102 73.2523 75.6521 74.5408C75.2939 75.8292 74.5679 76.9853 73.5628 77.8675C63.0403 87.0399 54.2773 92.0355 45.3717 92.001C36.4408 91.9688 28.0642 86.8881 18.3099 77.8376C17.6115 77.1871 17.0548 76.3996 16.6745 75.5242C16.2942 74.6488 16.0985 73.7044 16.0996 72.75C16.0963 71.0352 16.7257 69.3794 17.8673 68.0999C19.009 66.8203 20.5825 66.0069 22.2866 65.8155V65.8178Z" fill="#CCCCCC" />
          <path d="M64.3988 36.8C64.3988 41.6799 62.4603 46.3599 59.0097 49.8105C55.5591 53.2611 50.8791 55.1996 45.9992 55.1996C41.1193 55.1996 36.4393 53.2611 32.9887 49.8105C29.5381 46.3599 27.5996 41.6799 27.5996 36.8C27.5996 31.9201 29.5381 27.2401 32.9887 23.7895C36.4393 20.3389 41.1193 18.4004 45.9992 18.4004C50.8791 18.4004 55.5591 20.3389 59.0097 23.7895C62.4603 27.2401 64.3988 31.9201 64.3988 36.8Z" fill="#CCCCCC" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M45.9992 50.5997C49.6591 50.5997 53.1691 49.1458 55.7571 46.5579C58.345 43.9699 59.7989 40.4599 59.7989 36.8C59.7989 33.1401 58.345 29.6301 55.7571 27.0421C53.1691 24.4542 49.6591 23.0003 45.9992 23.0003C42.3393 23.0003 38.8293 24.4542 36.2414 27.0421C33.6534 29.6301 32.1995 33.1401 32.1995 36.8C32.1995 40.4599 33.6534 43.9699 36.2414 46.5579C38.8293 49.1458 42.3393 50.5997 45.9992 50.5997ZM45.9992 55.1996C50.8791 55.1996 55.5591 53.2611 59.0097 49.8105C62.4603 46.3599 64.3988 41.6799 64.3988 36.8C64.3988 31.9201 62.4603 27.2401 59.0097 23.7895C55.5591 20.3389 50.8791 18.4004 45.9992 18.4004C41.1193 18.4004 36.4393 20.3389 32.9887 23.7895C29.5381 27.2401 27.5996 31.9201 27.5996 36.8C27.5996 41.6799 29.5381 46.3599 32.9887 49.8105C36.4393 53.2611 41.1193 55.1996 45.9992 55.1996Z" fill="#CCCCCC" />
        </svg>
      </span>
      <input @input="$emit('update:modelValue', $event.target.files[0])" @change="onFileChange" class="profile-uploader__input" type="file" id="profileUpload" />
    </div>
    <label :style="cssVar" for="profileUpload" class="profile-uploader__btn">Upload Profile Picture</label>
  </div>
</template>

<script>
  import { computed, ref } from "vue" 
  export default {
    props: {
      modelValue: {
        type: [String, Object],
        required: true,
      },
      color: {
        type: String,
        default: null,
      },
      image: {
        type: String,
        default: null,
      },
    },
    setup(props) {
      const url = ref("")

      const onFileChange = (e) => {
        const file = e.target.files[0]
        url.value = URL.createObjectURL(file)
      }

      const cssVar = computed(() => {
        return props.color ? { "--color-primary": props.color } : ""
      })
      return {
        onFileChange,
        cssVar,
        url,
      }
    },
    
  };
</script>

<style lang="scss" scoped>
  .profile-uploader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1.5rem;
    padding: 0.875rem 0;

    &__preview {
      width: 7rem;
      border-radius: 50%;
      height: 7rem;
      box-shadow: 0px 4px 16px rgb(0 0 0 / 16%);
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .icon svg {
        width: 100%;
        height: 100%;
      }
    }

    &__input {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      opacity: 0;
      bottom: 0;
    }

    &__btn {
      outline: none;
      border: 1px solid var(--color-primary);
      padding: 6px 12px;
      border-radius: 4px;
      text-transform: capitalize;
      font-size: 15px;
      font-weight: 500;
      background-color: transparent;
      color: var(--color-primary);
      cursor: pointer;
    }
  }
</style>
