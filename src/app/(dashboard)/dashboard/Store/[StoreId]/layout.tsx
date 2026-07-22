import SideBar from '@/app/components/DashboardUser/SideBar'; 
import Navbar from '@/app/components/DashboardUser/TopBar'


const layout = ({children} : {children: React.ReactNode}) => {
  return (
<div className="flex min-h-screen">
  <SideBar />
  <Navbar />
  <main className="flex-1">
    {children}
  </main>
</div>
  )
}

export default layout