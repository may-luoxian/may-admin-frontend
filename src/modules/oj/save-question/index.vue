<template>
  <div class="may-container">
    <div class="may-card">
      <header class="may-title px-4">
        <span>创建题目</span>
        <div class="float-right">
          <el-button type="primary" :loading="loading" @click="handleReset">重置</el-button>
          <el-button type="primary" :loading="loading" @click="handleSubmit">提交</el-button>
        </div>
      </header>
      <main class="mx-12">
        <el-form ref="formRef" :model="question" label-width="120">
          <el-form-item prop="title" label="标题：" :rules="formRules.title">
            <el-input v-model="question.title" placeholder="请输入题目标题"></el-input>
          </el-form-item>
          <el-form-item prop="difficulty" label="难度：" :rules="formRules.difficulty">
            <el-select v-model="question.difficulty" placeholder="请选择题目难度">
              <el-option v-for="item in QuestionDifficulty" :key="item.id" :value="item.id" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="tags" label="标签：" :rules="formRules.tags">
            <el-select class="w-full" v-model="question.tags" multiple filterable allow-create default-first-option :reserve-keyword="false" placeholder="请输入题目标签">
              <!-- <el-option v-for="(item, index) in tagsOption" :key="index" :label="item" :value="item" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="判题配置：" :rules="formRules.judgeConfig" prop="judgeConfig">
            <div class="mr-12 mb-2">时间限制（ms）：<el-input-number v-model="question.judgeConfig.timeLimit" :min="1" :max="10000" style="width: 320px" /></div>
            <div class="mr-12 mb-2">内存限制（MB）：<el-input-number v-model="question.judgeConfig.memoryLimit" :min="1" :max="10000" style="width: 320px" /></div>
            <!-- <div class="mr-12 mb-2">堆栈限制：<el-input-number v-model="question.judgeConfig.stackLimit" :min="1" :max="10000" style="width: 320px" /></div> -->
          </el-form-item>
          <el-form-item prop="content" label="题目内容：" :rules="formRules.content" style="height: 500px; padding-bottom: 24px">
            <MdEditor class="w-full" :value="question.content" @update:value="handleUpdateContent" />
          </el-form-item>
          <el-form-item prop="mainCode" label="主函数：" :rules="formRules.mainCode" style="height: 500px; padding-bottom: 24px">
            <MdEditor class="w-full" :value="question.mainCode" @update:value="handleUpdateMaincode" />
          </el-form-item>
          <el-form-item prop="mainCode" label="题目模板：" :rules="formRules.questionTemplate" style="height: 500px; padding-bottom: 24px">
            <MdEditor class="w-full" :value="question.questionTemplate" @update:value="handleUpdateQuestionTemplate" />
          </el-form-item>
          <el-form-item prop="answer" label="题解：" :rules="formRules.answer" style="height: 500px; padding-bottom: 24px">
            <MdEditor class="w-full" :value="question.answer" @update:value="handleUpdateAnswer" />
          </el-form-item>
          <el-form-item prop="answerCode" label="正确代码：" :rules="formRules.answerCode" style="height: 500px; padding-bottom: 24px">
            <MdEditor class="w-full" :value="question.answerCode" @update:value="handleUpdateAnswerCode" />
          </el-form-item>

          <el-form-item label="测试用例配置：" class="form-block">
            <el-button class="mb-2" type="primary" @click="handleAddCase">新增测试用例</el-button>
            <el-table class="mb-2" :data="question.judgeCase" height="300" border>
              <el-table-column type="index" align="center" label="序号" width="80" />
              <el-table-column prop="input" align="center" label="输入参数" min-width="120">
                <template #default="row">
                  <el-form-item :prop="'judgeCase.' + row.$index + '.input'" :rules="formRules.input" style="margin: 0">
                    <el-input placeholder="请输入参数" v-model="question.judgeCase[row.$index].input" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="output" align="center" label="输出结果" min-width="120">
                <template #default="row">
                  <el-form-item :prop="'judgeCase.' + row.$index + '.output'" :rules="formRules.output" style="margin: 0">
                    <el-input placeholder="请输入结果" v-model="question.judgeCase[row.$index].output" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template #default="scope">
                  <el-button link type="danger" size="small" @click.prevent="handleDeleteCase(scope.$index)"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MdEditor } from '@/components/bytemd';
import { defHttp } from '@/utils/http/axios';
import { reactive, toRefs, ref, onMounted } from 'vue';
import type { FormInstance } from 'element-plus';
import { ElNotification } from 'element-plus';
import { QuestionDifficulty } from '@/modules/oj/constant';
import { useRoute } from 'vue-router';

interface Form {
  question: Question;
  // tagsOption: Array<string>;
}

