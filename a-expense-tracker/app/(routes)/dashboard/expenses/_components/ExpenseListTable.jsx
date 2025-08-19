'use client';

import React, { useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { toast } from 'sonner';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';

const ExpenseListTable = ({ expensesList, refreshData }) => {
  const [filter, setFilter] = useState('');

  const deleteExpense = async (expenses) => {
    const audio = new Audio("/notification.mp3");

    const result = await db.delete(Expenses)
      .where(eq(Expenses.id, expenses.id))
      .returning();

    if (result) {
      toast.success('Expense Deleted Successfully!', {
        style: {
          border: "2px solid #28a745",
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '14px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          fontWeight: "700"
        }
      });
      audio.play();
      refreshData();
    }
  };

  const filteredExpenses = expensesList.filter(exp => {
    const nameMatch = exp.name.toLowerCase().includes(filter.toLowerCase());
    const dateMatch = exp.createdAt && exp.createdAt.includes(filter);
    return nameMatch || dateMatch;
  });

  return (
    <div className="mt-5">
      <input
        type="text"
        placeholder="Search by name or date (e.g. 28)"
        className="w-full px-4 py-2 rounded-lg mb-4 text-sm md:text-base text-white bg-slate-900 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="text-xs md:text-[17px] border border-white rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-black text-white font-bold py-3 px-4">
          <h2>Name</h2>
          <h2>Amount</h2>
          <h2>Date</h2>
          <h2>Action</h2>
        </div>

        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expenses, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center bg-slate-800 text-slate-200 font-medium px-4 py-3 hover:bg-slate-700 transition duration-200"
            >
              <h2 className="truncate">{expenses.name}</h2>
              <h2 className="font-semibold">₹{expenses.amount}</h2>
              <h2>{expenses.createdAt || "N/A"}</h2>
              <h2 className="ml-3 mt-[2px] md:mt-0">
                <FaTrashCan
                  className="text-red-600 hover:text-red-400 cursor-pointer text-[14px] md:text-[17px] transition duration-200"
                  onClick={() => deleteExpense(expenses)}
                />
              </h2>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4 bg-slate-800">
            No matching expenses found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseListTable;
