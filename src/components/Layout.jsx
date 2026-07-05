import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      <Sidebar />
      <main className="min-w-0 flex-1 pb-20 lg:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
