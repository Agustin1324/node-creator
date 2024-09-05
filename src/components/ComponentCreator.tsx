import React, { useState, useEffect } from 'react';
import { generateNodeWithAI } from '../utils/geminiApi';
import { Position, Node } from 'reactflow';

interface ComponentCreatorProps {
  onAddNode: (nodeData: any) => void;
  onUpdateNode: (nodeData: any) => void;
  selectedNode: Node | null;
}

const ComponentCreator: React.FC<ComponentCreatorProps> = ({ onAddNode, onUpdateNode, selectedNode }) => {
  const [nodeData, setNodeData] = useState({
    id: '',
    label: '',
    content: '',
    type: 'customNode',
    positionX: '0',
    positionY: '0',
    width: '150',
    height: '100',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: '1',
    borderRadius: '5',
    fontSize: '12',
    dragHandle: false,
    selected: false,
    isConnectable: true,
    zIndex: 0,
    dragging: false,
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setNodeData({
        id: selectedNode.id,
        label: selectedNode.data.label,
        content: selectedNode.data.content,
        type: selectedNode.type || 'customNode',
        positionX: String(selectedNode.position.x),
        positionY: String(selectedNode.position.y),
        width: selectedNode.data.style.width.replace('px', ''),
        height: selectedNode.data.style.height.replace('px', ''),
        backgroundColor: selectedNode.data.style.backgroundColor,
        borderColor: selectedNode.data.style.borderColor,
        borderWidth: selectedNode.data.style.borderWidth.replace('px', ''),
        borderRadius: selectedNode.data.style.borderRadius.replace('px', ''),
        fontSize: selectedNode.data.style.fontSize.replace('px', ''),
        dragHandle: selectedNode.dragHandle || false,
        selected: selectedNode.selected || false,
        isConnectable: selectedNode.isConnectable !== undefined ? selectedNode.isConnectable : true,
        zIndex: selectedNode.zIndex || 0,
        dragging: selectedNode.dragging || false,
        targetPosition: selectedNode.targetPosition || Position.Top,
        sourcePosition: selectedNode.sourcePosition || Position.Bottom,
      });
    }
  }, [selectedNode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setNodeData(prev => ({ ...prev, [name]: newValue }));
    if (selectedNode) {
      onUpdateNode({ ...nodeData, [name]: newValue });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNode) {
      onUpdateNode(nodeData);
    } else {
      onAddNode(nodeData);
    }
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const generatedNode = await generateNodeWithAI(aiPrompt);
      setNodeData(prev => ({
        ...prev,
        ...generatedNode,
        positionX: String(generatedNode.position.x),
        positionY: String(generatedNode.position.y),
        width: generatedNode.style.width.replace('px', ''),
        height: generatedNode.style.height.replace('px', ''),
        backgroundColor: generatedNode.style.backgroundColor,
        borderColor: generatedNode.style.borderColor,
        borderWidth: generatedNode.style.borderWidth.replace('px', ''),
        borderRadius: generatedNode.style.borderRadius.replace('px', ''),
        fontSize: generatedNode.style.fontSize.replace('px', ''),
      }));
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating node with AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'black', background: '#f0f0f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '20px' }}>React Flow Node {selectedNode ? 'Editor' : 'Creator'}</h2>
      
      {/* AI Generation Form */}
      <form onSubmit={handleAIGenerate} style={{ marginBottom: '20px' }}>
        <h3>Generate Node Suggestions with AI</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe the node you want to create"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Generating...' : 'Generate Suggestions'}
          </button>
        </div>
      </form>

      {/* Node Creation/Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', overflowY: 'auto' }}>
        {Object.entries(nodeData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            {key === 'content' ? (
              <textarea
                id={key}
                name={key}
                value={value as string}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  height: '60px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            ) : key === 'targetPosition' || key === 'sourcePosition' ? (
              <select
                id={key}
                name={key}
                value={value as string}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {Object.values(Position).map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            ) : typeof value === 'boolean' ? (
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={value}
                onChange={handleChange}
              />
            ) : (
              <input
                type={['backgroundColor', 'borderColor'].includes(key) ? 'color' : 'text'}
                id={key}
                name={key}
                value={value as string}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            )}
          </div>
        ))}
        <button 
          type="submit" 
          style={{ 
            gridColumn: '1 / -1',
            padding: '10px', 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {selectedNode ? 'Update Node' : 'Add Node'}
        </button>
      </form>
    </div>
  );
};

export default ComponentCreator;