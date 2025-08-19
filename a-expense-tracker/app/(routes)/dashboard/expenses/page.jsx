"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import ExpenseListTable from './_components/ExpenseListTable';
import { toast } from "sonner";

const Page = () => {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [goals, setGoals] = useState({});

  useEffect(() => {
    if (user) {
      getBudgetList();
      loadGoals();
    }
  }, [user]);

  const loadGoals = () => {
    const saved = localStorage.getItem("budgetGoals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  };

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses(result); // Pass budget list
  };

  const getAllExpenses = async (budgets) => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
    checkAgainstGoals(result, budgets || budgetList);
  };

  const total = expensesList.reduce((acc, item) => acc + Number(item.amount), 0);

  const checkAgainstGoals = (expenses, budgets) => {
    const spentMap = {};

    expenses.forEach((exp) => {
      const id = exp.budgetId;
      spentMap[id] = (spentMap[id] || 0) + Number(exp.amount);
    });

    for (const [id, amountSpent] of Object.entries(spentMap)) {
      const goal = goals[id];
      const budget = budgets.find((b) => b.id === parseInt(id));
      const name = budget?.name || "Unknown";

      if (goal && Number(goal) > 0 && amountSpent >= Number(goal)) {
        toast.warning(`⚠️ You’ve exceeded your goal of ₹${goal} on "${name}"!`, {
          style: {
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeeba',
            color: '#856404',
            fontWeight: '600',
          },
        });
      }
    }
  };

  const speakSummary = () => {
    if (expensesList.length === 0) {
      const msg = new SpeechSynthesisUtterance("You have not added any expenses yet.");
      window.speechSynthesis.speak(msg);
      return;
    }

    const categoryTotals = {};

    for (let expense of expensesList) {
      const budget = budgetList.find((b) => b.id === expense.budgetId);
      const category = budget?.name || "Unknown";
      categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
    }

    const breakdown = Object.entries(categoryTotals)
      .map(([category, amt]) => `₹${amt} on ${category}`)
      .join(", ");

    const message = `You have spent a total of ₹${total}. ${breakdown}.`;
    const msg = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(msg);
  };

  const handleDownload = async () => {
    const res = await fetch("/api/export-csv");
    if (!res.ok) {
      alert("Failed to download CSV.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-16 md:mt-0 p-5 md:p-10 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="font-bold text-xl md:text-2xl py-3">All Expenses</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={speakSummary}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            🔊 Speak Category-wise Expense Summary
          </button>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            📄 Download CSV
          </button>
        </div>
      </div>

      <div className="mb-6 text-lg">
        Total expenses so far: <strong>₹{total}</strong>
      </div>

      <ExpenseListTable
        expensesList={expensesList}
        refreshData={() => getBudgetList()}
      />
    </div>
  );
};

export default Page;
