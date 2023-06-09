<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup
} from 'element-plus'
import { getBxua, getUmid } from '@/utils/baxia'
import { stringLiteral } from '@babel/types'

interface formStruct {
  [key: string]: string | number
  itemId: string
  cookie: string
  token: string
  ticketsNum: number
  sessionNum: number
}

const form: formStruct = reactive({
  itemId: '',
  cookie: '',
  token: '',
  ticketsNum: 1,
  sessionNum: 1,
  ticketLessMode: 'low'
})

onMounted(() => {
  getFormData()
  console.log(getBxua(), getUmid())
})

function getFormData() {
  for (let k in form) {
    let str: string | null = localStorage.getItem(k)
    if (str === null) {
      continue
    }
    switch (typeof form[k]) {
      case 'string': {
        form[k] = str
        break
      }
      case 'number': {
        form[k] = +str
        break
      }
    }
  }
}

function parseCookie(cookie: string): string {
  let str = cookie.replace(' ', '')
  let strArray = str.split(';')
  for (let i = 0; i < strArray.length; i++) {
    if (strArray[i].startsWith('_m_h5_tk=')) {
      str = strArray[i]
      break
    }
  }
  let tokenWithTime = str.split('=')[1]
  let token = tokenWithTime.split('_')[0]
  console.log(token)
  return token
}

function onClick() {
  form.token = parseCookie(form.cookie)
  localStorage.setItem('token', form.token)

  for (let k in form) {
    localStorage.setItem(k, `${form[k]}`)
  }

  console.log(JSON.stringify(form))
  damaiRequest.getTicketsDetail(JSON.stringify(form))
}
</script>

<template>
  <div class="m-16 flex justify-center">
    <ElForm class="max-w-screen-md flex-1" :model="form" label-width="120px">
      <ElFormItem label="演出ID">
        <ElInput v-model="form.itemId" />
      </ElFormItem>
      <ElFormItem label="Cookie">
        <ElInput v-model="form.cookie" />
      </ElFormItem>
      <ElFormItem label="门票数量">
        <ElInputNumber v-model="form.ticketsNum" :min="1" :max="10" />
      </ElFormItem>
      <ElFormItem label="门票档次">
        <ElInputNumber v-model="form.sessionNum" :min="1" :max="10" />
      </ElFormItem>
      <ElFormItem label="无票模式">
        <ElRadioGroup v-model="form.ticketLessMode">
          <ElRadio label="low">低价优先</ElRadio>
          <ElRadio label="high">高价优先</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="onClick">确定</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
