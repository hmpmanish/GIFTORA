export const metadata = {
  title: "Contact Us | GIFTORA",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="prose prose-lg">
        <p>If you have any questions, concerns, or feedback, we would love to hear from you.</p>
        <ul>
          <li><strong>Email:</strong> support@giftora.in</li>
          <li><strong>Phone:</strong> +91-9876543210</li>
          <li><strong>Address:</strong> GIFTORA HQ, Bangalore, India</li>
        </ul>
        <p>Our support team is available Monday to Saturday, 9 AM to 6 PM IST.</p>
      </div>
    </div>
  );
}
