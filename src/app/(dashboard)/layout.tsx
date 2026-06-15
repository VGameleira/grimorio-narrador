import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {" "}
      <Sidebar />{" "}
      <div className="flex flex-1 flex-col pl-64">
        {" "}
        <Navbar />{" "}
        <main className="flex-1 px-8 py-6 pt-24">{children}</main>{" "}
      </div>{" "}
    </div>
  );
}
