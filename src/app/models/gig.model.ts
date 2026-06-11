export interface Gig {
  id: number;
  title: string;
  employer: string;
  category: GigCategory;
  emoji: string;
  duration: string;
  pay: string;
  payType: 'hourly' | 'fixed';
  location: string;
  area: string;
  slots: number;
  date: string;
  time: string;
  description: string;
  tags: string[];
  color: string;
  accentColor: string;
  bgPattern: string;
  isUrgent: boolean;
  postedAgo: string;
}

export type GigCategory =
  | 'cafe'
  | 'books'
  | 'events'
  | 'retail'
  | 'tuition'
  | 'delivery'
  | 'other';

export const CATEGORY_CONFIG: Record<GigCategory, { label: string; emoji: string; color: string }> = {
  cafe:     { label: 'Cafe',     emoji: '☕', color: '#FF9F43' },
  books:    { label: 'Books',    emoji: '📚', color: '#4D96FF' },
  events:   { label: 'Events',   emoji: '🎉', color: '#C77DFF' },
  retail:   { label: 'Retail',   emoji: '🛍️', color: '#FF78C4' },
  tuition:  { label: 'Tuition', emoji: '📖', color: '#6BCB77' },
  delivery: { label: 'Delivery', emoji: '🚴', color: '#FF6B6B' },
  other:    { label: 'Other',    emoji: '✨', color: '#FFD93D' },
};
