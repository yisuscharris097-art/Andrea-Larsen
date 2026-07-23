// Datos reales de Andrea (de /data/agent.json del proyecto). NO inventados.
export const agent = {
  name: 'Andrea Larsen',
  brand: 'Love Living Coast2Coast',
  tagline: 'Helping You Love Where You Live',
  titles: ['REALTOR®', 'Luxury Property Specialist', "Buyer's Agent", 'Listing Agent'],
  licensedStates: ['Arizona', 'Florida', 'New Jersey'],
  experience: '27+ Years',
  rank: 'Top 1% in State',
  brokerage: 'Berkshire Hathaway HomeServices Fox & Roach',
  bio: 'As a luxury realtor with a career spanning over 27 years in sales, marketing, and real estate, I have honed my skills to create unparalleled real estate experiences for clients — from savvy investors to those seeking their dream homes. I excel in selling homes thanks to meticulous attention to detail, clear communication, and strong negotiation. Coming from a family of top-producing agents and investors, I inherited a deep understanding of the market. Family and faith are my top priorities, and I am among the top one percent in my state.',

  // Foto oficial de la sesión profesional (070A3718r) — jul 2026.
  photo: '/andrea-perfil.jpg',
  // Crop cuadrado de la cara para avatares circulares pequeños.
  avatar: '/andrea-avatar.jpg',
  photoIsPlaceholder: false,

  office: {
    name: 'Berkshire Hathaway HomeServices Fox & Roach, REALTORS®',
    address: '730 West Avenue, Ocean City, NJ 08226',
    phone: '(609) 957-6787',
  },
  market: 'Ocean City & the Jersey Shore',
  compliance: 'Equal Housing Opportunity. Licensed in New Jersey, Florida and Arizona.',
  contact: {
    phone: '856-448-2229',
    sms: '856-448-2229',
    email: 'andrea@lovelivingcoast2coast.com',
    calendly: 'https://calendly.com/andrealarsen',
    vcard: 'https://card.get-card.com/wp-content/uploads/2025/11/Andrea-Larsen.vcf',
  },
  social: {
    Instagram: 'https://www.instagram.com/lovelivingcoast2coast/',
    Facebook: 'https://www.facebook.com/lovelivingcoast2coast',
    LinkedIn: 'https://www.linkedin.com/in/lovelivingcoast2coast/',
    YouTube: 'https://www.youtube.com/@lovelivingcoast2coast',
    Linktree: 'https://linktr.ee/lovelivingcoast2coast',
  },
} as const;
