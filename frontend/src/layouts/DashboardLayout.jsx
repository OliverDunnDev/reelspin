import { Film, Home, Users, History, Compass, LogOut } from "lucide-react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"

function DashboardLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC]">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">

        <div className="flex h-20 items-center px-7">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
              <Film size={20} className="text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Reelspin
            </span>
          </div>
        </div>

        <nav className="px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>

          <NavLink
            to="/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/clubs"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Users size={18} />
            My Clubs
          </NavLink>

          <NavLink
            to="/discover"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Compass size={18} />
            Discover
          </NavLink>

          <NavLink
            to="/history"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <History size={18} />
            History
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Log out
          </button>

        </nav>
      </aside>

      {/* Main */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardLayout