import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-gray-100 mt-auto bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="CoreValidate Logo" className="h-9 w-auto object-contain" />
              <span className="hidden sm:block text-lg font-semibold text-gray-900 tracking-tight">CoreValidate</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">The trust layer for the internet.</p>
          </div>
          {[
            { title: 'Product', links: [
              { name: 'Features', href: '/#features' },
              { name: 'Pricing', href: '/#pricing' },
              { name: 'API', href: '/docs' },
              { name: 'Extension', href: '#' },
            ]},
            { title: 'Company', links: [
              { name: 'About', href: '/about' },
              { name: 'Blog', href: '/blog' },
              { name: 'Careers', href: '/careers' },
            ]},
            { title: 'Support', links: [
              { name: 'Help Center', href: '/help' },
              { name: 'Contact', href: '/contact' },
              { name: 'Status', href: '/status' },
            ]},
            { title: 'Legal', links: [
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Terms of Service', href: '/terms' },
              { name: 'Cookie Policy', href: '/cookies' },
            ]},
          ].map((section, i) => (
            <div key={i}>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">© 2025 CoreValidate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
