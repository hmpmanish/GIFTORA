export const metadata = {
  title: "Shipping Policy | GIFTORA",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="prose prose-lg">
        <p>All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
        <h2>Domestic Shipping Rates and Estimates</h2>
        <p>We offer a flat shipping rate of ₹50 across India on all orders. Free shipping is available for promotional periods.</p>
        <h2>How do I check the status of my order?</h2>
        <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
      </div>
    </div>
  );
}
