import { IG6GraphEvent } from "@antv/g6";

export interface IIndentedTreeData {
  id: string;
  title: string;
  text?: string;
  clickable?: boolean;
  collapsed?: boolean;
  children?: IIndentedTreeData[];
}

export interface IIndentedTreeProps {
  data: IIndentedTreeData;
  style?:React.CSSProperties
  showMiniMap?: boolean;
  showTooltip?: boolean;
  onNodeClick?: (e: IIndentedTreeData) => void;
  renderTooltip?: (e: IG6GraphEvent | undefined | null) => React.ReactNode;
}

export type IToolBarList = Array<'fullScreen' | 'reset'>
