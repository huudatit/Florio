"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { signOut } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // Dùng hàm totalItems() từ store
  const totalItems = useCartStore((state: { totalItems: () => number }) =>
    state.totalItems(),
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore – vẫn clear local state dù server lỗi
    } finally {
      clearAuth();
      router.push("/signin");
      toast.success("Đã đăng xuất");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/products" className="font-bold text-xl tracking-tight">
          🌸 Florio
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          {/* Admin link */}
          {user && isAdmin() && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

          {/* Giỏ hàng */}
          <Button variant="ghost" size="sm" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <Button size="sm" asChild>
              <Link href="/signin">Đăng nhập</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
