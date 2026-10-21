
import {
  Film,
  Home,
  Users,
  History,
  Compass,
  LogOut,
  Clapperboard,
} from "lucide-react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { logout } from "../utils/auth"

function DashboardLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/clubs", label: "My Clubs", icon: Users },
    { to: "/discover", label: "Discover", icon: Compass },
    { to: "/history", label: "Film History", icon: History },
  ]

  return (
    <div className="min-h-screen bg-[#1B1026] text-[#F4E8D2]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#493253] bg-[#21132E]">

        {/* Brand */}
        <div className="relative border-b border-[#493253] px-6 py-7">
          <div className="absolute right-5 top-5 text-[#C18BE4]">
            <span className="text-lg">✳</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center border border-[#C18BE4] bg-[#6E3A91] text-[#F4E8D2]">
              <Film size={23} strokeWidth={1.7} />
            </div>

            <div>
              <div className="display-font text-3xl leading-none tracking-wide">
                Reelspin
              </div>
              <p className="mono-font mt-1 text-[9px] uppercase tracking-[0.2em] text-[#C18BE4]">
                Your private picture house
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">
          <p className="mono-font mb-4 px-3 text-[10px] uppercase tracking-[0.22em] text-[#A58CAD]">
            The box office
          </p>

          <div className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 border px-3 py-3 transition-colors duration-150",
                    isActive
                      ? "border-[#80529A] bg-[#382146] text-[#F4E8D2] shadow-[inset_3px_0_0_#C18BE4]"
                      : "border-transparent text-[#B8A5C4] hover:border-[#493253] hover:bg-[#2B1A38] hover:text-[#F4E8D2]",
                  ].join(" ")
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mx-3 my-8 border-t border-dashed border-[#493253]" />

          {/* Decorative ticket */}
          <div className="relative mx-2 rotate-[-2deg] border border-dashed border-[#80529A] bg-[#2B1A38] px-4 py-5">
            <div className="mono-font text-[9px] uppercase tracking-[0.2em] text-[#C18BE4]">
              Admit one
            </div>
            <div className="display-font mt-2 text-2xl leading-tight text-[#F4E8D2]">
              GOOD FILMS.
              <br />
              BETTER COMPANY.
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#80529A] pt-3 text-[#C18BE4]">
              <Clapperboard size={17} />
              <span className="mono-font text-[9px]">EST. YOUR NEXT FILM NIGHT</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-[#493253] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border border-transparent px-3 py-3 text-sm text-[#B8A5C4] transition hover:border-[#68404F] hover:bg-[#38202F] hover:text-[#F0A4B9]"
          >
            <LogOut size={18} />
            Leave the cinema
          </button>

          <p className="mono-font mt-3 px-3 text-[9px] uppercase tracking-[0.16em] text-[#806C8C]">
            Reelspin film club
          </p>
        </div>
      </aside>

      {/* Page content */}
      <main className="relative ml-64 min-h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-100px] top-[-120px] h-80 w-80 rounded-full border border-[#80529A]/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-65px] top-[-85px] h-64 w-64 rounded-full border border-dashed border-[#80529A]/20"
        />

        <div className="relative z-10 min-h-screen p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
