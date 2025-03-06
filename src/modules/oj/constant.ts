/**
 * 语言类型
 */
export const QuestionSubmitLanguageEnum = [
  // {
  //   id: 1,
  //   value: 'javascript',
  //   message: 'javascript',
  // },
  {
    id: 2,
    value: 'java',
    message: 'java',
  },
  // {
  //   id: 3,
  //   value: 'c++',
  //   message: 'c++',
  // },
  // {
  //   id: 4,
  //   value: 'goLong',
  //   message: 'goLong',
  // },
  // {
  //   id: 5,
  //   value: 'typescript',
  //   message: 'typescript',
  // },
];

/**
 * 题目难度
 */
export const QuestionDifficulty = [
  {
    id: 1,
    value: '简单',
    type: 'success',
  },
  {
    id: 2,
    value: '中等',
    type: 'primary',
  },
  {
    id: 3,
    value: '困难',
    type: 'danger',
  },
];

/**
 * 判题状态
 */
export const QuestionSubStateEnum = [
  {
    id: 0,
    value: 'UNTREATED',
    message: '待判题',
    type: 'primary',
  },
  {
    id: 1,
    value: 'IN_PROCESS',
    message: '判题中',
    type: 'info',
  },
  {
    id: 2,
    value: 'SUCCESS',
    message: '已完成',
    type: 'success',
  },
  {
    id: 3,
    value: 'FAIL',
    message: '判题出错',
    type: 'danger',
  },
];

/**
 * 判题结果
 */
export const JudgeInfoMsgEnum = [
  {
    id: 0,
    value: 'Accepted',
    message: '答案正确',
  },
  {
    id: 1,
    value: 'WrongAnswer',
    message: '答案错误',
  },
  {
    id: 2,
    value: 'CompileError',
    message: '编译错误',
  },
  {
    id: 3,
    value: 'MemoryLimitExceeded',
    message: '内存溢出',
  },
  {
    id: 4,
    value: 'TimeLimitExceeded',
    message: '超时',
  },
  {
    id: 5,
    value: 'PresentationError',
    message: '展示错误',
  },
  {
    id: 6,
    value: 'OutputLimitExceeded',
    message: '输出溢出',
  },
  {
    id: 7,
    value: 'Waiting',
    message: '等待中',
  },
  {
    id: 8,
    value: 'DangerousOperation',
    message: '危险操作',
  },
  {
    id: 9,
    value: 'RuntimeError',
    message: '运行时错误',
  },
  {
    id: 10,
    value: 'SystemError',
    message: '系统错误',
  },
];
