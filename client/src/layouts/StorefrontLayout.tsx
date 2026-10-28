import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';

export default function StorefrontLayout() {
  const { isOpen, closeCart } = useCart();
  const location = useLocation();
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    api.get('/settings/store').then(({ data }) => {
      if (data.settings?.announcement_active === 'true' && data.settings?.announcement_text) {
        setAnnouncement(data.settings.announcement_text);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Announcement Bar */}
      {announcement && (
        <div className="announcement-bar">
          <p>{announcement}</p>
        </div>
      )}

      <Header />

      <main className="flex-1 pb-20 xl:pb-0 pt-[84px] sm:pt-[92px] md:pt-[108px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Dedicated Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && <CartDrawer onClose={closeCart} />}
      </AnimatePresence>
    </div>
  );
}
