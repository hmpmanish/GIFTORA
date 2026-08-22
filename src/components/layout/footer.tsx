import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <Package className="h-6 w-6" />
              GIFTORA
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Gifts That Make Moments Last. Thoughtful, premium gifts for every special occasion.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/birthday-gifts" className="hover:text-primary transition-colors">Birthday Gifts</Link></li>
              <li><Link href="/category/anniversary-gifts" className="hover:text-primary transition-colors">Anniversary Gifts</Link></li>
              <li><Link href="/category/personalized-gifts" className="hover:text-primary transition-colors">Personalized Gifts</Link></li>
              <li><Link href="/category/couple-gifts" className="hover:text-primary transition-colors">Couple Gifts</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GIFTORA. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground font-medium">
            <span>✓ Secure Payments</span>
            <span className="hidden sm:inline">✓ Easy Returns</span>
            <span className="hidden sm:inline">✓ Quality Checked</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
