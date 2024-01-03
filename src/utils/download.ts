import type { MIME_MAP } from '@/enums/requestEnum';
import { app } from '@/main';

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function downloadBlob(res: any, mimeType: MIME_MAP) {
  if (res.data.type == 'application/octet-stream') {
    const aLink = document.createElement('a');
    const blob = new Blob([res.data], { type: mimeType });
    // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
    const contentDisposition = decodeURI(res.headers['content-disposition']);
    const result = patt.exec(contentDisposition);
    let fileName = result ? result[1] : '附件';
    fileName = fileName.replace(/"/g, '');
    fileName = fileName.replace('%2B', '+');
    aLink.href = URL.createObjectURL(blob);
    aLink.setAttribute('download', fileName); // 设置下载文件名称
    document.body.appendChild(aLink);
    aLink.click();
    document.body.appendChild(aLink);
  } else {
    const blob = new Blob([res.data]);
    const reader = new FileReader();
    reader.addEventListener('loadend', function (read) {
      app.config.globalProperties.$notify({
        title: 'Error',
        message: read.target?.result,
        type: 'error',
      });
    });
    reader.readAsText(blob);
  }
}
