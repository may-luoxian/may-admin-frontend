import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';
import { uniqueId } from 'lodash-es';

const homeList = (keywords, count: number = 20) => {
  const list = [] as any[];
  for (let index = 0; index < count; index++) {
    list.push({
      name: `${keywords ?? ''}模块${index + 1}`,
      id: uniqueId(),
      widthValue: 1,
    });
  }
  return list;
};

export default [
  {
    url: '/api/homeList',
    method: 'get',
    response: () => {
      return resultSuccess({
        data: {
          enable: homeList('启用'),
          notEnable: homeList('未启用'),
        },
      });
    },
  },
  {
    url: '/api/cascader',
    method: 'get',
    response: () => {
      return resultSuccess({
        data: [
          {
            value: 'guide',
            label: 'Guide',
          },
          {
            value: 'component',
            label: 'Component',
          },
          {
            value: 'resource',
            label: 'Resource',
          },
        ],
      });
    },
  },
  {
    url: '/api/lazyload',
    method: 'get',
    response: (res) => {
      let value = res.query.value;
      if (value === 'guide') {
        let result = [
          {
            value: 'disciplines',
            label: 'Disciplines',
            leaf: true
            // children: [
            //   {
            //     value: 'consistency',
            //     label: 'Consistency',
            //   },
            //   {
            //     value: 'feedback',
            //     label: 'Feedback',
            //   },
            //   {
            //     value: 'efficiency',
            //     label: 'Efficiency',
            //   },
            //   {
            //     value: 'controllability',
            //     label: 'Controllability',
            //   },
            // ],
          },
          {
            value: 'navigation',
            label: 'Navigation',
            leaf: true
            // children: [
            //   {
            //     value: 'side nav',
            //     label: 'Side Navigation',
            //   },
            //   {
            //     value: 'top nav',
            //     label: 'Top Navigation',
            //   },
            // ],
          },
        ];
        return resultSuccess({
          data: result,
        });
      } else if (value === 'component') {
        let result = [
          {
            value: 'basic',
            label: 'Basic',
            leaf: true
            // children: [
            //   {
            //     value: 'layout',
            //     label: 'Layout',
            //   },
            //   {
            //     value: 'color',
            //     label: 'Color',
            //   },
            //   {
            //     value: 'typography',
            //     label: 'Typography',
            //   },
            //   {
            //     value: 'icon',
            //     label: 'Icon',
            //   },
            //   {
            //     value: 'button',
            //     label: 'Button',
            //   },
            // ],
          },
          {
            value: 'form',
            label: 'Form',
            leaf: true
            // children: [
            //   {
            //     value: 'radio',
            //     label: 'Radio',
            //   },
            //   {
            //     value: 'checkbox',
            //     label: 'Checkbox',
            //   },
            //   {
            //     value: 'input',
            //     label: 'Input',
            //   },
            //   {
            //     value: 'input-number',
            //     label: 'InputNumber',
            //   },
            //   {
            //     value: 'select',
            //     label: 'Select',
            //   },
            //   {
            //     value: 'cascader',
            //     label: 'Cascader',
            //   },
            //   {
            //     value: 'switch',
            //     label: 'Switch',
            //   },
            //   {
            //     value: 'slider',
            //     label: 'Slider',
            //   },
            //   {
            //     value: 'time-picker',
            //     label: 'TimePicker',
            //   },
            //   {
            //     value: 'date-picker',
            //     label: 'DatePicker',
            //   },
            //   {
            //     value: 'datetime-picker',
            //     label: 'DateTimePicker',
            //   },
            //   {
            //     value: 'upload',
            //     label: 'Upload',
            //   },
            //   {
            //     value: 'rate',
            //     label: 'Rate',
            //   },
            //   {
            //     value: 'form',
            //     label: 'Form',
            //   },
            // ],
          },
          {
            value: 'data',
            label: 'Data',
            leaf: true
            // children: [
            //   {
            //     value: 'table',
            //     label: 'Table',
            //   },
            //   {
            //     value: 'tag',
            //     label: 'Tag',
            //   },
            //   {
            //     value: 'progress',
            //     label: 'Progress',
            //   },
            //   {
            //     value: 'tree',
            //     label: 'Tree',
            //   },
            //   {
            //     value: 'pagination',
            //     label: 'Pagination',
            //   },
            //   {
            //     value: 'badge',
            //     label: 'Badge',
            //   },
            // ],
          },
          {
            value: 'notice',
            label: 'Notice',
            leaf: true
            // children: [
            //   {
            //     value: 'alert',
            //     label: 'Alert',
            //   },
            //   {
            //     value: 'loading',
            //     label: 'Loading',
            //   },
            //   {
            //     value: 'message',
            //     label: 'Message',
            //   },
            //   {
            //     value: 'message-box',
            //     label: 'MessageBox',
            //   },
            //   {
            //     value: 'notification',
            //     label: 'Notification',
            //   },
            // ],
          },
          {
            value: 'navigation',
            label: 'Navigation',
            leaf: true
            // children: [
            //   {
            //     value: 'menu',
            //     label: 'Menu',
            //   },
            //   {
            //     value: 'tabs',
            //     label: 'Tabs',
            //   },
            //   {
            //     value: 'breadcrumb',
            //     label: 'Breadcrumb',
            //   },
            //   {
            //     value: 'dropdown',
            //     label: 'Dropdown',
            //   },
            //   {
            //     value: 'steps',
            //     label: 'Steps',
            //   },
            // ],
          },
          {
            value: 'others',
            label: 'Others',
            leaf: true
            // children: [
            //   {
            //     value: 'dialog',
            //     label: 'Dialog',
            //   },
            //   {
            //     value: 'tooltip',
            //     label: 'Tooltip',
            //   },
            //   {
            //     value: 'popover',
            //     label: 'Popover',
            //   },
            //   {
            //     value: 'card',
            //     label: 'Card',
            //   },
            //   {
            //     value: 'carousel',
            //     label: 'Carousel',
            //   },
            //   {
            //     value: 'collapse',
            //     label: 'Collapse',
            //   },
            // ],
          },
        ];
        return resultSuccess({
          data: result,
        });
      } else if (value === 'resource') {
        let result = [
          {
            value: 'axure',
            label: 'Axure Components',
            leaf: true
          },
          {
            value: 'sketch',
            label: 'Sketch Templates',
            leaf: true
          },
          {
            value: 'docs',
            label: 'Design Documentation',
            leaf: true
          },
        ];
        return resultSuccess({
          data: result,
        });
      } else {
        return resultSuccess({
          data: [],
        });
      }
    },
  },
] as MockMethod[];
