// app/api/send-monthly-summary/route.js
import { Resend } from 'resend';
import { render } from '@react-email/render';
import MonthlySummaryEmail from '@/emails/MonthlySummaryEmail';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ✅ Fetch current user data from Clerk
    const userResp = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const userData = await userResp.json();
    const email = userData?.email_addresses?.[0]?.email_address;
    const firstName = userData?.first_name || "User";

    if (!email) {
      return new Response("Email not found", { status: 400 });
    }

    // ✅ Fetch user's budgets
    const userBudgets = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, email));

    // ✅ Fetch user's expenses (joined for consistency)
    const userExpenses = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        budgetId: Expenses.budgetId,
        createdAt: Expenses.createdAt,
      })
      .from(Expenses)
      .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
      .where(eq(Budgets.createdBy, email));

    const totalSpent = userExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    // ✅ Use JSX directly inside render (important fix)
    const html = render(
      <MonthlySummaryEmail
        user={{ email, first_name: firstName }}
        budgets={userBudgets}
        expenses={userExpenses}
        totalSpent={totalSpent}
      />
    );

    // ✅ Send email via Resend
    const result = await resend.emails.send({
      from: 'Monthly Reports <monthly@onresend.com>', // must be verified on Resend
      to: email,
      subject: `📬 Your Monthly Expense Summary – ${new Date().toLocaleString('default', { month: 'long' })}`,
      html, // must be a valid string
    });

    console.log("✅ Sent to:", email, result);

    return new Response('📨 Summary sent to your registered email!', { status: 200 });

  } catch (error) {
    console.error("❌ Error sending summary:", error);
    return new Response("❌ Failed to send your summary", { status: 500 });
  }
}
