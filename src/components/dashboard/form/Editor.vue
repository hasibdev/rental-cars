<script setup>
import {ref} from 'vue'

const foreColor = ref()
const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
}
const link = () => {
    let userLink = prompt("Enter a URL");
    if (/http/i.test(userLink)) {
        modifyText('createLink', false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText('createLink', false, userLink);
    }
}
</script>

<template>
    <div>
        <div class="option-div">
            <div class="options">
                <!-- Text Format -->
                <button id="italic" class="option-button format" @click="modifyText('italic', false, 'italic')">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.8572 11V9.14285H13.7858V11H18.5586L14.5008 24H9.14293V25.8571H21.2144V24H16.4415L20.4994 11H25.8572Z" fill="black"/>
                    </svg>
                </button>
                <button id="bold" class="option-button format" @click="modifyText('bold', false, 'bold')">
                    <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.1968 23.9643V9.78248H16.8751C17.9184 9.78248 18.7886 9.93713 19.4857 10.2464C20.1828 10.5557 20.7068 10.9851 21.0576 11.5344C21.4085 12.0792 21.5839 12.707 21.5839 13.418C21.5839 13.9719 21.4731 14.459 21.2515 14.8791C21.0299 15.2945 20.7252 15.6362 20.3375 15.9039C19.9543 16.1671 19.5157 16.354 19.0218 16.4648V16.6033C19.5619 16.6264 20.0674 16.7787 20.5383 17.0604C21.0138 17.342 21.3992 17.7367 21.6947 18.2445C21.9902 18.7477 22.1379 19.3478 22.1379 20.0449C22.1379 20.7974 21.9509 21.4691 21.577 22.06C21.2077 22.6463 20.6606 23.1102 19.9358 23.4519C19.211 23.7935 18.3177 23.9643 17.256 23.9643H11.1968ZM14.1952 21.5129H16.6397C17.4752 21.5129 18.0846 21.3537 18.4678 21.0351C18.851 20.712 19.0425 20.2827 19.0425 19.7471C19.0425 19.3547 18.9479 19.0085 18.7586 18.7084C18.5693 18.4084 18.2993 18.1729 17.9484 18.0021C17.6022 17.8313 17.189 17.7459 16.7089 17.7459H14.1952V21.5129ZM14.1952 15.717H16.4181C16.8289 15.717 17.1936 15.6454 17.5122 15.5023C17.8353 15.3546 18.0892 15.1468 18.2739 14.8791C18.4632 14.6113 18.5578 14.2905 18.5578 13.9165C18.5578 13.4041 18.3755 12.9909 18.0108 12.677C17.6507 12.3631 17.1382 12.2061 16.4735 12.2061H14.1952V15.717Z" fill="black"/>
                    </svg>
                </button>
                <button id="underline" class="option-button format" @click="modifyText('underline', false, 'underline')">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.0242 9.78248H21.7415V19.1724C21.7415 20.1419 21.513 21.0074 21.056 21.7692C20.6035 22.5263 19.9642 23.1241 19.1378 23.5627C18.3115 23.9966 17.342 24.2136 16.2294 24.2136C15.1169 24.2136 14.1474 23.9966 13.3211 23.5627C12.4947 23.1241 11.853 22.5263 11.396 21.7692C10.9436 21.0074 10.7174 20.1419 10.7174 19.1724V9.78248H12.4347V19.0339C12.4347 19.7264 12.587 20.3427 12.8917 20.8828C13.1964 21.4183 13.6304 21.8407 14.1936 22.15C14.7614 22.4547 15.44 22.6071 16.2294 22.6071C17.0189 22.6071 17.6975 22.4547 18.2653 22.15C18.8331 21.8407 19.2671 21.4183 19.5671 20.8828C19.8718 20.3427 20.0242 19.7264 20.0242 19.0339V9.78248Z" fill="black"/>
                        <rect x="9.00003" y="27.25" width="15.3214" height="1.39286" fill="black"/>
                    </svg>
                </button>
                <button id="strikethrough" class="option-button format" @click="modifyText('strikeThrough', false, 'strikethrough')">
                    <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.4526 9.78248H21.17V19.1724C21.17 20.1419 20.9415 21.0074 20.4844 21.7692C20.032 22.5263 19.3926 23.1241 18.5663 23.5627C17.7399 23.9966 16.7705 24.2136 15.6579 24.2136C14.5453 24.2136 13.5759 23.9966 12.7495 23.5627C11.9232 23.1241 11.2815 22.5263 10.8244 21.7692C10.372 21.0074 10.1458 20.1419 10.1458 19.1724V9.78248H11.8632V19.0339C11.8632 19.7264 12.0155 20.3427 12.3202 20.8828C12.6249 21.4183 13.0588 21.8407 13.622 22.15C14.1899 22.4547 14.8685 22.6071 15.6579 22.6071C16.4473 22.6071 17.1259 22.4547 17.6938 22.15C18.2616 21.8407 18.6955 21.4183 18.9956 20.8828C19.3003 20.3427 19.4526 19.7264 19.4526 19.0339V9.78248Z" fill="black"/>
                        <rect x="8.4285" y="17.5" width="15.3214" height="1.39286" fill="black"/>
                    </svg>
                </button>
                <button id="createLink" class="option-button adv-option-button" @click="link">
                    <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.5644 20.8402C18.5317 20.8078 18.4875 20.7896 18.4414 20.7896C18.3954 20.7896 18.3512 20.8078 18.3185 20.8402L15.7897 23.3692C14.6188 24.5401 12.6428 24.6642 11.3501 23.3692C10.0552 22.0742 10.1792 20.1002 11.3501 18.9292L13.8789 16.4002C13.9464 16.3327 13.9464 16.2217 13.8789 16.1543L13.0127 15.288C12.98 15.2556 12.9358 15.2375 12.8898 15.2375C12.8437 15.2375 12.7995 15.2556 12.7668 15.288L10.238 17.8171C8.39687 19.6584 8.39687 22.6379 10.238 24.477C12.0791 26.3161 15.0584 26.3183 16.8974 24.477L19.4262 21.948C19.4937 21.8805 19.4937 21.7695 19.4262 21.702L18.5644 20.8402ZM24.1922 10.5238C22.3511 8.68253 19.3718 8.68253 17.5328 10.5238L15.0018 13.0528C14.9694 13.0856 14.9513 13.1298 14.9513 13.1758C14.9513 13.2219 14.9694 13.2661 15.0018 13.2988L15.8658 14.1628C15.9333 14.2303 16.0443 14.2303 16.1117 14.1628L18.6406 11.6338C19.8114 10.4629 21.7874 10.3388 23.0802 11.6338C24.375 12.9288 24.251 14.9028 23.0802 16.0737L20.5513 18.6028C20.5189 18.6355 20.5008 18.6797 20.5008 18.7257C20.5008 18.7718 20.5189 18.816 20.5513 18.8487L21.4175 19.7149C21.4849 19.7824 21.5959 19.7824 21.6634 19.7149L24.1922 17.1859C26.0312 15.3446 26.0312 12.3651 24.1922 10.5238ZM19.35 14.461C19.3173 14.4286 19.2731 14.4104 19.2271 14.4104C19.181 14.4104 19.1368 14.4286 19.1041 14.461L14.1749 19.3885C14.1425 19.4212 14.1243 19.4654 14.1243 19.5114C14.1243 19.5575 14.1425 19.6017 14.1749 19.6344L15.0367 20.4963C15.1041 20.5638 15.2151 20.5638 15.2826 20.4963L20.2097 15.5688C20.2771 15.5013 20.2771 15.3903 20.2097 15.3229L19.35 14.461Z" fill="black"/>
                    </svg>
                </button>
                <!-- Highlighter -->
                <div class="input-wrapper">
                    <input type="color" v-model="foreColor" id="foreColor" class="adv-option-button" @change="modifyText('foreColor', true, foreColor)" />
                    <!-- <input type="color" v-model="backColor" id="backColor" class="adv-option-button" @change="modifyText('backColor', true, backColor)" /> -->
                </div>
                <!-- Alignments -->
                <button id="justifyLeft" class="option-button align" @click="modifyText('justifyLeft', false, 'justifyLeft')">
                    <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.857 16.1071H7.32132" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M24.0357 11.9286H7.32141" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M24.0356 20.2857H7.32132" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M19.857 24.4643H7.32132" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button id="justifyCenter" class="option-button align" @click="modifyText('justifyCenter', false, 'justifyCenter')">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9285 16.1071H24.4642" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M9.1428 11.9286H27.2499" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M9.1428 20.2857H27.2499" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M11.9285 24.4643H24.4642" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button id="justifyRight" class="option-button align" @click="modifyText('justifyRight', false, 'justifyRight')">
                    <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.1431 16.1071H26.6788" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M9.96436 11.9286H26.6786" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M9.96449 20.2857H26.6788" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M14.1431 24.4643H26.6788" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                </button>
                <!-- List -->
                <button id="insertUnorderedList" class="option-button" @click="modifyText('insertUnorderedList', true, 'insertUnorderedList')">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.5713 16.1071H27.1071" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M10.3927 16.1071H11.7856" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M14.5713 11.9286H27.1071" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M10.3927 11.9286H11.7856" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M14.5713 20.2857H27.1071" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M10.3927 20.2857H11.7856" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M14.5713 24.4643H27.1071" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                        <path d="M10.3927 24.4643H11.7856" stroke="black" stroke-width="1.39286" stroke-linecap="square" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .option-div{
        display: flex;
        justify-content: flex-end;
        .options{
            background: rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            display: flex; 
            justify-content: flex-end;
            width: fit-content;
            align-items: center;
            flex-wrap: wrap;
            .option-button{
                border: none; 
            }
            .input-wrapper{
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f0f0;
                padding: 11px; 
                .adv-option-button{
                    width: 16.71px;
                    height: 16.71px;
                    border: 1.39286px solid white;
                    border-radius: 1.39286px;
                    cursor: pointer; 
                }
            }
        }
    }
</style>