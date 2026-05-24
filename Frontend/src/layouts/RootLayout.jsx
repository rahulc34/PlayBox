import { Link, Outlet } from "react-router-dom";
import { Menu, X, LogOut, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useToggle } from "../contexts/ToggleSidebar.jsx";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

function RootLayout() {
  const { user, isVerified, isAuthenticated, logout, sendVerifyLink, loading } =
    useAuth();
  const { isToggle, setIsToggle, isToggleBtnShow } = useToggle();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 lg:px-5">
          {isToggleBtnShow && (
            <button
              type="button"
              aria-label={isToggle ? "Close menu" : "Open menu"}
              onClick={() => setIsToggle(!isToggle)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
            >
              {isToggle ? <X size={22} /> : <Menu size={20} />}
            </button>
          )}

          <Link
            to="/"
            className="font-display shrink-0 text-xl font-extrabold tracking-tight text-primary lg:text-2xl"
          >
            Playbox
          </Link>

          <div className="mx-auto hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                placeholder="Search videos, channels..."
                aria-label="Search"
                className="w-full rounded-full border border-border bg-input py-2.5 pl-11 pr-4 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30"
              />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  to={`/user/${user.username}`}
                  title={user.username}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-semibold text-primary transition hover:scale-105"
                >
                  {user.username[0].toUpperCase()}
                </Link>
                {!isVerified && !loading && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendVerifyLink();
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent"
                    >
                      Verify email
                    </button>
                  </form>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 md:hidden">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              className="w-full rounded-full border border-border bg-input py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/30"
            />
          </div>
        </div>
      </header>
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
