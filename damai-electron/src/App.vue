<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadio,
  ElRadioGroup
} from 'element-plus'
import { getTicketsInfo, getPerformInfo, buildOrder, submitOrder } from '@/utils/dm'

export interface formStruct {
  [key: string]: string | number
  itemId: string
  cookie: string
  token: string
  ticketsNum: number
  sessionNum: number
  gradeNum: number
  ticketLessMode: string
}

const form: formStruct = reactive({
  itemId: '',
  cookie: '',
  token: '',
  ticketsNum: 1,
  sessionNum: 1,
  gradeNum: 1,
  ticketLessMode: 'low'
})

onBeforeMount(() => {
  getFormData()
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

async function onClick() {
  form.token = parseCookie(form.cookie)

  store(form)

  let ticketsInfo = await getTicketsInfo(form)
  if (ticketsInfo === null) {
    return
  }
  if (ticketsInfo.performIdList.length < form.sessionNum) {
    return
  }
  let performInfo = await getPerformInfo(form, ticketsInfo.performIdList[form.sessionNum - 1])
  console.log(performInfo)
  let orderInfo = await buildOrder(form, performInfo.sku.skuId)
  console.log(orderInfo)
  let submitInfo = await submitOrder(form, orderInfo.data)
  console.log(submitInfo)
}

function parseCookie(cookie: string): string {
  let strArray = cookie.split('; ')
  for (let i = 0; i < strArray.length; i++) {
    if (strArray[i].startsWith('_m_h5_tk=')) {
      let str = strArray[i]
      let token = str.replace('_m_h5_tk=', '').split('_')[0]
      return token
    }
  }
  return ''
}

function store(data: formStruct) {
  for (let k in data) {
    localStorage.setItem(k, `${data[k]}`)
  }
}
</script>

<template>
  <div class="m-16 flex justify-center">
    <ElForm class="max-w-screen-md flex-1" :model="form" label-width="120px">
      <ElFormItem label="Cookie">
        <ElInput v-model="form.cookie" />
      </ElFormItem>
      <ElFormItem label="演出ID">
        <ElInput v-model="form.itemId" />
      </ElFormItem>
      <ElFormItem label="演出场次">
        <ElInputNumber v-model="form.sessionNum" :min="1" :max="10" />
      </ElFormItem>
      <ElFormItem label="门票数量">
        <ElInputNumber v-model="form.ticketsNum" :min="1" :max="10" />
      </ElFormItem>
      <ElFormItem label="门票档次">
        <ElInputNumber v-model="form.gradeNum" :min="1" :max="10" />
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
