export const metadata = {
  title: "About Us | GIFTORA",
  description: "Learn more about GIFTORA, a premium Indian gift brand.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About GIFTORA</h1>
      <div className="prose prose-lg">
        <p>
          Welcome to GIFTORA! We are a premium Indian gifting brand dedicated to making every moment special.
        </p>
        <p>
          Founded on the belief that a well-chosen gift has the power to bring people closer together, we offer a carefully curated selection of premium but affordable gifts for birthdays, anniversaries, couples, friends, and festivals.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide you with a seamless and delightful gifting experience. From personalized keepsakes to surprise boxes, we want to help you express your feelings perfectly.
        </p>
        <p>
          Thank you for choosing GIFTORA. Gifts That Make Moments Last.
        </p>
      </div>
    </div>
  );
}
