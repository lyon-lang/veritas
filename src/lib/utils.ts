import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTrustColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getTrustBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  if (score >= 40) return 'bg-orange-100';
  return 'bg-red-100';
}

export function getTrustLabel(score: number): string {
  if (score >= 80) return 'Trusted';
  if (score >= 60) return 'Caution';
  if (score >= 40) return 'Suspicious';
  return 'Untrusted';
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'authentic': return 'text-green-600';
    case 'suspicious': return 'text-yellow-600';
    case 'fake': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getVerdictBgColor(verdict: string): string {
  switch (verdict) {
    case 'authentic': return 'bg-green-100';
    case 'suspicious': return 'bg-yellow-100';
    case 'fake': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}
