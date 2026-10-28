import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { STORE_CONFIG } from '@/lib/storeConfig';

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappDigits: string;
  millAddress: string;
  announcementText: string;
  freeShippingThreshold: string;
  getWhatsappUrl: (message?: string) => string;
}

export function useStoreSettings(): StoreSettings {
  const { data } = useQuery({
    queryKey: ['store-settings-public'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/store');
        return res.data?.settings || {};
      } catch {
        return {};
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const settings = data || {};

  const storePhone = settings.support_phone || STORE_CONFIG.phone;
  const whatsappDigits =
    settings.whatsapp_digits ||
    (settings.whatsapp_number || storePhone).replace(/\D/g, '') ||
    STORE_CONFIG.whatsapp;

  const getWhatsappUrl = (
    message = 'Hello Krishna Vedic, I have an inquiry about pure cold-pressed oils & spices.'
  ) => `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;

  return {
    storeName: settings.store_name || STORE_CONFIG.name,
    supportEmail: settings.support_email || STORE_CONFIG.email,
    supportPhone: storePhone,
    whatsappDigits,
    millAddress: settings.mill_address || STORE_CONFIG.address,
    announcementText:
      settings.announcement_text || 'अब खाएंगे दादी-दादी के ज़माने का तेल और मसाले',
    freeShippingThreshold: settings.free_shipping_threshold || '799',
    getWhatsappUrl,
  };
}

