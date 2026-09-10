export const metadata = {
  title: "Help Center & FAQ | GIFTORA",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Help Center & FAQ</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">How long does shipping take?</h2>
          <p className="text-muted-foreground">Standard shipping usually takes 3-5 business days across India. Express shipping options are available at checkout.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Can I return a custom gift?</h2>
          <p className="text-muted-foreground">Unfortunately, personalized and custom-made gifts cannot be returned unless they arrive damaged or defective.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Do you offer corporate discounts?</h2>
          <p className="text-muted-foreground">Yes! We offer tiered discounts for bulk corporate orders. Please contact our corporate sales team for a custom quote.</p>
        </div>
      </div>
    </div>
  );
}
