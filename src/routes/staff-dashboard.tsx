import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, QrCode, ShieldCheck, TrendingUp, XCircle } from "lucide-react";
import { Wordmark } from "@/components/Brand";
import { inr, useReceipts, useSession } from "@/lib/store";

export const Route = createFileRoute("/staff-dashboard")({
  head: () => ({
    meta: [
      { title: "Exit verification & store overview — SwiftCart staff" },
      { name: "description", content: "Verify shopper exit QR receipts and review paid baskets, revenue and verification status in real time." },
      { property: "og:title", content: "SwiftCart staff dashboard" },
      { property: "og:description", content: "Verify exit receipts and monitor store sales from one screen." },
    ],
  }),
  component: Dashboard;
});

function Dashboard() {
  return null;
}
