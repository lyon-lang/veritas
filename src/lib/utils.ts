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
    case 'likely authentic': return 'text-green-600';
    case 'suspicious': return 'text-yellow-600';
    case 'fake': return 'text-red-600';
    case 'untrusted': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getVerdictBgColor(verdict: string): string {
  switch (verdict) {
    case 'authentic': return 'bg-green-100';
    case 'likely authentic': return 'bg-green-100';
    case 'suspicious': return 'bg-yellow-100';
    case 'fake': return 'bg-red-100';
    case 'untrusted': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

export function getVerdictBorderColor(verdict: string): string {
  switch (verdict) {
    case 'authentic': return 'border-green-200';
    case 'likely authentic': return 'border-green-200';
    case 'suspicious': return 'border-yellow-200';
    case 'fake': return 'border-red-200';
    case 'untrusted': return 'border-red-200';
    default: return 'border-gray-200';
  }
}

export function getVerdictBadgeClasses(verdict: string): string {
  switch (verdict) {
    case 'authentic': return 'bg-green-100 text-green-700 border border-green-200';
    case 'likely authentic': return 'bg-green-100 text-green-700 border border-green-200';
    case 'suspicious': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    case 'fake': return 'bg-red-100 text-red-700 border border-red-200';
    case 'untrusted': return 'bg-red-100 text-red-700 border border-red-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
}

export function getCheckStatusColor(status: string): string {
  switch (status) {
    case 'passed': return 'text-green-600';
    case 'warning': return 'text-yellow-600';
    case 'failed': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export function getCheckStatusBgColor(status: string): string {
  switch (status) {
    case 'passed': return 'bg-green-100';
    case 'warning': return 'bg-yellow-100';
    case 'failed': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

export type Verdict = 'authentic' | 'likely authentic' | 'suspicious' | 'fake' | 'untrusted';

export function calculateVerdict(trustScore: number): { verdict: Verdict; confidence: number } {
  if (trustScore >= 80) {
    return { verdict: 'authentic', confidence: 85 };
  } else if (trustScore >= 60) {
    return { verdict: 'likely authentic', confidence: 65 };
  } else if (trustScore >= 40) {
    return { verdict: 'suspicious', confidence: 55 };
  } else if (trustScore >= 20) {
    return { verdict: 'fake', confidence: 70 };
  } else {
    return { verdict: 'untrusted', confidence: 85 };
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

export function getContentTypeLabel(type: string): string {
  switch (type) {
    case 'url': return 'URL';
    case 'text': return 'Text';
    case 'image': return 'Image';
    case 'video': return 'Video';
    default: return type;
  }
}

export function getContentTypeColor(type: string): string {
  switch (type) {
    case 'url': return 'bg-blue-100 text-blue-700';
    case 'text': return 'bg-purple-100 text-purple-700';
    case 'image': return 'bg-pink-100 text-pink-700';
    case 'video': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
