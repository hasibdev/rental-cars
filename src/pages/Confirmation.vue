<script setup>
    import {ref} from 'vue'
    import { api } from '@/use/useAxios'
    import { useRoute, useRouter } from 'vue-router'
    import { useI18n } from 'vue-i18n'
    import ModalControl from '../components/common/modals/ModalControl.vue'

    const { t } = useI18n({ useScope: 'global' })
    
    const route = useRoute()
    const router = useRouter()

    const sucessModalStatus = ref(false)
    const errorModalStatus = ref(false)
    const fetchData = async () =>{
        try {
            await api.get(`customer-confirm-reservation/${route.params.id}`)
            sucessModalStatus.value = true; 
            // if(res.status == 200){
            //     sucessModalStatus.value = true; 
            // }
            // else{
            //     errorModalStatus.value = true;
            // }
        } catch {
            errorModalStatus.value = true;
        }
    }
    const goToHome = () => {
        sucessModalStatus.value = false 
        errorModalStatus.value = false 
        router.push('/')
    }
    fetchData()
</script>

<template>
    <div class="container" style="height: 60vh;">
        
    </div>
    <!-- Success Modal -->
    <ModalControl v-model="sucessModalStatus" @onHide="goToHome">
        <div class="modal-body">
            <div class="text-center">
                <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="42.5" cy="42.5" r="42.5" fill="#C5FCDE" />
                <path d="M59.6663 30.5L36.7497 53.4167L26.333 43" stroke="#1BCE6C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <h2 class="text-success mt-3 mb-5">{{t('text.success')}}</h2>
                <p>{{t('text.your-reservation-is-successful')}}</p>
                <button class="btn btn-success mt-4" @click="goToHome">
                    {{t('button.close')}}
                </button>
            </div>
        </div>
    </ModalControl>

    <ModalControl v-model="errorModalStatus" @onHide="goToHome">
        <div class="modal-body">
            <div class="text-center">
                <!-- <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="42.5" cy="42.5" r="42.5" fill="#C5FCDE" />
                <path d="M59.6663 30.5L36.7497 53.4167L26.333 43" stroke="#1BCE6C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                </svg> -->
                <h2 class="text-danger mt-3 mb-5">{{t('text.error')}}</h2>
                <p>{{t('text.your-reservation-is-unsuccessful')}}</p>
                <p class="text-decoration-none mt-3">{{t('text.go-to-home-page')}}</p>
                <button class="btn btn-danger mt-4"  @click="goToHome">
                    {{t('button.close')}}
                </button>
            </div>
        </div>
    </ModalControl>
</template>