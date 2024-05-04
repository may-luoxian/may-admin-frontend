<template>
  <div class="may-container flex gap-4">
    <div class="w-1/2">
      <el-card class="left-content">
        <template #header>
          <el-button class="inline-block" text>题目描述</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="inline-block" text>提交记录</el-button>
        </template>
        <MdViewer :value="viewerValue" />
      </el-card>
    </div>
    <div class="w-1/2 flex flex-col gap-4">
      <el-card class="monaco-card h-2/3">
        <template #header>
          <el-select v-model="language" placeholder="代码" style="width: 140px">
            <el-option v-for="item in QuestionSubmitLanguageEnum" :key="item.id" :value="item.value" :label="item.message"></el-option>
          </el-select>
        </template>
        <MonacoEditor v-model:code="code" :language="language" />
        <template #footer>
          <div class="float-right">
            <el-button @click="handleOperation">运行</el-button>
            <el-button type="success" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </el-card>
      <el-card class="judge-case h-1/3">
        <template #header>
          <el-button class="inline-block" text>测试结果</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="inline-block" text>测试用例</el-button>
        </template>
        <JudgeCaseCard :judgeCase="data.judgeCase" v-model:activeCase="activeCase" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import JudgeCaseCard from '@/modules/oj/do-question/preview-question/JudgeCaseCard.vue';

import { useRoute } from 'vue-router';
import { MonacoEditor } from '@/components/monacoEditor';
import { MdViewer } from '@/components/bytemd';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { ElNotification } from 'element-plus';
import { QuestionSubmitLanguageEnum } from '@/modules/oj/constant';

const route = useRoute();

const question = reactive<any>({
  data: {},
  language: 'javascript',
  viewerValue: '',
});
const { data, viewerValue, language } = toRefs(question);
const activeCase = ref(0);
const code = ref('');

onMounted(() => {
  let id = route.params.id;
  defHttp
    .get({
      url: `/oj/question/selectById/${id}`,
    })
    .then((res) => {
      question.data = res.data;
      question.viewerValue = `### ${res.data.title}\n${res.data.content}`;
    });
});

/**
 * 点击运行
 */
const handleOperation = () => {
  if (!data.value.judgeCase.value) {
    ElNotification.warning({
      title: 'warning',
      message: '不存在测试用例',
    });
    return;
  }
  const input = data.value.judgeCase.value[activeCase.value].input;
  console.log(input, code.value);
};
/**
 * 点击提交
 */
const handleSubmit = () => {
  defHttp
    .post({
      url: '/oj/questionSubmit/submit',
      data: {
        questionId: data.value.id,
        language: language.value,
        code: code.value,
      },
    })
    .then((res) => {
      ElNotification.warning({
        title: 'warning',
        message: res.message,
      });
    });
};
</script>

<style lang="scss" scoped>
.left-content {
  :deep(.el-card__header) {
    @apply px-2 py-0 h-10 leading-10;
  }
  :deep(.el-card__body) {
    height: calc(100vh - 160px);
    @apply overflow-auto;
  }
}
.monaco-card {
  :deep(.el-card__body) {
    height: calc(100% - 80px);
  }
  :deep(.el-card__header) {
    @apply px-4 py-0 leading-10 h-10;
  }
  :deep(.el-card__footer) {
    @apply px-4 py-0 leading-10 h-10;
  }
}
.judge-case {
  :deep(.el-card__header) {
    @apply px-4 py-0 leading-10 h-10;
  }
}
</style>
