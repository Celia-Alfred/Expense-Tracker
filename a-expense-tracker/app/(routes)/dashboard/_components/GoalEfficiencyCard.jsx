// routes/dashboard/_components/GoalEfficiencyCard.jsx
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const GoalEfficiencyCard = ({ totalBudget = 32000, totalSpent = 24300, savingsGoal = 10000 }) => {
  const actualSavings = totalBudget - totalSpent;
  const savingsPercent = Math.min((actualSavings / savingsGoal) * 100, 100).toFixed(1);
  const efficiencyScore = ((actualSavings / totalBudget) * 100).toFixed(1);

  const getEfficiencyBadge = () => {
    if (efficiencyScore >= 70) return { text: "🟢 Efficient", color: "text-green-400" };
    if (efficiencyScore >= 40) return { text: "🟡 Moderate", color: "text-yellow-400" };
    return { text: "🔴 Overspent", color: "text-red-500" };
  };

  const badge = getEfficiencyBadge();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* Savings Goal Tracker */}
      <div className="bg-[#0d1117] rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={savingsPercent}
            text={`${savingsPercent}%`}
            styles={buildStyles({
              pathColor: '#4f46e5',
              textColor: '#fff',
              trailColor: '#2c2f33',
            })}
          />
        </div>
        <div className="ml-6">
          <h3 className="text-white text-xl font-semibold">Savings Goal</h3>
          <p className="text-sm text-gray-400 mt-1">Target: ₹{savingsGoal}</p>
          <p className="text-sm text-gray-400">Saved: ₹{actualSavings}</p>
          <p className="text-sm text-gray-200 mt-2 font-medium">🎯 {savingsPercent}% of goal achieved</p>
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="bg-[#0d1117] rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={efficiencyScore}
            text={`${efficiencyScore}%`}
            styles={buildStyles({
              pathColor:
                efficiencyScore >= 70 ? '#22c55e' : efficiencyScore >= 40 ? '#facc15' : '#ef4444',
              textColor: '#fff',
              trailColor: '#2c2f33',
            })}
          />
        </div>
        <div className="ml-6">
          <h3 className="text-white text-xl font-semibold">Budget Efficiency</h3>
          <p className="text-sm text-gray-400 mt-1">Total Budget: ₹{totalBudget}</p>
          <p className="text-sm text-gray-400">Total Spent: ₹{totalSpent}</p>
          <p className={`text-sm mt-2 font-bold ${badge.color}`}>{badge.text}</p>
        </div>
      </div>
    </div>
  );
};

export default GoalEfficiencyCard;
