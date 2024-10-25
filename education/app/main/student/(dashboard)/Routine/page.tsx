import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentGoalsDashboard = () => {
  const [currentHours, setCurrentHours] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Calculate recommended study hours and projected scores
  const calculateProjections = () => {
    const recommendedDaily = Math.ceil((targetScore / 100) * 8); // Base calculation
    const projectedScores = [
      { effort: "Minimum", hours: recommendedDaily - 2, projectedScore: targetScore - 15 },
      { effort: "Recommended", hours: recommendedDaily, projectedScore: targetScore },
      { effort: "Maximum", hours: recommendedDaily + 2, projectedScore: Math.min(targetScore + 10, 100) }
    ];
    return { recommendedDaily, projectedScores };
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    setShowAnalysis(true);
  };

  const { recommendedDaily, projectedScores } = calculateProjections();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Study Goal Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentHours">Current Study Hours per Day</Label>
              <Input
                id="currentHours"
                type="number"
                min="0"
                max="24"
                value={currentHours}
                onChange={(e) => setCurrentHours(Number(e.target.value))}
                placeholder="Enter current study hours"
              />
            </div>
            
            <div>
              <Label htmlFor="targetScore">Target Score (%)</Label>
              <Input
                id="targetScore"
                type="number"
                min="0"
                max="100"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                placeholder="Enter target score"
              />
            </div>
            
            <div>
              <Label htmlFor="daysLeft">Days Until Exam</Label>
              <Input
                id="daysLeft"
                type="number"
                min="1"
                value={daysLeft}
                onChange={(e) => setDaysLeft(Number(e.target.value))}
                placeholder="Enter days until exam"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Analyze Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      {showAnalysis && (
        <>
          <Alert>
            <AlertDescription className="space-y-2">
              <p>Based on your target score of {targetScore}%, you should aim for:</p>
              <ul className="list-disc pl-6">
                <li>Recommended daily study hours: {recommendedDaily} hours</li>
                <li>Total study hours needed: {recommendedDaily * daysLeft} hours</li>
                <li>Current gap: {recommendedDaily - currentHours} additional hours needed per day</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Projected Scores Based on Study Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectedScores}>
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
              <CardTitle>Required Study Hours</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectedScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="effort" />
                  <YAxis
                    label={{ value: 'Study Hours per Day', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#10B981" name="Study Hours" />
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