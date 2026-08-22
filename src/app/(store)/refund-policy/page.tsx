export const metadata = {
  title: "Refund Policy | GIFTORA",
};

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
      <div className="prose prose-lg">
        <p>We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a straightforward return and refund policy.</p>
        <h2>Returns</h2>
        <p>Our return policy lasts 7 days from the date of delivery. If 7 days have gone by since your delivery, unfortunately, we can’t offer you a refund or exchange.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
        <h2>Refunds</h2>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment, within 5-7 working days.</p>
      </div>
    </div>
  );
}
