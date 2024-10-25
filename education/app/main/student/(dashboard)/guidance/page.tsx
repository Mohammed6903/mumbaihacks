"use client";

import React, { useState } from 'react';
import { Upload, BookOpen, Compass, Trophy, Book, Brain, GraduationCap, ArrowRight, X, FileText } from 'lucide-react';

const StudentGuidanceUI = () => {
  const [activeTab, setActiveTab] = useState('career');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examType, setExamType] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate AI response
    setAiResponse('Analyzing your syllabus and generating personalized recommendations...');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Learning Guidance</h1>
          <p className="text-xl opacity-90">Navigate your educational journey with personalized AI recommendations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'career' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Compass className="w-5 h-5 mr-2" />
            Career Path
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'exam' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Exam Preparation
          </button>
        </div>

        {/* Content Area */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {activeTab === 'career' ? (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                  Career Guidance
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      AI Career Assessment
                    </h3>
                    <p className="text-gray-600 text-sm">Upload your academic records and interests for personalized career recommendations</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Book className="w-5 h-5 mr-2 text-blue-600" />
                      Skill Gap Analysis
                    </h3>
                    <p className="text-gray-600 text-sm">Get insights into required skills for your chosen career path</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Documents
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                  Exam Preparation
                </h2>
                <div className="space-y-4">
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Exam Type</option>
                    <option value="gate">Mid Term</option>
                    <option value="gre">End Exam</option>
                    <option value="cat">Hsc</option>
                    <option value="upsc">SSC</option>
                  </select>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Upload Study Materials</h3>
                    <p className="text-gray-600 text-sm">Get personalized topic recommendations based on your syllabus</p>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Syllabus
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - AI Response */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">AI Recommendations</h2>
            <div className="min-h-[400px] bg-gray-50 rounded-lg p-4">
              {aiResponse ? (
                <div className="space-y-4">
                  <p className="text-gray-700">{aiResponse}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-20">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload your documents to get personalized recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Analysis</h3>
            <p className="text-gray-600 text-sm">AI-powered analysis of your academic profile and career aspirations</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Personalized Path</h3>
            <p className="text-gray-600 text-sm">Custom learning paths based on your goals and current knowledge</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Exam Strategies</h3>
            <p className="text-gray-600 text-sm">Targeted preparation strategies for your chosen examination</p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Upload Documents</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {selectedFile ? (
                    <p>Selected file: {selectedFile.name}</p>
                  ) : (
                    <p>
                      Drag and drop your PDF here, or click to select
                      <br />
                      <span className="text-xs text-gray-500">
                        Supported file type: PDF
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedFile}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium
                  ${selectedFile 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                Analyze Document
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGuidanceUI;
