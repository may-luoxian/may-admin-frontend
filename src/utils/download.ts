import type { MIME_MAP } from '@/enums/requestEnum';
// import { app } from '@/main';

/**
 * 解析blob响应内容并下载
 * @param {*} config blob响应内容
 * @param {String} mimeType MIME类型
 */
export function downloadBlob(config: any, mimeType: MIME_MAP) {
  const blob = new Blob([config.data], { type: mimeType });
  const fileReader = new FileReader();
  fileReader.readAsDataURL(blob);
  fileReader.onload = (e) => {
    const contentDisposition = decodeURI(config.headers['content-disposition']);
    const patt = /(?<=(attachment;filename=)).*/g;
    const matchData = patt.exec(contentDisposition);
    const filename = matchData ? matchData[0] : '未命名文件';
    const link = document.createElement('a');
    link.download = filename;
    const result = e.target?.result as string;
    link.href = result;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}
