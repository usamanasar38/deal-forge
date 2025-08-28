"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ClusterButton,
  WalletButton,
} from "@/components/solana/solana-provider";
import { ThemeSelect } from "@/components/theme-select";
import { Button } from "@/components/ui/button";

export function AppHeader({
  links = [],
}: {
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  function isActive(path: string) {
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  }

  return (
    <header className="relative z-50 bg-neutral-100 px-4 py-2 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex items-baseline gap-4">
          <Link
            className="text-xl hover:text-neutral-500 dark:hover:text-white"
            href="/"
          >
            <span>Dealforge</span>
          </Link>
          <div className="hidden items-center md:flex">
            <ul className="flex flex-nowrap items-center gap-4">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={`hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? "text-neutral-500 dark:text-white" : ""}`}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          className="md:hidden"
          onClick={() => setShowMenu(!showMenu)}
          size="icon"
          variant="ghost"
        >
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden items-center gap-4 md:flex">
          <WalletButton size="sm" />
          <ClusterButton size="sm" />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 backdrop-blur-sm md:hidden dark:bg-neutral-900/95">
            <div className="flex flex-col gap-4 border-t p-4 dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`block py-2 text-lg hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? "text-neutral-500 dark:text-white" : ""} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletButton />
                <ClusterButton />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
