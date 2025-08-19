// app/_components/BudgetAlertClient.jsx
"use client";
import { useEffect } from 'react';
import { toast } from 'sonner';
import { getBudgetGoals } from '@/utils/BudgetGoalsManager';

const BudgetAlertClient = ({ budgets }) => {
  useEffect(() => {
    const goals = getBudgetGoals(); // { "Food": "500", "Health": "800" }

    budgets.forEach(budget => {
      const goalRaw = goals[budget.name];
      const goal = Number(goalRaw); // ✅ Convert string to number
      const spend = budget.totalSpend ?? 0;

      if (goal > 0 && spend >= 0.8 * goal) {
        toast.warning(`⚠️ You're reaching your goal limit for "${budget.name}". Spent ₹${spend} / ₹${goal}`, {
          style: {
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            color: '#856404',
            fontWeight: '600',
          },
        });
      }
    });
  }, [budgets]);

  return null;
};

export default BudgetAlertClient;
