import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
import React from 'react';
import { IToolBarList } from './types';

interface IToolBarProps {
  isFullScreen: boolean;
  ToolBarList?: IToolBarList;
  reset?: () => void;
  fullScreen?: () => void;
}
const ToolBar = (props: IToolBarProps) => {
  const { isFullScreen, ToolBarList = ['reset', 'fullScreen'], reset, fullScreen } = props;
  return (
    <div>
      <Space
        style={{ position: 'absolute', right: 0, top: 0 }}
      >
        {ToolBarList.includes('reset') && <Button icon={<SyncOutlined />} onClick={reset}/>}
        {ToolBarList.includes('fullScreen') &&
          (isFullScreen ? (
            <Button icon={<FullscreenExitOutlined />} onClick={fullScreen} />
          ) : (
            <Button icon={<FullscreenOutlined />} onClick={fullScreen}/>
          ))}
      </Space>
    </div>
  );
};

export default ToolBar;
