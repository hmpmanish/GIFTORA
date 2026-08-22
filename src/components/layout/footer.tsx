import Link from "next/link";
import { Package, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-8 h-8 text-accent" />
              <Link href="/" className="font-bold text-3xl text-white tracking-tight">
                GIFTORA
              </Link>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400 mb-8">
              India's premier corporate and personal gifting platform. We deliver excellence, security, and premium quality with every package.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Systems Operational</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h3 className="text-white font-semibold text-sm mb-6">Solutions</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/category/corporate" className="hover:text-accent transition-colors">Corporate Gifting</Link></li>
              <li><Link href="/category/personal" className="hover:text-accent transition-colors">Personal Gifting</Link></li>
              <li><Link href="/category/custom" className="hover:text-accent transition-colors">Custom Projects</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Full Catalog</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/track-order" className="hover:text-accent transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-accent transition-colors">Shipping Information</Link></li>
              <li><Link href="/refund-policy" className="hover:text-accent transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Giftora Solutions Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> 256-bit Encryption</span>
            <span className="hidden sm:inline">Certified Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
