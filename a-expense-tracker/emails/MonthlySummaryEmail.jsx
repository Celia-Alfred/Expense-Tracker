import React from 'react';
import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Table,
  Row,
  Column,
} from '@react-email/components';

const MonthlySummaryEmail = ({ user, budgets, expenses, totalSpent }) => {
  const fullName = user?.first_name || 'User';

  const grouped = budgets.map(budget => {
    const budgetExpenses = expenses.filter(exp => exp.budgetId === budget.id);
    const categoryTotal = budgetExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      name: budget.name,
      budgeted: Number(budget.amount),
      total: categoryTotal,
      percent: Math.round((categoryTotal / Number(budget.amount)) * 100),
    };
  });

  const totalBudgeted = grouped.reduce((a, b) => a + b.budgeted, 0);
  const percentUsed = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const tips = [
    "Consider reducing Transportation costs by using passes or shared rides.",
    "Set a weekly spending limit for Dining Out.",
    "Use smart alerts to avoid overspending in variable categories.",
    "Review recurring subscriptions or unused services."
  ];

  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Html>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        <Container style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
          <Heading style={{ color: '#222', fontSize: '24px' }}>
            Monthly Expense Summary – {monthName}
          </Heading>

          <Text style={{ fontSize: '16px', marginBottom: '20px' }}>
            Hi {fullName},<br />
            We hope you had a focused and financially mindful month.
            Below is your personalized summary for <strong>{monthName}</strong>.
          </Text>

          <Section>
            <Heading style={{ fontSize: '18px', color: '#444' }}>
              Overview – Budget vs. Actual Spend
            </Heading>
            <Table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <Row style={{ borderBottom: '1px solid #ddd' }}>
                <Column><strong>Category</strong></Column>
                <Column><strong>Budgeted (₹)</strong></Column>
                <Column><strong>Spent (₹)</strong></Column>
                <Column><strong>% Used</strong></Column>
              </Row>
              {grouped.map((item, idx) => (
                <Row key={idx}>
                  <Column>{item.name}</Column>
                  <Column>₹{item.budgeted}</Column>
                  <Column>₹{item.total}</Column>
                  <Column>{item.percent}%</Column>
                </Row>
              ))}
              <Row style={{ borderTop: '1px solid #ddd' }}>
                <Column><strong>Total</strong></Column>
                <Column><strong>₹{totalBudgeted}</strong></Column>
                <Column><strong>₹{totalSpent}</strong></Column>
                <Column><strong>{percentUsed}%</strong></Column>
              </Row>
            </Table>
          </Section>

          <Hr style={{ margin: '20px 0' }} />

          <Section>
            <Heading style={{ fontSize: '18px', color: '#444' }}>Highlights</Heading>
            <Text>
              - You stayed within budget in {grouped.filter(g => g.percent <= 100).length} out of {grouped.length} categories.
            </Text>
            {grouped.some(g => g.percent > 100) && (
              <Text>
                - You overspent in {grouped.filter(g => g.percent > 100).length} categories. Review them for adjustments.
              </Text>
            )}
          </Section>

          <Section>
            <Heading style={{ fontSize: '18px', color: '#444' }}>Spending Trends</Heading>
            <Text>Your most frequent category: Dining Out (example). Peak spending days: Weekends.</Text>
          </Section>

          <Section>
            <Heading style={{ fontSize: '18px', color: '#444' }}>Tips for August</Heading>
            {tips.map((tip, i) => (
              <Text key={i} style={{ marginBottom: '8px' }}>• {tip}</Text>
            ))}
          </Section>

          <Hr style={{ margin: '20px 0' }} />

          <Text style={{ fontSize: '14px', color: '#666' }}>
            You're managing your finances well — keep it up!
            With small tweaks and consistent tracking, you’ll strengthen your budget even more in August.
          </Text>

          <Text style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
            — BudgetTrack Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MonthlySummaryEmail;
