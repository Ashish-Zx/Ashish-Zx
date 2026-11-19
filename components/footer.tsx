import Link from 'next/link';
import { ArrowUpRight, Mail, Settings2 } from 'lucide-react';
import { GitHub, LinkedIn } from './brand-icons';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Link className="footer-brand" href="/">
            ashish<span>.dev</span>
          </Link>
          <p>Built in Nepal, with care.</p>
        </div>
        <div className="footer-socials">
          <a
            href="https://github.com/Ashish-Zx"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GitHub />
          </a>
          <a
            href="https://www.linkedin.com/in/ashishzx"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </a>
          <a href="mailto:ashish2062official@gmail.com" aria-label="Email">
            <Mail size={18} />
          </a>
        </div>
        <Link className="studio-link" href="/studio">
          <Settings2 size={15} /> Studio <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
