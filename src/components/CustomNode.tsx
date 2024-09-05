import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="custom-node" style={{ 
      padding: '10px', 
      border: `${data.style?.borderWidth || '1px'} solid ${data.style?.borderColor || 'black'}`, 
      borderRadius: data.style?.borderRadius || '5px', 
      background: data.style?.backgroundColor || 'white',
      color: 'black',
      minWidth: '150px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      ...data.style
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <strong style={{ display: 'block', marginBottom: '5px', fontSize: data.style?.fontSize || '12px' }}>{data.label}</strong>
        <p style={{ margin: 0, wordBreak: 'break-word', fontSize: data.style?.fontSize || '12px' }}>{data.content}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;