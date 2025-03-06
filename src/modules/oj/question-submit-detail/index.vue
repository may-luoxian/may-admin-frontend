<template>
  <div class="may-container">
    <div class="may-card min-container-h overflow-auto">
      <div class="w-1/2 float-left h-full p-2">
        <header class="may-title px-4">
          <span :style="handleTitle()">{{ judgeInfo.message }}</span>
        </header>
        <div class="may-title px-4">提交代码：</div>
        <MdViewer :value="code" />
        <div class="may-title px-4">输入输出及预期结果：</div>
        <el-table :data="model" border stripe>
          <el-table-column prop="input" label="输入" align="center"></el-table-column>
          <el-table-column prop="output" label="输出" align="center"></el-table-column>
          <el-table-column prop="expected" label="预期结果" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="w-1/2 float-right h-full p-2 overflow-auto">
        <el-collapse v-model="showAnswer">
          <el-collapse-item name="1">
            <template #title>
              <header class="may-title">
                <span>题解</span>
              </header>
            </template>
            <MdViewer :value="answer" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defHttp } from '@/utils/http/axios';
import { useRoute } from 'vue-router';
import { onMounted, reactive, toRefs, ref } from 'vue';
import { isArray } from '@/utils/is';
import { MdViewer } from '@/components/bytemd';

const route = useRoute();

let detail = reactive<any>({
  judgeInfo: {},
  model: [],
  code: '',
  answer: '',
});

let { judgeInfo, model, code, answer } = toRefs(detail);

const showAnswer = ref([]);

onMounted(() => {
  getQuestionDetail();
});

const getQuestionDetail = () => {
  const id = route.params.id;
  defHttp
    .get({
      url: `/oj/questionSubmit/wrongDetail/${id}`,
    })
    .then((res) => {
      judgeInfo.value = res.data.judgeInfo;
      if (isArray(judgeInfo.value.inputList)) {
        model.value = judgeInfo.value.inputList.map((item: any, index: number) => {
          return {
            input: item,
            output: judgeInfo.value.outputList[index],
            expected: judgeInfo.value.expectedResult[index],
          };
        });
      }
      detail.code = `\`\`\`${res.data.language}\n${res.data.code}\n\`\`\``;
      detail.answer = res.data.answer;
    });
};

const handleTitle = () => {
  if (judgeInfo.value.message === '答案正确') {
    return {
      color: '#7ec050',
    };
  } else if (judgeInfo.value.message === '编译错误') {
    return {
      color: '#dca550',
    };
  } else {
    return {
      color: '#e47470',
    };
  }
};
</script>

<style lang="scss"></style>
