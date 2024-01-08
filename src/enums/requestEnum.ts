export enum REQUEST_METHOD_ENUM {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum MIME_MAP {
  xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls = MIME_MAP.xlsx,
  zip = 'application/zip',
  doc = 'application/doc',
  pdf = 'application/pdf',
  docx = 'application/docx',
  ppt = 'application/ppt',
  jpg = 'application/jpg',
  png = 'application/png',
  svg = 'application/svg',
  txt = 'application/txt',
  mp3 = 'application/force-download,content-type=audio/mpeg',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
