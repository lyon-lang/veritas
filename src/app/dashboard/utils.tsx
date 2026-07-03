import { ShieldCheck, ShieldAlert, ShieldX, Shield, Image as ImageIcon, Video, FileText, Link as LinkIcon, Globe } from 'lucide-react';

export const getVerdictIcon = (verdict: string) => {
  switch (verdict) {
    case 'authentic': return <ShieldCheck className="h-4 w-4 text-green-600" />;
    case 'suspicious': return <ShieldAlert className="h-4 w-4 text-yellow-600" />;
    case 'fake': return <ShieldX className="h-4 w-4 text-red-600" />;
    default: return <Shield className="h-4 w-4 text-gray-600" />;
  }
};

export const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'image': return <ImageIcon className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    case 'text': return <FileText className="h-4 w-4" />;
    case 'url': return <LinkIcon className="h-4 w-4" />;
    default: return <Globe className="h-4 w-4" />;
  }
};

export const getTrustScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export const getTrustScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-50';
  if (score >= 60) return 'bg-yellow-50';
  if (score >= 40) return 'bg-orange-50';
  return 'bg-red-50';
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
