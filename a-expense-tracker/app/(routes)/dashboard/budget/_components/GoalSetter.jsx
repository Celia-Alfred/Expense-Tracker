"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GoalSetter = ({ budgetList }) => {
  const [goals, setGoals] = useState({});

  useEffect(() => {
    // Load existing goals from localStorage
    const saved = localStorage.getItem("budgetGoals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const handleChange = (budgetId, value) => {
    setGoals((prev) => ({
      ...prev,
      [budgetId]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("budgetGoals", JSON.stringify(goals));
    toast.success("Budget goals saved!");
  };

  return (
    <div className="bg-slate-900 p-5 mt-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Set Budget Goals</h2>
      <div className="space-y-4">
        {budgetList.map((budget) => (
          <div key={budget.id} className="flex items-center gap-4">
            <span className="w-8">{budget.icon}</span>
            <span className="flex-1 text-white">{budget.name}</span>
            <Input
              type="number"
              placeholder="Enter goal"
              value={goals[budget.id] || ""}
              onChange={(e) => handleChange(budget.id, e.target.value)}
              className="w-[120px]"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleSave} className="mt-4">
        Save Goals
      </Button>
    </div>
  );
};

export default GoalSetter;
