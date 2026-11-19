import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <div className="page-banner not-found">
      <div className="container">
        <p className="section-label">404 / NOT FOUND</p>
        <h1>
          Signal lost<span className="accent">.</span>
        </h1>
        <p>This page may have moved or been unpublished.</p>
        <Link href="/" className="button button-primary">
          <ArrowLeft size={17} /> Back to home
        </Link>
      </div>
    </div>
  );
}
