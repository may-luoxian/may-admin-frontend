<template>
  <div class="h-full">
    <header class="may-title px-4">
      <span>创建题目</span>
      <div class="float-right">
        <el-button type="primary" :loading="loading" @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
      </div>
    </header>
    <main class="may-container mx-12">
      <el-form :model="question" label-width="120">
        <el-form-item label="标题：">
          <el-input v-model="question.title" placeholder="请输入题目标题"></el-input>
        </el-form-item>
        <el-form-item label="标签：">
          <el-select class="w-full" v-model="question.tags" multiple filterable allow-create default-first-option :reserve-keyword="false" placeholder="请输入题目标签">
            <el-option v-for="(item, index) in tagsOption" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目内容：" style="height: 500px">
          <MdEditor class="w-full" :value="question.content" @update:value="handleUpdateContent" />
        </el-form-item>
        <el-form-item label="答案：" style="height: 500px">
          <MdEditor class="w-full" :value="question.answer" @update:value="handleUpdateAnswer" />
        </el-form-item>
        <el-form-item label="判题配置：" class="form-block">
          <div class="mb-4">时间限制：<el-input-number v-model="question.judgeConfig.timeLimit" :min="1" :max="10000" style="width: 320px" /></div>
          <div class="mb-4">内存限制：<el-input-number v-model="question.judgeConfig.memoryLimit" :min="1" :max="10000" style="width: 320px" /></div>
          <div class="mb-4">堆栈限制：<el-input-number v-model="question.judgeConfig.stackLimit" :min="1" :max="10000" style="width: 320px" /></div>
        </el-form-item>
        <el-form-item label="测试用例配置：" class="form-block">
          <div class="mb-6" v-for="(item, index) in question.judgeCase" :key="index">
            <div class="mb-4 w-full">输入用例-{{ index + 1 }}：<el-input class="inline-block" v-model="item.input" style="width: 400px"></el-input></div>
            <div class="mb-4 w-full">输出用例-{{ index + 1 }}：<el-input class="inline-block" v-model="item.output" style="width: 400px"></el-input></div>
            <el-button type="danger" @click="handleDeleteCase(index)">删除</el-button>
          </div>
          <el-button class="mb-2" type="success" @click="handleAddCase">新增测试用例</el-button>
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { MdEditor } from '@/components/bytemd';
import { defHttp } from '@/utils/http/axios';
import { reactive, toRefs, ref } from 'vue';
import { ElNotification } from 'element-plus';

interface Form {
  question: Question;
  tagsOption: Array<string>;
}

interface Question {
  title: string; // 题目标题
  content: string; // 题目内容
  tags: Array<any>; // 标签
  answer: string; // 答案
  judgeConfig: JudgeConfig; // 判题配置
  judgeCase: Array<JudgeCase>; // 判题用例
}

// 用例
interface JudgeCase {
  input: string;
  output: string;
}

interface JudgeConfig {
  timeLimit: number; // 时间限制
  memoryLimit: number; // 内存限制
  stackLimit: number; // 堆栈限制
}

const form = reactive<Form>({
  question: {
    title: '',
    content: '',
    tags: [],
    answer: '',
    judgeConfig: {
      timeLimit: 1000,
      memoryLimit: 1000,
      stackLimit: 1000,
    },
    judgeCase: [],
  },
  tagsOption: [],
});

const loading = ref(false);

let { question, tagsOption } = toRefs(form);

const handleAddCase = () => {
  question.value.judgeCase.push({
    input: '',
    output: '',
  });
};

const handleDeleteCase = (index: number) => {
  question.value.judgeCase.splice(index, 1);
};

const handleSubmit = () => {
  loading.value = true;
  defHttp
    .post({
      url: '/oj/question/',
      data: question.value,
    })
    .then((res) => {
      ElNotification({
        title: 'success',
        type: 'success',
        message: res.message,
      });
      handleReset();
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleReset = () => {
  form.question = {
    title: '',
    content: '',
    tags: [],
    answer: '',
    judgeConfig: {
      timeLimit: 1000,
      memoryLimit: 1000,
      stackLimit: 1000,
    },
    judgeCase: [],
  };
  form.tagsOption = [];
};

const handleUpdateContent = (v: string) => {
  question.value.content = v;
};

const handleUpdateAnswer = (v: string) => {
  question.value.answer = v;
};
</script>

<style lang="scss" scoped>
:deep(.form-block .el-form-item__content) {
  display: block;
}
</style>
