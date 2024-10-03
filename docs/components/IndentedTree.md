---
title: 层级树状图
order: 2
---

# IndentedTree

一个用来展示具有树状层级组织结构数据类型的组件

```tsx
import React from 'react';
import { IndentedTree, IIndentedTreeData } from '@luoluo/material/components';
const data: IIndentedTreeData = {
  id: '1',
  title: '公司总部',
  text: '100',
  children: [
    {
      id: '2',
      title: '财务部',
      text: '30',
      clickable: false,
      collapsed: true,
      children: [
        {
          id: '5',
          title: '会计组',
          text: '15',

          children: [],
        },
        {
          id: '6',
          title: '审计组',
          text: '15',
          children: [],
        },
      ],
    },
    {
      id: '3',
      title: '技术部',
      children: [
        {
          id: '7',
          title: '开发组',
          text: '25',
          children: [
            {
              id: '10',
              title: '前端开发',
              text: '一段超长超长超长超长的描述',
              children: [],
            },
            {
              id: '11',
              title: '后端开发',
              text: '15',
              children: [],
            },
          ],
        },
        {
          id: '8',
          title: '运维组',
          text: '15',
          children: [],
        },
      ],
    },
    {
      id: '4',
      title: '名字超长超长的一个组',
      text: '30',
      children: [
        {
          id: '9',
          title: '销售组',
          text: '15',
          children: [],
        },
        {
          id: '12',
          title: '营销组',
          text: '15',
          children: [],
        },
      ],
    },
  ],
};
export default () => <IndentedTree data={data} onNodeClick={console.log} />;
```
