export type CompetitionCategory = 'National' | 'Education' | 'Other';

export interface Achievement {
  id: string;
  title: string;
  rank: string;
  category: CompetitionCategory;
}

export interface YearRecord {
  id: string;
  academicYear: string; // e.g., "114"
  coaches: string;
  description: string;
  achievements: Achievement[];
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  title: string;
  description?: string;
  time?: string;
  location?: string;
  type: 'practice' | 'competition' | 'event';
}

export const PASSWORD = "50715071";