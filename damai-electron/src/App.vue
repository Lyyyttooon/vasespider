<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { ElButton, ElForm, ElFormItem } from 'element-plus'

const form = reactive({
  itemId: '',
  cookie: '',
  ticketsNum: 1,
  sessionNum: 1
})

onMounted(() => {
  damaiRequest.getTicketsInfo()

  if (window.baxiaCommon) {
    try {
      window.baxiaCommon.init({
        checkApiPath: function (i: string | string[]) {
          return (
            -1 < i.indexOf('mtop.trade.order.build.h5') ||
            -1 < i.indexOf('mtop.trade.order.create.h5')
          )
        }
      })
    } catch (e) {
      console.error('初始化 baxia 失败', e)
    }
  }
})
</script>

<template>
  <ElForm :model="form" label-width="120px">
    <ElFormItem label="itemId" label-width="120px">
      <el-input v-model="form.itemId" />
    </ElFormItem>
    <ElFormItem label="cookie" label-width="120px">
      <el-input v-model="form.cookie" />
    </ElFormItem>
    <ElFormItem label="票数" label-width="120px">
      <el-input v-model="form.ticketsNum" />
    </ElFormItem>
    <ElFormItem label="票次" label-width="120px">
      <el-input v-model="form.ticketsNum" />
    </ElFormItem>
    <ElButton>按钮</ElButton>
  </ElForm>
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
