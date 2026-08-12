import { Suspense } from "react";

import ActivateClient from "./ActivateClient";

export default function AccountActivatePage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#070707",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
        >
          <p>Preparing account activation…</p>
        </main>
      }
    >
      <ActivateClient />
    </Suspense>
  );
}