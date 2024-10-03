import G6, { ModelConfig, TreeGraph } from '@antv/g6';
import {
  Group,
  Marker,
  Rect,
  Text,
  createNodeFromReact,
} from '@antv/g6-react-node';
import { Empty } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useLayoutEffect } from 'react';
import fittingString from './fittingString';
import './index.scss'
import { IIndentedTreeData, IIndentedTreeProps } from './types';


const Title = ({ title }: { title: string }) => (
  // @ts-ignore
  <Text style={{ fill: '#fff', fontSize: 16 }}>
    {fittingString(title, 120, 16)}
  </Text>
);
const Content = ({ text }: { text: string }) => (
  // @ts-ignore
  <Text style={{ fill: '#fff', margin: [3, 0, 0, 0], fontSize: 14 }}>
    {fittingString(text, 120, 14)}
  </Text>
);
const Node = ({ cfg }: { cfg: ModelConfig }) => {
  const {
    id,
    title,
    text,
    clickable=true,
    children = [],
  } = cfg as unknown as IIndentedTreeData;
  const hasChildren = !isEmpty(children);
  return (
    <Group id={id}>
      <Rect
        name="node"
        style={{
          width: 130,
          height: hasChildren ? 60 : 53,
          fill: clickable ? '#237ffa' : '#96ceff',
          stroke: '#eee',
          radius: 8,
          flexDirection: 'column',
          cursor: 'pointer',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Rect
          style={{
            width: 130,
            height: 53,
            flexDirection: 'column',
            cursor: 'pointer',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Title title={title} />
          {text && <Content text={text} />}
        </Rect>
        {hasChildren && (
          <Marker
            name="collapse-icon"
            style={{
              margin: [0, -6, 0, 6],
              r: 6,
              // @ts-ignore
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              // @ts-ignore
              lineWidth: 2,
              stroke: '#fff',
            }}
          ></Marker>
        )}
      </Rect>
    </Group>
  );
};
const reactNode = createNodeFromReact(Node)
reactNode.getAnchorPoints = () => [
  [0.5, 0],
  [0.5, 1],
];
G6.registerNode('tree-node', reactNode);

const default_width = 960;
const default_height = 480;
const IndentedTree = (props: IIndentedTreeProps) => {
  const { data, onNodeClick = () => {},style } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<TreeGraph>();
  useLayoutEffect(() => {}, []);
  /**
   * 初始化 G6 的 TreeGraph
   */
  useEffect(() => {
    if (graphRef.current || !containerRef.current) return;
    const graph = new TreeGraph({
      container: containerRef.current,
      width: containerRef.current.clientWidth || default_width,
      height: containerRef.current.clientHeight || default_height,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item, collapsed) {
              if (!item) return false;
              const data = item.get('model');
              graph.updateItem(item, {
                collapsed,
              });
              data.collapsed = collapsed;
              return true;
            },
            shouldBegin(e) {
              if (e.target.get('name') === 'collapse-icon') return true;
              return false;
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        type: 'tree-node',
        anchorPoints: [
          [0.5, 0],
          [0.5, 1],
        ],
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          stroke: '#237ffa',
          size: 2,
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'TB',
        getId: function getId(d: { id: any }) {
          return d.id;
        },
        getHGap: function getHGap() {
          return 80;
        },
        getVGap: function getVGap() {
          return 40;
        },
      },
    });
    /**
     * 点击事件处理
     * 如果点击节点name为"collapse-icon"，不处理
     * 否则返回点击节点id
     */
    graph.on('click', (e) => {
      const { item } = e;
      if (isEmpty(item) || e.target?.get('name') === 'collapse-icon') {
        return; // 不处理
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { x, y, style, depth, type, ...other } = item.getModel(); //去除一些无用属性
      onNodeClick({ ...other } as unknown as IIndentedTreeData);
    });
    graphRef.current = graph;
    console.log('gaphRef就绪');
  });

  /**
   * 监听数据变化，更新图
   */
  useEffect(() => {
    graphRef.current?.changeData(data);
    graphRef.current?.fitView();
    graphRef.current?.getNodes().forEach((node) => {
      const model = node.getModel();
      if (model.collapsed) {
        graphRef.current?.setItemState(node, 'collapsed', true);
      }
    });
  }, [data]);

  return (
    <div className="luoluo-indented-tree" style={style}>
      {!isEmpty(data) ? (
        <div ref={containerRef} style={{ height: '100%', width: '100%' }}></div>
      ) : (
        <Empty style={{ paddingTop: 40}} />
      )}
    </div>
  );
};

export default IndentedTree;
