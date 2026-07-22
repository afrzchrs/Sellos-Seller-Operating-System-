import Sidebar from "@/app/components/DashboardHub/HubSideBar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};
  
export default layout;
