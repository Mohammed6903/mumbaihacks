"use client";

import React, { useState } from 'react';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  MarkerType,
  Node,
  Edge,
  NodeProps
} from 'reactflow';
import { LineChart, XAxis, YAxis, Tooltip, Line, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Clock, BookOpen, Brain } from 'lucide-react';
import 'reactflow/dist/style.css';

// Type Definitions
interface Task {
  category: string;
  tasks: string[];
}

interface RoutineData {
  goal: string;
  sub_tasks: Task[];
}

interface DailyData {
  day: string;
  studyHours: number;
  exerciseHours: number;
  sleepHours: number;
  productivityScore: number;
}

interface CustomNodeData {
  label: string;
  bgColor: string;
  textColor: string;
}

interface TabProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
}

// Data
const studentRoutineData: RoutineData = {
  goal: "Effective Student Routine",
  sub_tasks: [
    {
      category: "Academic",
      tasks: [
        "Morning Study (6-8 AM)",
        "Attend Classes",
        "Evening Revision",
        "Complete Assignments"
      ]
    },
    {
      category: "Health",
      tasks: [
        "Morning Exercise",
        "Balanced Meals",
        "8 Hours Sleep",
        "Regular Breaks"
      ]
    },
    {
      category: "Extra-curricular",
      tasks: [
        "Sports Activity",
        "Club Meetings",
        "Skill Development",
        "Hobby Time"
      ]
    },
    {
      category: "Personal Growth",
      tasks: [
        "Reading",
        "Meditation",
        "Goal Setting",
        "Reflection Time"
      ]
    }
  ]
};

const weeklyData: DailyData[] = [
  { day: 'Monday', studyHours: 6, exerciseHours: 1, sleepHours: 7, productivityScore: 85 },
  { day: 'Tuesday', studyHours: 7, exerciseHours: 1.5, sleepHours: 8, productivityScore: 90 },
  { day: 'Wednesday', studyHours: 5, exerciseHours: 1, sleepHours: 6, productivityScore: 75 },
  { day: 'Thursday', studyHours: 6.5, exerciseHours: 1, sleepHours: 7.5, productivityScore: 88 },
  { day: 'Friday', studyHours: 5.5, exerciseHours: 2, sleepHours: 8, productivityScore: 82 },
  { day: 'Saturday', studyHours: 4, exerciseHours: 2.5, sleepHours: 9, productivityScore: 78 },
  { day: 'Sunday', studyHours: 3, exerciseHours: 2, sleepHours: 8.5, productivityScore: 70 }
];

// Custom Components
const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-lg ${data.bgColor} ${data.textColor}`}>
      <div className="font-bold">{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const Tab: React.FC<TabProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
      ${active 
        ? 'bg-blue-500 text-white' 
        : 'bg-white text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

type TabType = 'overview' | 'progress' | 'schedule';

const StudentRoutineDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const createNodesAndEdges = (): { nodes: Node<CustomNodeData>[]; edges: Edge[] } => {
    const nodes: Node<CustomNodeData>[] = [];
    const edges: Edge[] = [];
    
    nodes.push({
      id: 'goal',
      type: 'custom',
      position: { x: 400, y: 0 },
      data: { 
        label: studentRoutineData.goal,
        bgColor: 'bg-purple-600',
        textColor: 'text-white'
      }
    });

    studentRoutineData.sub_tasks.forEach((category, categoryIndex) => {
      const angle = (2 * Math.PI * categoryIndex) / studentRoutineData.sub_tasks.length;
      const categoryRadius = 250;
      const taskRadius = 150;
      
      const categoryX = Math.cos(angle) * categoryRadius;
      const categoryY = Math.sin(angle) * categoryRadius;
      
      const categoryId = `category-${categoryIndex}`;
      nodes.push({
        id: categoryId,
        type: 'custom',
        position: { x: 400 + categoryX, y: 200 + categoryY },
        data: {
          label: category.category,
          bgColor: 'bg-blue-500',
          textColor: 'text-white'
        }
      });
      
      edges.push({
        id: `edge-goal-${categoryId}`,
        source: 'goal',
        target: categoryId,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#4F46E5' }
      });
      
      category.tasks.forEach((task, taskIndex) => {
        const taskAngle = angle + (taskIndex - 1.5) * 0.3;
        const taskX = Math.cos(taskAngle) * (categoryRadius + taskRadius);
        const taskY = Math.sin(taskAngle) * (categoryRadius + taskRadius);
        
        const taskId = `task-${categoryIndex}-${taskIndex}`;
        nodes.push({
          id: taskId,
          type: 'custom',
          position: { x: 400 + taskX, y: 200 + taskY },
          data: {
            label: task,
            bgColor: 'bg-white',
            textColor: 'text-gray-800'
          }
        });
        
        edges.push({
          id: `edge-${categoryId}-${taskId}`,
          source: categoryId,
          target: taskId,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#93C5FD' }
        });
      });
    });
    
    return { nodes, edges };
  };

  const { nodes, edges } = createNodesAndEdges();

  const renderChart = (type: 'daily' | 'productivity' | 'sleep' | 'activity') => {
    switch (type) {
      case 'daily':
        return (
          <BarChart width={500} height={300} data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="studyHours" fill="#8884d8" name="Study Hours" />
            <Bar dataKey="exerciseHours" fill="#82ca9d" name="Exercise Hours" />
          </BarChart>
        );
      case 'productivity':
        return (
          <LineChart width={500} height={300} data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="productivityScore" stroke="#ff7300" strokeWidth={3} name="Productivity" dot={{ r: 4 }} />
          </LineChart>
        );
      case 'sleep':
        return (
          <LineChart width={500} height={300} data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sleepHours" stroke="#82ca9d" strokeWidth={3} name="Sleep Hours" dot={{ r: 4 }} />
          </LineChart>
        );
      case 'activity':
        return (
          <BarChart width={500} height={300} data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="studyHours" fill="#8884d8" name="Study Hours" />
            <Bar dataKey="exerciseHours" fill="#82ca9d" name="Exercise Hours" />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-bold mb-4">Student Routine Dashboard</div>
      <div className="flex space-x-4 mb-4">
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</Tab>
        <Tab active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</Tab>
        <Tab active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')}>Schedule</Tab>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Routine Overview">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} style={{ width: '100%', height: 400 }} />
        </Card>

        <Card title="Weekly Study & Exercise Hours">
          {renderChart('daily')}
        </Card>

        <Card title="Productivity Score Over the Week">
          {renderChart('productivity')}
        </Card>

        <Card title="Sleep Hours Over the Week">
          {renderChart('sleep')}
        </Card>
      </div>
    </div>
  );
};

export default StudentRoutineDashboard;
