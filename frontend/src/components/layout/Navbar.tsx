import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiGrid, FiHome, FiSearch, FiPackage, FiSettings, FiList, FiLayers } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const PUBLIC_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#about", label: "About" },
  { to: "/#services", label: "Services" },
  { to: "/ai-search", label: "AI Search" },
  { to: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [roleModal, setRoleModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const onProfileClick = () => {
    if (!isAuthenticated) setRoleModal(true);
    else navigate({ to: "/profile" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground text-lg font-bold shadow-elegant">
            S
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Saffron<span className="text-primary">.ai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {PUBLIC_LINKS.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                pathname === l.to && "text-foreground",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isCustomer && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart"><FiShoppingCart className="h-5 w-5" /></Link>
            </Button>
          )}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FiUser className="h-4 w-4" />
                  {user?.name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold">{user?.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">
                    Signed in as {user?.role}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <>
                    <DropdownItem to="/dashboard" icon={<FiGrid />} label="Dashboard" />
                    <DropdownItem to="/admin/menu" icon={<FiList />} label="Menu Management" />
                    <DropdownItem to="/admin/categories" icon={<FiLayers />} label="Categories" />
                    <DropdownItem to="/admin/orders" icon={<FiPackage />} label="Orders" />
                    <DropdownItem to="/profile" icon={<FiSettings />} label="Profile" />
                  </>
                ) : (
                  <>
                    <DropdownItem to="/profile" icon={<FiUser />} label="Profile" />
                    <DropdownItem to="/home" icon={<FiHome />} label="Home" />
                    <DropdownItem to="/cart" icon={<FiShoppingCart />} label="Cart" />
                    <DropdownItem to="/orders" icon={<FiPackage />} label="Orders" />
                    <DropdownItem to="/ai-search" icon={<FiSearch />} label="AI Search" />
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <FiLogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onProfileClick} className="gap-2">
              <FiUser className="h-4 w-4" /> Profile
            </Button>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 md:hidden">
          <div className="space-y-1 px-4 py-4">
            {PUBLIC_LINKS.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline"><Link to={isAdmin ? "/dashboard" : "/home"}>{isAdmin ? "Dashboard" : "Home"}</Link></Button>
                  <Button onClick={handleLogout} variant="ghost">
                    <FiLogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => { setOpen(false); setRoleModal(true); }}>
                  <FiUser className="mr-2 h-4 w-4" /> Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <RoleModal open={roleModal} onOpenChange={setRoleModal} />
    </header>
  );
}

function DropdownItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <DropdownMenuItem asChild>
      <Link to={to} className="cursor-pointer">
        <span className="mr-2 inline-flex h-4 w-4 items-center">{icon}</span>
        {label}
      </Link>
    </DropdownMenuItem>
  );
}

function RoleModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const go = (path: string) => { onOpenChange(false); navigate({ to: path }); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Choose your role</DialogTitle>
          <DialogDescription>
            Sign in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-5 shadow-card-soft">
            <div className="mb-1 text-sm font-semibold text-primary">Customer</div>
            <p className="text-xs text-muted-foreground">Browse menu & order food</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button onClick={() => go("/login")}>Login</Button>
              <Button variant="outline" onClick={() => go("/register")}>Register</Button>
            </div>
          </div>
          <div className="rounded-xl border border-border p-5 shadow-card-soft">
            <div className="mb-1 text-sm font-semibold text-accent">Admin</div>
            <p className="text-xs text-muted-foreground">Manage restaurant & orders</p>
            <div className="mt-4">
              <Button className="w-full" onClick={() => go("/login?role=admin")}>Login</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}