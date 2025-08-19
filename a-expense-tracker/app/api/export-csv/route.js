import { NextResponse } from "next/server";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// ✅ Safe date formatter for CSV (returns dd/mm/yyyy or N/A)
function formatDateSafe(date) {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString("en-GB"); // "dd/mm/yyyy"
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    const userData = await userRes.json();
    const userEmail = userData.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
        category: Budgets.name,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, userEmail))
      .orderBy(desc(Expenses.id));

    const headers = ["ID", "Name", "Amount", "Category", "Created At"];
    const rows = result.map((exp) => {
      const formattedDate = formatDateSafe(exp.createdAt);
      return [
        exp.id,
        exp.name,
        exp.amount,
        exp.category || "Uncategorized",
        formattedDate,
      ]
        .map((val) => `"${String(val).replace(/"/g, '""')}"`) // CSV-escape
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=expenses.csv",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
