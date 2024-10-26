"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Textarea  from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentGoalsDashboard = () => {
  const [goalText, setGoalText] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState({
    targetScore: 0,
    timeframe: 0,
    confidence: 0
  });

  // Parse text input to extract relevant information
  const analyzeGoalText = (text: string) => {
    // Simple parsing logic - in a real app, you'd want more sophisticated NLP
    const text_lower = text.toLowerCase();
    
    // Extract target score
    let targetScore = 75; // default
    if (text_lower.includes('distinction') || text_lower.includes('excellent')) {
      targetScore = 85;
    } else if (text_lower.includes('merit') || text_lower.includes('good')) {
      targetScore = 75;
    } else if (text_lower.includes('pass') || text_lower.includes('average')) {
      targetScore = 60;
    }
    
    // Extract timeframe
    let timeframe = 30; // default days
    if (text_lower.includes('week')) {
      timeframe = 7;
    } else if (text_lower.includes('month')) {
      timeframe = 30;
    } else if (text_lower.includes('semester')) {
      timeframe = 120;
    }
    
    // Calculate confidence level based on goal clarity
    let confidence = text.length > 50 ? 80 : 60;
    if (text_lower.includes('specific') || text_lower.includes('exactly')) {
      confidence += 10;
    }
    
    return {
      targetScore,
      timeframe,
      confidence: Math.min(confidence, 100)
    };
  };

  // Generate projections based on analysis
  const generateProjections = (analysis: typeof analysisResult) => {
    return [
      {
        effort: "Minimum",
        projectedScore: Math.max(analysis.targetScore - 15, 0),
        confidence: Math.max(analysis.confidence - 20, 0),
        hoursNeeded: 2
      },
      {
        effort: "Average",
        projectedScore: analysis.targetScore,
        confidence: analysis.confidence,
        hoursNeeded: 4
      },
      {
        effort: "Maximum",
        projectedScore: Math.min(analysis.targetScore + 10, 100),
        confidence: Math.min(analysis.confidence + 10, 100),
        hoursNeeded: 6
      }
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const analysis = analyzeGoalText(goalText);
    setAnalysisResult(analysis);
    setShowAnalysis(true);
  };

  const projections = generateProjections(analysisResult);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Share Your Study Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              className="min-h-32"
              placeholder="Describe your study goal in detail. For example: 'I want to achieve distinction in my final math exam next month. I'm currently struggling with calculus and need to improve significantly.'"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Analyze My Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      {showAnalysis && (
        <>
          <Alert>
            <AlertDescription className="space-y-2">
              <p>Based on your goal description, here's what I understand:</p>
              <ul className="list-disc pl-6">
                <li>Target Achievement Level: {analysisResult.targetScore}%</li>
                <li>Time Available: {analysisResult.timeframe} days</li>
                <li>Goal Clarity Score: {analysisResult.confidence}%</li>
              </ul>
              <p className="mt-4">Recommended Actions:</p>
              <ul className="list-disc pl-6">
                <li>Maintain consistent daily study schedule of {Math.ceil(analysisResult.targetScore/20)} hours</li>
                <li>Break down your study into {Math.ceil(analysisResult.timeframe/7)} weekly milestones</li>
                <li>Regular self-assessment every {Math.ceil(analysisResult.timeframe/4)} days</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Projected Scores Based on Effort</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="effort" />
                  <YAxis
                    label={{ value: 'Projected Score (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Bar dataKey="projectedScore" fill="#4F46E5" name="Projected Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Confidence by Effort Level</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="effort" />
                  <YAxis
                    label={{ value: 'Confidence Level (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="#10B981" name="Confidence Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentGoalsDashboard;