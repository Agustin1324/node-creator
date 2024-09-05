'use client'

import React, { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  NodeTypes,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow'
import 'reactflow/dist/style.css'
import CustomNode from './CustomNode'
import ComponentCreator from './ComponentCreator'

// Define nodeTypes outside the component
const nodeTypes: NodeTypes = { customNode: CustomNode };

const FlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNewNode = useCallback((nodeData: any) => {
    const newNode: Node = {
      id: nodeData.id || `${nodes.length + 1}`,
      type: nodeData.type,
      position: { x: Number(nodeData.positionX), y: Number(nodeData.positionY) },
      data: { 
        label: nodeData.label,
        content: nodeData.content,
        style: {
          width: `${nodeData.width}px`,
          height: `${nodeData.height}px`,
          backgroundColor: nodeData.backgroundColor,
          borderColor: nodeData.borderColor,
          borderWidth: `${nodeData.borderWidth}px`,
          borderRadius: `${nodeData.borderRadius}px`,
          fontSize: `${nodeData.fontSize}px`,
        },
      },
      dragHandle: nodeData.dragHandle,
      dragging: nodeData.dragging,
      selected: nodeData.selected,
      positionAbsolute: { x: Number(nodeData.positionX), y: Number(nodeData.positionY) },
      zIndex: Number(nodeData.zIndex),
      isConnectable: nodeData.isConnectable,
      targetPosition: nodeData.targetPosition,
      sourcePosition: nodeData.sourcePosition,
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const updateNode = useCallback((updatedNodeData: any) => {
    setNodes((nds) => nds.map((node) => 
      node.id === updatedNodeData.id ? {
        ...node,
        data: {
          ...node.data,
          label: updatedNodeData.label,
          content: updatedNodeData.content,
          style: {
            width: `${updatedNodeData.width}px`,
            height: `${updatedNodeData.height}px`,
            backgroundColor: updatedNodeData.backgroundColor,
            borderColor: updatedNodeData.borderColor,
            borderWidth: `${updatedNodeData.borderWidth}px`,
            borderRadius: `${updatedNodeData.borderRadius}px`,
            fontSize: `${updatedNodeData.fontSize}px`,
          },
        },
        position: { x: Number(updatedNodeData.positionX), y: Number(updatedNodeData.positionY) },
        dragHandle: updatedNodeData.dragHandle,
        dragging: updatedNodeData.dragging,
        selected: updatedNodeData.selected,
        positionAbsolute: { x: Number(updatedNodeData.positionX), y: Number(updatedNodeData.positionY) },
        zIndex: Number(updatedNodeData.zIndex),
        isConnectable: updatedNodeData.isConnectable,
        targetPosition: updatedNodeData.targetPosition,
        sourcePosition: updatedNodeData.sourcePosition,
      } : node
    ));
  }, [setNodes]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'white', color: 'black' }}>
      <div style={{ width: '50%', height: '100%', borderRight: '1px solid #ccc', overflow: 'auto' }}>
        <ComponentCreator onAddNode={addNewNode} onUpdateNode={updateNode} selectedNode={selectedNode} />
      </div>
      <div style={{ width: '50%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: 'white' }}
        >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default FlowEditor