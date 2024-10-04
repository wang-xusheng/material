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
  onNodeClick?: (e: IIndentedTreeData) => void;
}
