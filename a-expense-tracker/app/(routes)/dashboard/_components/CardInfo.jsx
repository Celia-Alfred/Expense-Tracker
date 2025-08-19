"use client";
import React, { useEffect, useState } from 'react';
import { FaRupeeSign, FaReceipt, FaWallet } from 'react-icons/fa';
import { GiPiggyBank } from "react-icons/gi";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CardInfo = ({ budgetList }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudgetCreated, setTotalBudgetCreated] = useState(0);

  const [savingsGoal, setSavingsGoal] = useState(() => {
    return localStorage.getItem('savingsGoal') || '';
  });

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    if (budgetList.length > 0) calculateCardInfo();
  }, [budgetList]);

  const calculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpent_ = 0;
    let budgetCreated_ = budgetList.length;

    budgetList.forEach((budget) => {
      totalBudget_ += Number(budget.amount);
      totalSpent_ += Number(budget.totalSpend);
    });

    setTotalBudget(totalBudget_);
    setTotalSpent(totalSpent_);
    setTotalBudgetCreated(budgetCreated_);
  };

  const actualSavings = totalBudget - totalSpent;
  const savingsPercent = savingsGoal > 0 ? Math.min((actualSavings / savingsGoal) * 100, 100).toFixed(1) : 0;
  const efficiencyScore = totalBudget > 0 ? ((actualSavings / totalBudget) * 100).toFixed(1) : 0;

  const getEfficiencyBadge = () => {
    if (efficiencyScore >= 70) return { text: "Efficient", color: "text-green-400" };
    if (efficiencyScore >= 40) return { text: "Moderate", color: "text-yellow-400" };
    return { text: "Overspent", color: "text-red-500" };
  };

  const badge = getEfficiencyBadge();

  const handleGoalSave = () => {
    if (goalInput) {
      localStorage.setItem('savingsGoal', goalInput);
      setSavingsGoal(goalInput);
      setEditingGoal(false);
    }
  };

  return (
    <>
      {budgetList.length > 0 ? (
        <>
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Budget */}
            <div className="p-6 border rounded-lg flex items-center justify-between bg-black">
              <div>
                <h2 className="text-sm text-gray-400">Total Budget</h2>
                <h2 className="flex items-center font-bold text-2xl text-white">
                  <FaRupeeSign className="text-xl mr-1" />{totalBudget}
                </h2>
              </div>
              <GiPiggyBank className="bg-primary p-2 h-10 w-10 rounded-full text-white" />
            </div>

            {/* Total Spent */}
            <div className="p-6 border rounded-lg flex items-center justify-between bg-black">
              <div>
                <h2 className="text-sm text-gray-400">Total Spent</h2>
                <h2 className="flex items-center font-bold text-2xl text-white">
                  <FaRupeeSign className="text-xl mr-1" />{totalSpent}
                </h2>
              </div>
              <div className="bg-primary p-3 h-10 w-10 rounded-full flex items-center justify-center text-white text-xl">
                <FaReceipt />
              </div>
            </div>

            {/* Budgets Created */}
            <div className="p-6 border rounded-lg flex items-center justify-between bg-black">
              <div>
                <h2 className="text-sm text-gray-400">Budgets Created</h2>
                <h2 className="font-bold text-2xl text-white">{totalBudgetCreated}</h2>
              </div>
              <div className="bg-primary p-3 h-10 w-10 rounded-full flex items-center justify-center text-white text-xl">
                <FaWallet />
              </div>
            </div>
          </div>

          {/* Savings Goal & Efficiency */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Savings Goal */}
            <div className="bg-black rounded-xl p-5 shadow-md flex items-center">
              <div className="w-24 h-24 min-w-[6rem]">
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

              <div className="ml-6 w-full">
                <h3 className="text-white text-lg font-semibold flex items-center justify-between">
                  Savings Goal
                  {savingsGoal && !editingGoal && (
                    <button
                      onClick={() => {
                        setEditingGoal(true);
                        setGoalInput(savingsGoal);
                      }}
                      className="text-sm text-blue-300 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </h3>

                {!editingGoal ? (
                  <>
                    <p className="text-sm text-gray-400 mt-1">Target: ₹{savingsGoal || '--'}</p>
                    <p className="text-sm text-gray-400">Saved: ₹{actualSavings}</p>
                    {savingsGoal ? (
                      <p className="text-sm text-gray-200 mt-1 font-medium">
                        🎯 {savingsPercent}% of goal achieved
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingGoal(true);
                          setGoalInput('');
                        }}
                        className="mt-1 text-sm text-blue-300 hover:underline"
                      >
                        Set your savings goal 🎯
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center mt-2">
                    <input
                      type="number"
                      className="px-2 py-1 rounded-md bg-gray-800 text-white w-32 border border-gray-600"
                      placeholder="Enter goal"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                    />
                    <button
                      className="ml-2 text-sm text-blue-400 hover:underline"
                      onClick={handleGoalSave}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Budget Efficiency */}
            <div className="bg-black rounded-xl p-5 shadow-md flex items-center">
              <div className="w-24 h-24 min-w-[6rem]">
                <CircularProgressbar
                  value={efficiencyScore}
                  text={`${efficiencyScore}%`}
                  styles={buildStyles({
                    pathColor:
                      efficiencyScore >= 70 ? '#22c55e' :
                      efficiencyScore >= 40 ? '#facc15' : '#ef4444',
                    textColor: '#fff',
                    trailColor: '#2c2f33',
                  })}
                />
              </div>
              <div className="ml-6">
                <h3 className="text-white text-lg font-semibold">Budget Efficiency</h3>
                <p className="text-sm text-gray-400 mt-1">Total Budget: ₹{totalBudget}</p>
                <p className="text-sm text-gray-400">Total Spent: ₹{totalSpent}</p>
                <p className={`text-sm mt-1 font-bold ${badge.color}`}>{badge.text}</p>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-[140px] rounded-lg bg-slate-800 animate-pulse" />
          ))}
        </div>
      )}
    </>
  );
};

export default CardInfo;
