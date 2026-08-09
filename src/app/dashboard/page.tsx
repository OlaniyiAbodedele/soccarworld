import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/sign-in");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#9CE500",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          SoccaR Founder Dashboard
        </p>

        <h1
          style={{
            marginTop: "20px",
            fontSize: "38px",
            fontWeight: 650,
          }}
        >
          Secure dashboard access confirmed.
        </h1>

        <p
          style={{
            marginTop: "16px",
            color: "rgba(255,255,255,0.55)",
            fontSize: "15px",
          }}
        >
          Founder identity loading next.
        </p>
      </div>
    </main>
  );
}