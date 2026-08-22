import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="font-heading text-3xl text-white tracking-widest mb-6 block">
              GIFTORA
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-xs text-stone-400">
              Gifts That Make Moments Last. Thoughtful, premium gifts for every special occasion.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-heading tracking-widest uppercase text-sm mb-6">Shop</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/category/birthday-gifts" className="hover:text-white transition-colors">Birthday Gifts</Link></li>
              <li><Link href="/category/anniversary-gifts" className="hover:text-white transition-colors">Anniversary Gifts</Link></li>
              <li><Link href="/category/personalized-gifts" className="hover:text-white transition-colors">Personalized Gifts</Link></li>
              <li><Link href="/category/couple-gifts" className="hover:text-white transition-colors">Couple Gifts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading tracking-widest uppercase text-sm mb-6">Support</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-heading tracking-widest uppercase text-sm mb-6">Legal</h3>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs uppercase tracking-widest text-stone-500">
            &copy; {new Date().getFullYear()} GIFTORA. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs uppercase tracking-widest text-stone-500">
            <span>Secure Payments</span>
            <span className="hidden sm:inline">Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
