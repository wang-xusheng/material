---
title: 层级树状图
order: 2
---

# IndentedTree

一个用来展示具有树状层级组织结构数据类型的组件


## 示例
```tsx
import React, { useState, useEffect } from 'react';
import { IndentedTree, IIndentedTreeData } from '@luo-luo/material/components';
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
export default () => {
  const [treeData, setTreeData] = useState(data);
  return <IndentedTree data={treeData} onNodeClick={console.log} />;
};
```

## API 文档

### IIndentedTreeProps 接口

| 属性名      | 类型                     | 是否必填 | 默认值   | 描述                                       |
|-------------|--------------------------|----------|----------|--------------------------------------------|
| data        | IIndentedTreeData        | 是       | -        | 树形结构的数据源                           |
| style       | React.CSSProperties      | 否       | -        | 用于自定义组件的样式                       |
| showMiniMap | boolean                  | 否       | false    | 当设置为 true 时，显示迷你地图以帮助导航大型树结构 |
| onNodeClick | (e: IIndentedTreeData) => void | 否 | -        | 节点被点击时触发的回调函数，参数 e 是被点击节点的数据 |


### IIndentedTreeData 接口

| 属性名      | 类型            | 是否必填  | 默认值    | 描述                                      |
|------------|----------------|----------|----------|------------------------------------------|
| id         | string         | 是       | -        | 每个数据节点的唯一标识符                  |
| title      | string         | 是       | -        | 节点标题，通常显示在用户界面上               |
| text       | string         | 否       | -        | 节点附加文本信息，可用于提供额外描述             |
| clickable  | boolean        | 否       | true     | 指示节点是否可点击                       |
| collapsed  | boolean        | 否       | false    | 指示节点是否默认折叠                     |
| children   | IIndentedTreeData[] | 否  | -        | 子节点数组，允许创建多级树形结构             |



