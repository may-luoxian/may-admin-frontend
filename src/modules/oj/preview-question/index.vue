<template>
  <div class="may-container flex gap-4">
    <div class="w-1/2">
      <el-card class="left-content">
        <template #header>
          <el-button class="inline-block" text>题目描述</el-button>
        </template>
        <h1 class="text-3xl font-semibold mb-8">{{ question.data.title }}</h1>
        <div class="mb-2 pb-2 text-lg border-b border-slate-300 border-solid dark:border-slate-600">
          <div class="text-xl font-semibold mb-2">判题条件</div>
          <span class="inline-block mr-20">时间限制（ms）：{{ data.judgeConfig?.timeLimit }}</span>
          <span class="inline-block mr-20">内存限制（kb）：{{ data.judgeConfig?.memoryLimit }}</span>
          <span class="inline-block">堆栈限制（kb）：{{ data.judgeConfig?.stackLimit }}</span>
        </div>
        <MdViewer :value="viewerValue" />
      </el-card>
    </div>
    <div class="right-content w-1/2 flex flex-col gap-4">
      <el-card class="monaco-card h-2/3">
        <template #header>
          <el-select v-model="language" placeholder="代码" style="width: 140px">
            <el-option v-for="item in QuestionSubmitLanguageEnum" :key="item.id" :value="item.value" :label="item.message"></el-option>
          </el-select>
        </template>
        <MonacoEditor ref="monacoRef" v-model:code="code" :language="language" />
        <template #footer>
          <div class="float-right">
            <el-button type="primary" :loading="loading" @click="handleDebug">Debug</el-button>
            <el-button type="success" :loading="loading" @click="handleSubmit">提交</el-button>
          </div>
        </template>
      </el-card>
      <el-card class="judge-case h-1/3">
        <template #header>
          <el-button class="inline-block" :class="activeTab === 1 ? 'is-active' : ''" text @click="handleChangeTab(1)">测试用例</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button class="inline-block" :class="activeTab === 2 ? 'is-active' : ''" text @click="handleChangeTab(2)">测试结果</el-button>
        </template>
        <JudgeCaseCard ref="judgeCaseCardRef" :debugResult="debugResult" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import JudgeCaseCard from '@/modules/oj/preview-question/JudgeCaseCard.vue';
// import Akchart from '@/modules/oj/preview-question/Akchart.vue';
import { useRoute } from 'vue-router';
import { MonacoEditor } from '@/components/monacoEditor';
import { MdViewer } from '@/components/bytemd';
import { ref, onMounted, reactive, toRefs } from 'vue';
import { defHttp } from '@/utils/http/axios';
import { ElNotification } from 'element-plus';
import { QuestionSubmitLanguageEnum } from '@/modules/oj/constant';

const route = useRoute();

const loading = ref(false);

const inParameterNum = ref(0);
const judgeCaseCardRef = ref();

const statisticalData = ref({
  errorNum: 0,
  acceptNum: 0,
});

const question = reactive<any>({
  data: {},
  language: 'java',
  viewerValue: '',
});

let debugResult = ref<any>({});

const { data, viewerValue, language } = toRefs(question);
const code = ref('');
const monacoRef = ref();

let activeTab = ref(1);

onMounted(() => {
  let id = route.params.id;
  defHttp
    .get({
      url: `/oj/question/selectById/${id}`,
    })
    .then((res) => {
      question.data = res.data;
      question.viewerValue = res.data.content;
      monacoRef.value.changeCode(res.data.questionTemplate);
      statisticalData.value.errorNum = res.data.submitNum - res.data.acceptNum;
      statisticalData.value.acceptNum = res.data.acceptNum;
      if (res.data.judgeCase[0] && res.data.judgeCase[0].input) {
        inParameterNum.value = res.data.judgeCase[0].input.split(' ').length;
      }
    });
});

/**
 * 点击debug
 */
const handleDebug = () => {
  loading.value = true;
  if (!judgeCaseCardRef.value) {
    ElNotification.warning({
      title: 'Success',
      message: '请切换到测试用例标签，并输入测试用例',
    });
    return;
  }
  defHttp
    .post({
      url: '/oj/questionSubmit/debug',
      data: {
        questionId: data.value.id,
        language: language.value,
        code: code.value,
        input: judgeCaseCardRef.value.input,
      },
    })
    .then((res) => {
      debugResult.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
};
/**
 * 点击提交
 */
const handleSubmit = () => {
  loading.value = true;
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
      ElNotification.success({
        title: 'Success',
        message: res.message,
      });
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });
};

const handleChangeTab = (tab: number) => {
  activeTab.value = tab;
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
  /* height: calc(32.8% - 1rem); */
  :deep(.el-card__header) {
    @apply px-4 py-0 leading-10 h-10;
  }
  :deep(.el-card__body) {
    overflow: auto;
    height: 100%;
  }
}

.right-content {
  height: calc(100vh - 120px);
}

.is-active {
  background-color: var(--button-active-bg);
}
</style>
