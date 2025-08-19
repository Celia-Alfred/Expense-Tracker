"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Budgets, Expenses } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

const VoiceExpenseEntry = ({ refreshData }) => {
  const { user } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [step, setStep] = useState(1);
  const [expenseData, setExpenseData] = useState({});

  const SpeechRecognition = typeof window !== "undefined" && window.SpeechRecognition || window.webkitSpeechRecognition;

  const listen = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      toast.error("Error capturing voice.");
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log("Heard:", transcript);
      setIsListening(false);

      if (step === 1) {
        const amtMatch = transcript.match(/(?:rs|₹)?\s?(\d+)/);
        const nameMatch = transcript.match(/(?:for|on|about)\s+(.*)/);

        const amount = amtMatch ? amtMatch[1] : null;
        const name = nameMatch ? nameMatch[1] : "Unknown";

        if (!amount) {
          toast.error("Could not detect the amount. Try again.");
          return;
        }

        setExpenseData({ amount, name });
        toast.success(`Heard: ₹${amount} for ${name}`);
        setStep(2);

        setTimeout(() => listen(), 1000); // Ask for budget name
      } else if (step === 2) {
        const budgetName = transcript;
        const budget = await db
          .select()
          .from(Budgets)
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

        const match = budget.find(b =>
          b.name.toLowerCase() === budgetName.toLowerCase()
        );

        if (!match) {
          toast.error(`No budget found with name "${budgetName}"`);
          setStep(1);
          return;
        }

        const now = new Date().toISOString();
        await db.insert(Expenses).values({
          name: expenseData.name,
          amount: expenseData.amount,
          createdAt: now,
          budgetId: match.id,
        });

        toast.success(`Added ₹${expenseData.amount} for "${expenseData.name}" under "${match.name}"`);
        setStep(1);
        refreshData?.();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="mt-6 p-4 border border-purple-500 rounded-lg text-white bg-slate-900 shadow-lg w-full md:max-w-md">
      <h2 className="text-lg font-bold mb-2">🎙️ Voice Expense Entry</h2>
      <p className="text-sm mb-4">
        Step {step}: {step === 1 ? "Say the amount and expense (e.g. ₹200 for groceries)" : "Now say the budget category (e.g. food, travel, etc.)"}
      </p>
      <button
        onClick={listen}
        className={`px-4 py-2 rounded font-bold ${isListening ? "bg-red-600 animate-pulse" : "bg-purple-700 hover:bg-purple-800"}`}
      >
        {isListening ? "Listening..." : "🎤 Start Voice Input"}
      </button>
    </div>
  );
};

export default VoiceExpenseEntry;
