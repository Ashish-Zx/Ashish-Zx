'use client';

import { ArrowUpRight, Menu, Moon, Sun, Terminal, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GitHub } from './brand-icons';

const links = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Blog', '/blog'],
  ['About', '/about'],
];
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Ashish Shah home">
      <span className="brand-mark">
        <Terminal size={19} strokeWidth={2.35} />
      </span>
      <span>
        ashish<span className="brand-suffix">.dev</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  function toggleTheme() {
    const next =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('portfolio-theme', next);
    } catch {
      /* The toggle still works without storage. */
    }
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav
          id="site-nav"
          className={menu ? 'site-nav menu-open' : 'site-nav'}
          aria-label="Main navigation"
        >
          {links.map(([text, href]) => {
            const active =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href + '/'));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuPath(null)}
              >
                {text}
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <a
            className="header-github"
            aria-label="GitHub profile (opens in a new tab)"
            href="https://github.com/Ashish-Zx"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub width={17} height={17} /> <span>GitHub</span>
            <ArrowUpRight className="github-arrow" size={13} />
          </a>
          <span className="header-divider" />
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle color theme"
          >
            <Moon className="moon" size={18} />
            <Sun className="sun" size={18} />
          </button>
          <button
            className="icon-button menu-toggle"
            aria-expanded={menu}
            aria-controls="site-nav"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuPath(menu ? null : pathname)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
