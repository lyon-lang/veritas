'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Navbar } from '@/components/navbar';

export default function StatusPage() {
  const services = [
    { name: 'API v1', uptime: '99.99%', icon: Activity },
    { name: 'Dashboard', uptime: '99.99%', icon: Activity },
    { name: 'Verification Engine', uptime: '99.95%', icon: Activity },
  ];

  const incidents = [
    { title: 'API Latency Spike', status: 'resolved', date: 'Jul 1, 2026', duration: '15m', description: 'We experienced a brief latency spike in our API due to unexpected high volume. Normal service has been restored.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
        <p className="text-lg text-gray-600 mb-8">Current status of all CoreValidate services.</p>

        {/* Overall Status */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-xl font-semibold text-green-900">All Systems Operational</h2>
              <p className="text-green-700">All services are running normally.</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4 mb-12">
          {services.map((service, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <service.icon className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Uptime: {service.uptime}</span>
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  <CheckCircle className="h-3 w-3" />
                  Operational
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Uptime */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Uptime</h2>
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Last 90 days</span>
            <span className="text-sm font-medium text-green-600">99.98% uptime</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 90 }, (_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-sm ${
                  i === 85 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">90 days ago</span>
            <span className="text-xs text-gray-500">Today</span>
          </div>
        </div>

        {/* Recent Incidents */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((incident, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  incident.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {incident.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>{incident.date}</span>
                <span>Duration: {incident.duration}</span>
              </div>
              <p className="text-sm text-gray-600">{incident.description}</p>
            </div>
          ))}
        </div>

        {/* Subscribe */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Stay updated</h3>
          <p className="text-sm text-gray-600 mb-4">Get notified about incidents and maintenance.</p>
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700">Subscribe</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
