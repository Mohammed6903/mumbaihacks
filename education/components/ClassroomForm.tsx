"use client"
import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";

const CourseExamForm = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    examType: '',
    examDate: '',
    duration: '', // Changed to string type
    format: '',
    modules: [{ name: '', objectives: [''] }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleChange = (moduleIndex, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].name = value;
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const handleObjectiveChange = (moduleIndex, objectiveIndex, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].objectives[objectiveIndex] = value;
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, { name: '', objectives: [''] }]
    }));
  };

  const removeModule = (moduleIndex) => {
    const newModules = formData.modules.filter((_, index) => index !== moduleIndex);
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const addObjective = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].objectives.push('');
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const removeObjective = (moduleIndex, objectiveIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].objectives = newModules[moduleIndex].objectives.filter(
      (_, index) => index !== objectiveIndex
    );
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="w-1/2 p-6">
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Course Exam Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input
                id="courseName"
                name="courseName"
                type="text"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full"
                required
                placeholder="Enter course name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Input
                id="examType"
                name="examType"
                type="text"
                value={formData.examType}
                onChange={handleChange}
                className="w-full"
                required
                placeholder="Enter exam type"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                name="examDate"
                type="text" // Changed to text type
                value={formData.examDate}
                onChange={handleChange}
                className="w-full"
                required
                placeholder="Enter exam date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="text" // Changed to text type
                value={formData.duration}
                onChange={handleChange}
                className="w-full"
                required
                placeholder="Enter duration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Input
                id="format"
                name="format"
                type="text"
                value={formData.format}
                onChange={handleChange}
                className="w-full"
                required
                placeholder="Enter format"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Modules</Label>
                <Button 
                  type="button" 
                  onClick={addModule}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Module
                </Button>
              </div>

              {formData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <Input
                      type="text"
                      placeholder="Module Name"
                      value={module.name}
                      onChange={(e) => handleModuleChange(moduleIndex, e.target.value)}
                      className="flex-1 mr-2"
                    />
                    <Button 
                      type="button"
                      variant="destructive"
                      onClick={() => removeModule(moduleIndex)}
                      className="flex items-center"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Objectives</Label>
                      <Button
                        type="button"
                        onClick={() => addObjective(moduleIndex)}
                        className="flex items-center"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Objective
                      </Button>
                    </div>

                    {module.objectives.map((objective, objectiveIndex) => (
                      <div key={objectiveIndex} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter objective"
                          value={objective}
                          onChange={(e) => handleObjectiveChange(moduleIndex, objectiveIndex, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeObjective(moduleIndex, objectiveIndex)}
                          size="sm"
                          className="flex items-center"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseExamForm;