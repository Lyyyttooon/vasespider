<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber } from 'element-plus'
import { getBxua, getUmid } from '@/utils/baxia'

interface formStruct {
  [key: string]: string | number
  itemId: string
  cookie: string
  ticketsNum: number
  sessionNum: number
}

const form: formStruct = reactive({
  itemId: '',
  cookie: '',
  ticketsNum: 1,
  sessionNum: 1
})

onMounted(() => {
  getFormData()
  damaiRequest.getTicketsInfo()
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

function onClick() {
  for (let k in form) {
    localStorage.setItem(k, `${form[k]}`)
  }
}
</script>

<template>
  <div class="m-16 flex justify-center">
    <ElForm class="max-w-screen-md flex-1" :model="form" label-width="120px">
      <ElFormItem label="演出itemId">
        <ElInput v-model="form.itemId" />
      </ElFormItem>
      <ElFormItem label="Cookie">
        <ElInput v-model="form.cookie" />
      </ElFormItem>
      <ElFormItem label="票数">
        <ElInputNumber v-model="form.ticketsNum" :min="1" :max="10" />
      </ElFormItem>
      <ElFormItem label="票次">
        <ElInputNumber v-model="form.sessionNum" :min="1" :max="10" />
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
