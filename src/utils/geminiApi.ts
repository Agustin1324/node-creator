import { GoogleGenerativeAI } from "@google/generative-ai";
import { Position } from 'reactflow';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY!);

export async function generateNodeWithAI(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(`
      Create a node for a React Flow diagram based on the following description:
      ${prompt}
      
      Return a JSON object with the following structure:
      {
        "id": "unique_id_string",
        "label": "Node Label",
        "content": "Node Content",
        "type": "customNode",
        "position": { "x": 0, "y": 0 },
        "style": {
          "width": "150px",
          "height": "100px",
          "backgroundColor": "#ffffff",
          "borderColor": "#000000",
          "borderWidth": "1px",
          "borderRadius": "5px",
          "fontSize": "12px"
        },
        "dragHandle": false,
        "selected": false,
        "isConnectable": true,
        "zIndex": 0,
        "dragging": false,
        "targetPosition": "Top",
        "sourcePosition": "Bottom"
      }
      
      Provide only the JSON object without any additional text or formatting.
    `);

    const responseText = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }
    
    const nodeData = JSON.parse(jsonMatch[0]);

    // Convert string positions to enum
    nodeData.targetPosition = Position[nodeData.targetPosition as keyof typeof Position];
    nodeData.sourcePosition = Position[nodeData.sourcePosition as keyof typeof Position];

    return nodeData;
  } catch (error) {
    console.error('Error generating node with Gemini API:', error);
    throw error;
  }
}