interface Question {
  id?: number | null;
  title: string; // 题目标题
  difficulty: number; // 难度
  content: string; // 题目内容
  tags: Array<any>; // 标签
  answer: string; // 答案
  answerCode: string; // 正确代码
  mainCode: string; // 主函数代码
  questionTemplate: string; // 题目模板
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
    id: null,
    title: '',
    content: '',
    difficulty: 1,
    tags: [],
    answer: '',
    answerCode: '',
    questionTemplate: '',
    mainCode: 'public static void main(String[] args) {\n}',
    judgeConfig: {
      timeLimit: 10000,
      memoryLimit: 50,
      stackLimit: 1000,
    },
    judgeCase: [],
  },
  // tagsOption: [],
});

const checkJudgeConfig = (rule: any, value: any, callback: any) => {
  if (!question.value.judgeConfig.timeLimit || !question.value.judgeConfig.memoryLimit) {
    callback(new Error('判题配置不能为空'));
  }
  var reg = /^[1-9]\d*$/;
  if (!reg.test(question.value.judgeConfig.timeLimit.toString())) {
    callback(new Error('时间限制不符合要求，请输入在1-10000之间的整数'));
  }
  if (!reg.test(question.value.judgeConfig.memoryLimit.toString())) {
    callback(new Error('内存限制不符合要求，请输入在1-10000之间的整数'));
  }
  // if (!reg.test(question.value.judgeConfig.stackLimit.toString())) {
  //   callback(new Error('堆栈限制不符合要求，请输入在1-10000之间的整数'));
  // }
  callback();
};

const formRules = reactive({
  title: [{ required: true, message: '请输入题目标题', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择题目难度', trigger: 'change' }],
  tags: [{ required: true, message: '请选择题目标签', trigger: 'change' }],
  content: [{ required: true, message: '请输入题目内容', trigger: 'change' }],
  judgeConfig: [{ required: true, validator: checkJudgeConfig, trigger: ['change', 'blur'] }],
  questionTemplate: [{ required: true, message: '请输入题目模板', trigger: 'change' }],
  mainCode: [{ required: true, message: '请输入主函数', trigger: 'change' }],
  answer: [{ required: true, message: '请输入题解', trigger: 'change' }],
  answerCode: [{ required: true, message: '请输入正确代码', trigger: 'change' }],
  input: [{ required: true, message: '请输入参数', trigger: 'change' }],
  output: [{ required: true, message: '请输入结果', trigger: 'change' }],
});

let loading = ref(false);
let isModify = ref(false);
const formRef = ref<FormInstance>();

let { question } = toRefs(form);

const router = useRoute();

const init = () => {
  const params = router.params;
  if (!params.id) {
    return;
  }
  isModify.value = true;
  defHttp
    .get({
      url: `/oj/question/selectById/${params.id}`,
    })
    .then(({ data }) => {
      if (data.tags && data.tags.length !== 0) {
        data.tags = data.tags.map((item: any) => {
          return item.tag;
        });
      }
      question.value = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        difficulty: data.difficulty,
        tags: data.tags,
        questionTemplate: data.questionTemplate || '',
        mainCode: data.mainCode || '',
        answer: data.answer || '',
        answerCode: data.answerCode || '',
        judgeConfig: data.judgeConfig,
        judgeCase: data.judgeCase,
      };
    });
};

onMounted(() => {
  init();
});

const handleAddCase = () => {
  question.value.judgeCase.push({
    input: '',
    output: '',
  });
};

const handleDeleteCase = (index: number) => {
  question.value.judgeCase.splice(index, 1);
};

const handleSubmit = async () => {
  await formRef.value?.validate((valid) => {
    console.log(valid);
    if (valid) {
      loading.value = true;
      defHttp
        .request({
          method: isModify.value ? 'put' : 'post',
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
    }
  });
};

const handleReset = () => {
  form.question = {
    title: '',
    content: '',
    difficulty: 1,
    tags: [],
    answer: '',
    answerCode: '',
    mainCode: 'public static void main(String[] args) {\n}',
    questionTemplate: '',
    judgeConfig: {
      timeLimit: 10000,
      memoryLimit: 50,
      stackLimit: 1000,
    },
    judgeCase: [],
  };
  // form.tagsOption = [];
};

const handleUpdateContent = (v: string) => {
  question.value.content = v;
};

const handleUpdateAnswer = (v: string) => {
  question.value.answer = v;
};

const handleUpdateAnswerCode = (v: string) => {
  question.value.answerCode = v;
};

const handleUpdateMaincode = (v: string) => {
  question.value.mainCode = v;
};

const handleUpdateQuestionTemplate = (v: string) => {
  question.value.questionTemplate = v;
};
</script>

<style lang="scss" scoped>
:deep(.form-block .el-form-item__content) {
  display: block;
}
:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>
