"use client";

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileData {
  name: string;
  size: string;
  description: string;
  timestamp: string;
}

const FilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [aiResponse, setAiResponse] = useState('AI generated response will appear here...');
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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
    if (selectedFile) {
      const newFile: FileData = {
        name: selectedFile.name,
        size: formatFileSize(selectedFile.size),
        description: description,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setFiles([...files, newFile]);
      setAiResponse(`Processing ${selectedFile.name}...\nAnalyzing content...\nGenerating response based on the uploaded file and description.`);
      setIsModalOpen(false);
      setDescription('');
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Section */}
      <div className="w-1/2 p-4 flex flex-col">
        {/* Header Strip */}
        <div className="flex justify-between items-center bg-gray-800 text-white h-8 px-3 rounded-md mb-4">
          <span className="text-xs font-medium">To upload a file</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-0.5 px-2 rounded-sm transition-colors"
          >
            Upload File
          </button>
        </div>

        {/* Files Table */}
        <div className="bg-white rounded-lg shadow flex-1 overflow-hidden">
          <div className="p-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">File Name</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Size</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Description</th>
                  <th className="px-4 py-2 text-xs font-medium text-gray-500 text-left">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{file.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{file.size}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{file.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{file.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-4">
        <div className="bg-white rounded-lg shadow h-full p-6">
          <h2 className="text-lg font-semibold mb-4">AI Response</h2>
          <div className="whitespace-pre-wrap text-gray-700">
            {aiResponse}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Upload File</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              {/* File Upload Area */}
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
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {selectedFile ? (
                    <p>Selected file: {selectedFile.name}</p>
                  ) : (
                    <p>
                      Drag and drop your file here, or click to select
                      <br />
                      <span className="text-xs text-gray-500">
                        Supported files: PDF, DOC, TXT
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  placeholder="Enter file description..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedFile}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium
                  ${selectedFile 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePage;