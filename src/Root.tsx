import { AppLayout } from "@/components/AppLayout";
import { Outlet } from "react-router-dom";
export function Root() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}