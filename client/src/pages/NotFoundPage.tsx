import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-gutter-mobile py-24 text-center space-y-4">
      <p className="font-serif text-8xl font-bold text-primary">404</p>
      <h1 className="font-headline-lg text-headline-lg font-serif text-on-surface">Page Not Found</h1>
      <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed">
        The harvest page or item you are looking for may have concluded its seasonal cycle or moved. Return to our pantry catalogue below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="bg-primary hover:bg-secondary text-on-primary px-6 py-3 font-label-md text-label-md uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">home</span> Homepage
        </Link>
        <Link
          to="/shop"
          className="bg-surface text-on-surface border border-outline-variant/40 px-6 py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">shopping_bag</span> Browse Catalogue
        </Link>
        <Link
          to="/search"
          className="bg-surface text-on-surface border border-outline-variant/40 px-6 py-3 font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">search</span> Search Store
        </Link>
      </div>
    </div>
  );
}
