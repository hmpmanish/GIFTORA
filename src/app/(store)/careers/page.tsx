export const metadata = {
  title: "Careers | GIFTORA",
};

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-4">Careers at GIFTORA</h1>
      <p className="text-muted-foreground mb-8">Join us in revolutionizing the gifting experience in India.</p>
      
      <div className="p-12 border rounded-xl bg-slate-50 text-center">
        <h3 className="text-xl font-semibold mb-2">No open positions currently</h3>
        <p className="text-muted-foreground">We are not actively hiring at the moment, but we are always looking for passionate people. Feel free to send your resume to careers@giftora.com and we'll keep it on file.</p>
      </div>
    </div>
  );
}
