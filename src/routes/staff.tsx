import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/Brand";
import { useSession, type Session } from "@/lib/store";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff portal — SwiftCart admin, guard and employee sign in" },
      { name: "description", content: "Store staff sign in to verify exit QR receipts, monitor sales and manage the SwiftCart floor." },
      { property: "og:title", content: "SwiftCart staff portal" },
      { property: "og:description", content: "Admin, guard and employee access to receipt verification and store analytics." },
    ],
  }),
  component: StaffLogin,
});

function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Session["role"]>("guard");
  const [error, setError] = useState("");
  const { signIn } = useSession();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Enter your staff email and a password of at least 6 characters.");
      return;
    }
    signIn(email, role);
    navigate({ to: "/staff-dashboard" });
  };

  return (
    <AuthShell>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" /> Staff portal — Admin · Guard · Employee
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="staff-email">
            Email
          </label>
          <input
            id="staff-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="staff-password">
            Password
          </label>
          <input
            id="staff-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <span className="text-sm font-medium text-foreground">Role</span>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(["admin", "guard", "employee"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg border py-2 text-sm capitalize transition-colors ${
                  role === r ? "border-primary bg-primary/5 font-semibold text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-brand-gradient py-3 font-semibold text-primary-foreground shadow-soft">
          Sign in
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Customer?{" "}
        <Link to="/auth" className="font-semibold text-primary hover:underline">
          Customer sign in
        </Link>
      </p>
    </AuthShell>
  );
}
