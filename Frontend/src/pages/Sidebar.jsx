import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Film,
  History,
  Users,
  UserPlus,
  ThumbsUp,
  ListVideo,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToggle } from "../contexts/ToggleSidebar.jsx";
import CenterDiv from "../components/CenterDiv.jsx";
import { cn } from "../lib/cn";

const navItems = [
  { to: "/", end: true, icon: Home, label: "Home" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/mycontent", icon: Film, label: "My content" },
  { to: "/history", icon: History, label: "History" },
  { to: "/subscribers", icon: Users, label: "Subscribers" },
  { to: "/subscribedTo", icon: UserPlus, label: "Subscribed To" },
  { to: "/liked-video", icon: ThumbsUp, label: "Liked Videos" },
  { to: "/collections", icon: ListVideo, label: "Collections" },
];

const bottomNavItems = [
  { to: "/support", icon: LifeBuoy, label: "Support" },
  { to: "/setting", icon: Settings, label: "Settings" },
];

function NavItem({ to, end, icon: Icon, label, onNavigate }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            isActive
              ? "bg-primary/15 text-primary ring-1 ring-primary/25"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )
        }
      >
        <Icon size={18} strokeWidth={2} />
        {label}
      </NavLink>
    </li>
  );
}

function Sidebar() {
  const { user, isAuthenticated, loading, verifyEmailRes } = useAuth();
  const { isVerified } = user || {};
  const { isToggle, setIsToggle } = useToggle();
  const closeSidebar = () => setIsToggle(false);

  return (
    <div className="mx-auto grid w-full max-w-[1600px] bg-background lg:grid-cols-[240px_1fr]">
      {isToggle && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "sticky top-16 z-50 flex h-[calc(100vh-4rem)] flex-col justify-between bg-background px-3 py-5",
          "max-lg:fixed max-lg:left-0 max-lg:w-72 max-lg:shadow-2xl max-lg:transition-transform",
          !isToggle && "max-lg:-translate-x-full"
        )}
        aria-label="Main navigation"
      >
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={closeSidebar} />
          ))}
        </ul>
        <ul className="mt-auto flex flex-col gap-1 pt-4">
          {bottomNavItems.map((item) => (
            <NavItem key={item.to} {...item} onNavigate={closeSidebar} />
          ))}
        </ul>
      </aside>

      <div className="min-w-0 bg-background px-4 py-2 lg:px-6 lg:py-4">
        {isAuthenticated && isVerified ? (
          <Outlet />
        ) : !isAuthenticated ? (
          <CenterDiv>
            <div className="text-center">
              <h2 className="font-display text-xl font-bold text-foreground">
                Please log in
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No videos are available until you sign in.
              </p>
            </div>
          </CenterDiv>
        ) : (
          <CenterDiv>
            <div className="text-center">
              {loading && (
                <h2 className="font-display text-xl font-bold text-foreground">
                  Loading…
                </h2>
              )}
              {verifyEmailRes && (
                <h2 className="font-display text-xl font-bold text-foreground">
                  {verifyEmailRes}
                </h2>
              )}
              {!loading && !verifyEmailRes && (
                <h2 className="font-display text-xl font-bold text-foreground">
                  Please verify your email
                </h2>
              )}
            </div>
          </CenterDiv>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
