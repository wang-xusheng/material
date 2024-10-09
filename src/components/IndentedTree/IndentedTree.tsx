import G6, { IG6GraphEvent, ModelConfig, TreeGraph } from '@antv/g6';
import {
  Group,
  Marker,
  Rect,
  Text,
  createNodeFromReact,
} from '@antv/g6-react-node';
import { useMouse } from 'ahooks';
import { Card, Empty } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import fittingString from './fittingString';
import './index.scss';
import ToolBar from './ToolBar';
import { IIndentedTreeData, IIndentedTreeProps } from './types';
const Title = ({ title }: { title: string }) => (
  // @ts-ignore
  <Text name="title" style={{ fill: '#fff', fontSize: 16 }}>
    {fittingString(title, 120, 16)}
  </Text>
);
const Content = ({ text }: { text: string }) => (
  <Text
    name="content"
    // @ts-ignore
    style={{ fill: '#fff', margin: [3, 0, 0, 0], fontSize: 14 }}
  >
    {fittingString(text, 120, 14)}
  </Text>
);
const Node = ({ cfg }: { cfg: ModelConfig }) => {
  const {
    id,
    title,
    text,
    clickable = true,
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Rect
          name="text"
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
const reactNode = createNodeFromReact(Node);
reactNode.getAnchorPoints = () => [
  [0.5, 0],
  [0.5, 1],
];
G6.registerNode('tree-node', reactNode);

const minimap = new G6.Minimap();

const default_width = 960;
const default_height = 480;
const IndentedTree = (props: IIndentedTreeProps) => {
  const {
    data,
    onNodeClick = () => {},
    style,
    showMiniMap = false,
    renderTooltip,
    showTooltip,
  } = props;

  const [treeData, setTreeData] = useState<IIndentedTreeData>(cloneDeep(data));
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<TreeGraph>();
  const mouseContext = useRef<IG6GraphEvent | null | undefined>();
  const [isFullScrene, SetIsFullScrene] = useState(false);
  const mouse = useMouse();
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
      plugins: [showMiniMap && minimap],
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

    /**
     * mousemove事件处理
     */
    graph.on('mousemove', (evt) => {
      const responseElements = ['node', 'title', 'content', 'collapse-icon'];
      const name = evt.target.get('name');
      if (responseElements.includes(name)) {
        mouseContext.current = evt;
      } else {
        mouseContext.current = null;
      }
    });
    graphRef.current = graph;
    console.log('gaphRef就绪');
  });

  /**
   * 监听数据变化，更新图
   */
  useEffect(() => {
    graphRef.current?.changeData(treeData);
    graphRef.current?.fitView();
    graphRef.current?.getNodes().forEach((node) => {
      const model = node.getModel();
      if (model.collapsed) {
        graphRef.current?.setItemState(node, 'collapsed', true);
      }
    });
  }, [treeData]);

  /**
   * 监听窗口大小变化，重新计算图宽高
   */
  useEffect(() => {
    graphRef.current?.changeSize(
      containerRef.current?.clientWidth || default_width,
      containerRef.current?.clientHeight || default_height,
    );
    graphRef.current?.fitView();
  }, [containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  /**
   * tooltip默认渲染函数
   */
  const _renderTooltip = (mouseContext: IG6GraphEvent | null | undefined) => {
    if (isEmpty(mouseContext)) {
      return null;
    }
    try {
      const { canvasX, canvasY, item } = mouseContext;
      const model = item?.getModel();
      return (
        <Card
          title={model?.title as string}
          bordered={false}
          style={{
            position: 'absolute',
            top: canvasY + 10,
            left: canvasX + 10,
          }}
        >
          <p className="tooltip-text">{model?.text as string}</p>
        </Card>
      );
    } catch (error) {
      return null;
    }
  };

  const Tooltip = useMemo(() => {
    return renderTooltip
      ? renderTooltip(mouseContext.current)
      : _renderTooltip(mouseContext.current);
  }, [mouse]);
  /**
   * 复位
   */
  const reset = () => {
    setTreeData(cloneDeep(data));
  };

  /**
   * 全屏
   */
  const fullScreen = () => {
    if (!isFullScrene) {
      containerRef.current?.requestFullscreen();
      SetIsFullScrene(true);
    } else {
      if(document.fullscreenElement){
        document.exitFullscreen();
        SetIsFullScrene(false);
      }else{
        SetIsFullScrene(false);
      }
    }
  };

  return (
    <div className="luoluo-indented-tree" style={style}>
      {!isEmpty(treeData) ? (
        <div className="luoluo-indented-tree-container" ref={containerRef}>
          {showTooltip && showTooltip && Tooltip}
          <ToolBar isFullScreen={isFullScrene} reset={reset} fullScreen={fullScreen}/>
        </div>
      ) : (
        <Empty style={{ paddingTop: 40 }} />
      )}
    </div>
  );
};

export default IndentedTree;
