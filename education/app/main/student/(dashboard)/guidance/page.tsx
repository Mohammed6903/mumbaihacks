<<<<<<< HEAD
=======
"use client";
import React, { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, Video, AlertCircle, Clock, MessageSquare, Sparkles, Tag } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface AnalysisResult {
  title: string;
  duration: string;
  summary: string;
  key_points: string[];
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  topics: string[];
}

type TabType = 'video' | 'transcript';

const ENDPOINTS = {
  video: {
    upload: 'http://localhost:8000/video/upload',
    status: (taskId: string) => `http://localhost:8000/status/${taskId}`,
    result: (taskId: string) => `http://localhost:8000/result/${taskId}`,
  },
  transcript: {
    upload: 'http://localhost:8000/generate-analysis',
    status: (taskId: string) => `http://localhost:8000/status/${taskId}`,
    result: (taskId: string) => `http://localhost:8000/result/${taskId}`,
  },
};

const useStatusPolling = (taskId: string | null, activeTab: TabType) => {
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed' | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(ENDPOINTS[activeTab].status(taskId));
        const data = await response.json();

        if (data.status === 'failed') {
          setStatus('failed');
          setError(data.message);
          return;
        }

        if (data.status === 'completed') {
          setStatus('completed');
          const resultResponse = await fetch(ENDPOINTS[activeTab].result(taskId));
          const resultData = await resultResponse.json();
          setResult(resultData); // resultData should now directly match AnalysisResult
          return;
        }

        // Continue polling if still processing
        setTimeout(pollStatus, 2000);
      } catch (err) {
        setStatus('failed');
        setError('Failed to fetch status');
      }
    };

    pollStatus();

    return () => {
      setStatus(null);
      setResult(null);
      setError(null);
    };
  }, [taskId]);

  return { status, result, error };
};

const VideoAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  const { status, result, error } = useStatusPolling(taskId, activeTab);

  const analysisMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(ENDPOINTS[activeTab].upload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTaskId(data.task_id);
      return data;
    }
  });

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File): Promise<void> => {
    // Validate file type and size
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      analysisMutation.reset();
      return;
    }

    // Validate file type
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const validDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const validTypes = activeTab === 'video' ? validVideoTypes : validDocTypes;
    if (!validTypes.includes(file.type)) {
      analysisMutation.reset();
      return;
    }

    analysisMutation.mutate(file);
  };

  const isProcessing = analysisMutation.isPending || status === 'processing';
  const isError = analysisMutation.isError || status === 'failed';
  const errorMessage = error || (analysisMutation.error instanceof Error ? analysisMutation.error.message : 'An error occurred');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Analysis Studio</h1>
          <p className="text-gray-600">Upload your video or transcript for in-depth analysis</p>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-1 mb-8">
          <div className="grid grid-cols-2 gap-1">
            {(['video', 'transcript'] as const).map((tab) => (
              <button
                key={tab}
                className={`flex items-center justify-center px-6 py-4 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'video' ? (
                  <Video className={`mr-2 h-5 w-5 ${activeTab === tab ? 'text-blue-600' : 'text-gray-400'}`} />
                ) : (
                  <FileText className={`mr-2 h-5 w-5 ${activeTab === tab ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
                <span className="font-medium">{tab === 'video' ? 'Video Analysis' : 'Transcript Analysis'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className={`bg-white rounded-xl shadow-lg p-8 mb-8 transition-all ${
            isDragging ? 'border-2 border-blue-400 bg-blue-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={activeTab === 'video' ? "video/*" : ".txt,.doc,.docx,.pdf"}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drop your {activeTab === 'video' ? 'video' : 'transcript'} here
            </h3>
            <p className="text-gray-500 mb-4">or click to browse</p>
            <div className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500">
              {activeTab === 'video' ? 'MP4, WebM, MOV up to 500MB' : 'PDF, DOC, DOCX, TXT'}
            </div>
          </label>
        </div>

        {/* Error Message */}
        {isError && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Results Section */}
        {isProcessing && (
          <div className="flex items-center justify-center mb-8">
            <Clock className="animate-spin h-6 w-6 text-blue-500 mr-2" />
            <span className="text-gray-600">Processing...</span>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{result.title}</h2>
            <p className="text-gray-500 mb-2">Duration: {result.duration}</p>
            <p className="text-gray-500 mb-2">Summary: {result.summary}</p>
            <p className="text-gray-500 mb-2">Sentiment: {result.sentiment}</p>
            <div className="mb-4">
              <h3 className="font-semibold">Key Points:</h3>
              <ul className="list-disc list-inside">
                {result.key_points.map((point, index) => (
                  <li key={index} className="text-gray-500">{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Topics:</h3>
              <ul className="list-disc list-inside">
                {result.topics.map((topic, index) => (
                  <li key={index} className="text-gray-500">{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;
>>>>>>> 5326e74d12246640439496cdcfe812462c69b682
