// components/shared/navData.ts
export interface NavLeaf {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavLeaf[];
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export const topNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Browse Gear', href: '/gear' },
  {
    label: 'Discover',
    children: [
      {
        label: 'Outdoor',
        children: [
          { label: 'Camping', href: '/gear?category=Camping' },
          { label: 'Hiking', href: '/gear?category=Hiking' },
          { label: 'Backpacking', href: '/gear?category=Backpacking' },
        ],
      },
      {
        label: 'Water',
        children: [
          { label: 'Kayaks', href: '/gear?category=Kayaks' },
          { label: 'Paddleboards', href: '/gear?category=Paddleboards' },
          { label: 'Fishing', href: '/gear?category=Fishing' },
        ],
      },
      {
        label: 'Winter',
        children: [
          { label: 'Snowboards', href: '/gear?category=Snowboards' },
          { label: 'Skis', href: '/gear?category=Skis' },
          { label: 'Winter Gear', href: '/gear?category=Winter' },
        ],
      },
      {
        label: 'Bikes & Mobility',
        children: [
          { label: 'Mountain Bikes', href: '/gear?category=Mountain%20Bikes' },
          { label: 'Road Bikes', href: '/gear?category=Road%20Bikes' },
          { label: 'E-Bikes', href: '/gear?category=E-Bikes' },
        ],
      },
      {
        label: 'Photography & Film',
        children: [
          { label: 'Cameras', href: '/gear?category=Cameras' },
          { label: 'Lenses', href: '/gear?category=Lenses' },
          { label: 'Accessories', href: '/gear?category=Photo%20Accessories' },
        ],
      },
      {
        label: 'Tools & Safety',
        children: [
          { label: 'Power Tools', href: '/gear?category=Power%20Tools' },
          { label: 'Safety', href: '/gear?category=Safety' },
          { label: 'Repair', href: '/gear?category=Repair' },
        ],
      },
    ],
  },
  {
    label: 'Explore',
    children: [
      {
        label: 'Activities',
        children: [
          { label: 'Camping Trips', href: '/gear?category=Camping' },
          { label: 'Water Adventures', href: '/gear?category=Kayaks' },
          { label: 'Winter Sports', href: '/gear?category=Snowboards' },
        ],
      },
      {
        label: 'Collections',
        children: [
          { label: 'Top Rated', href: '/gear?sort=rating' },
          { label: 'New Arrivals', href: '/gear?sort=latest' },
          { label: 'Budget Picks', href: '/gear?sort=price_asc' },
        ],
      },
      {
        label: 'Seasonal',
        children: [
          { label: 'Summer Essentials', href: '/gear?category=Camping' },
          { label: 'Winter Gear', href: '/gear?category=Winter' },
          { label: 'Rainy Day', href: '/gear?category=Safety' },
        ],
      },
    ],
  },
  { label: 'Rent Out', href: '/rent-out' },
  {
    label: 'Resources',
    children: [
      { label: 'Getting Started', href: '/resources/getting-started' },
      { label: 'FAQs', href: '/resources/faqs' },
      { label: 'About Us', href: '/resources/about' },
      { label: 'Safety & Trust', href: '/resources/safety' },
    ],
  },
];
