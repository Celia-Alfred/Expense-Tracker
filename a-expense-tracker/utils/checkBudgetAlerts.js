'use client';

import { toast } from 'sonner';

// 🔊 Safely play alert sound
const playSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.play().catch((e) => console.warn('Audio play failed:', e));
  } catch (err) {
    console.warn('Sound error:', err);
  }
};

export const checkBudgetAlerts = (budgets = []) => {
  if (!Array.isArray(budgets) || budgets.length === 0) return;

  budgets.forEach((budget) => {
    const totalSpent = Number(budget.totalSpend || 0);
    const maxBudget = Number(budget.maxAmount || 0);

    if (!maxBudget || maxBudget === 0) return;

    const percentUsed = (totalSpent / maxBudget) * 100;

    // ⚠️ Warning: 80–99% used
    if (percentUsed >= 80 && percentUsed < 100) {
      toast.warning(`⚠️ You've used ${percentUsed.toFixed(0)}% of your "${budget.name}" budget`, {
        style: {
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeeba',
          color: '#856404',
          fontWeight: 'bold',
          padding: '12px',
          borderRadius: '10px',
          fontFamily: 'Arial',
        },
      });
      playSound();
    }

    if (percentUsed >= 100) {
      toast.error(`🚨 You’ve exceeded your "${budget.name}" budget!`, {
        style: {
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          fontWeight: 'bold',
          padding: '12px',
          borderRadius: '10px',
          fontFamily: 'Arial',
        },
      });
      playSound();
    }
  });
};
