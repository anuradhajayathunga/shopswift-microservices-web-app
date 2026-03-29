import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }) {
  return (
    // Only pages inside the (dashboard) folder will get this shell!
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}