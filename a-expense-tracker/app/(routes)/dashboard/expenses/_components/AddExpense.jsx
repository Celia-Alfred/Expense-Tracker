"use client";
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { toast } from 'sonner';
import moment from 'moment';
import { Loader2 } from 'lucide-react';

const AddExpense = ({ budgetId, user, refreshData, budgetInfo }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // 🔁 Dynamic Placeholder Setup
  const expenseCategoriesEg = [
    { name: "Groceries", amount: 150 },
    { name: "Dining Out", amount: 500 },
    { name: "Medications", amount: 250 },
    { name: "Rent", amount: 10000 },
    { name: "Public Transport", amount: 450 },
    { name: "Movies", amount: 100 },
    { name: "Doctor Visits", amount: 400 },
    { name: "Online Courses", amount: 400 },
    { name: "Car Maintenance", amount: 500 }
  ];

  const getRandomExpense = () => {
    return expenseCategoriesEg[Math.floor(Math.random() * expenseCategoriesEg.length)];
  };

  const [placeholder, setPlaceholder] = useState(getRandomExpense());

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(getRandomExpense());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 🎙️ Voice Recognition Logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const amountMatch = transcript.match(/₹?(\d+)/);
      const nameMatch = transcript.match(/for (.+)/i);

      if (amountMatch) setAmount(amountMatch[1]);
      if (nameMatch) setName(nameMatch[1]);

      toast.success(`Captured: ${transcript}`);
    };

    recognition.onerror = (event) => {
      toast.error("Voice input failed: " + event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  // ✅ Budget check before adding
  const checkExpenseAndAdd = async () => {
    setLoading(true);
    const remaining = Number(budgetInfo.amount) - budgetInfo.totalSpend;
    const audio = new Audio("/error.mp3");

    if (Number(amount) > remaining) {
      audio.play();
      setLoading(false);
      refreshData();
      toast.error('Budget limit exceeded!', {
        style: {
          border: "2px solid #a72828",
          backgroundColor: '#edd4d4',
          color: '#571515',
          padding: '14px',
          borderRadius: '10px',
          fontWeight: "700"
        }
      });
      return;
    }

    addNewExpense();
  };

  const addNewExpense = async () => {
    const audio = new Audio("/notification.mp3");

    const result = await db.insert(Expenses).values({
      name,
      amount,
      budgetId,
      createdAt: moment().format("DD/MM/YYYY")
    });

    if (result) {
      setLoading(false);
      setName('');
      setAmount('');
      refreshData();

      toast.success('New Expense Added!', {
        style: {
          border: "2px solid #28a745",
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '14px',
          borderRadius: '10px',
          fontWeight: "700"
        }
      });

      audio.play();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-lg bg-black">
      <h2 className="font-bold text-lg">Add Expense</h2>

      {/* Name Input */}
      <div className="py-2 flex flex-col space-y-2">
        <h2 className="font-semibold">Expense Name</h2>
        <Input
          placeholder={`e.g. ${placeholder.name}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Amount Input */}
      <div className="py-2 flex flex-col space-y-2">
        <h2 className="font-semibold">Expense Amount</h2>
        <Input
          type="number"
          placeholder={`e.g. ${placeholder.amount}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* 🎙️ Voice Input Button */}
      <Button
        onClick={startListening}
        disabled={listening}
        className="bg-purple-600 hover:bg-purple-700 w-full mt-2"
      >
        {listening ? "Listening..." : "🎙️ Use Voice Input"}
      </Button>

      {/* Save Expense Button */}
      <Button
        disabled={!(name && amount)}
        className="mt-3 w-full"
        onClick={checkExpenseAndAdd}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
};

export default AddExpense;
