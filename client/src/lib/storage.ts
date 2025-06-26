// Local storage utilities for user preferences
export interface WeddingDetails {
  bride: string;
  groom: string;
  weddingDate: string;
}

const STORAGE_KEY = 'blissful-planner-wedding-details';

export function saveWeddingDetails(details: WeddingDetails): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
}

export function getWeddingDetails(): WeddingDetails | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearWeddingDetails(): void {
  localStorage.removeItem(STORAGE_KEY);
}