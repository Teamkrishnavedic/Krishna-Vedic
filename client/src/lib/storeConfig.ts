export const STORE_CONFIG = {
  name: import.meta.env.VITE_STORE_NAME || 'Krishna Vedic',
  email: import.meta.env.VITE_STORE_EMAIL || 'krishnavedic001@gmail.com',
  ordersEmail: import.meta.env.VITE_STORE_ORDERS_EMAIL || 'krishnavedic001@gmail.com',
  phone: import.meta.env.VITE_STORE_PHONE || '+91 7976123348',
  phoneAlt: import.meta.env.VITE_STORE_PHONE_ALT || '',
  whatsapp: '917976123348',
  address: import.meta.env.VITE_STORE_ADDRESS || 'Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan - 302022, India',
  hours: import.meta.env.VITE_STORE_HOURS || 'Monday to Saturday: 9:00 AM to 7:00 PM IST',
  fssaiLicense: import.meta.env.VITE_STORE_FSSAI || '11521018000342',
  getWhatsappUrl: (message = 'Hello Krishna Vedic, I have an inquiry about pure cold-pressed oils & spices.') =>
    `https://wa.me/917976123348?text=${encodeURIComponent(message)}`,
};
