// utils/budgetGoalsManager.js
export const getBudgetGoals = () => {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem("budgetGoals") || "{}");
};

export const setBudgetGoal = (name, value) => {
  const currentGoals = getBudgetGoals();
  currentGoals[name] = Number(value);
  localStorage.setItem("budgetGoals", JSON.stringify(currentGoals));
};

export const removeBudgetGoal = (name) => {
  const currentGoals = getBudgetGoals();
  delete currentGoals[name];
  localStorage.setItem("budgetGoals", JSON.stringify(currentGoals));
};
