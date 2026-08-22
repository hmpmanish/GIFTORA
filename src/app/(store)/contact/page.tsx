import { Mail, Clock, MessageSquare, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Contact Us | GIFTORA",
  description: "Get in touch with Giftora for corporate inquiries, personal gifting, or any questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-primary text-white py-24 mb-16">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent rounded-full blur-[100px] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <Badge className="mb-6 bg-white/10 text-blue-100 hover:bg-white/20 border-white/20 px-4 py-1">
            Dedicated Support
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight drop-shadow-md">
            How can we help you?
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
            Whether you have a question about our premium collections, need help with a corporate order, or just want to say hello, our team is ready to assist.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Our support team typically responds within 2-4 business hours.
              </p>
              <a href="mailto:hmpmanish.dev@gmail.com" className="text-accent font-semibold hover:text-primary transition-colors text-lg flex items-center">
                hmpmanish.dev@gmail.com <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Business Hours</h3>
              <p className="text-slate-500 mb-2 text-sm">
                Monday to Saturday
              </p>
              <p className="text-slate-900 font-medium">
                9:00 AM – 6:00 PM IST
              </p>
            </div>
            
            <div className="bg-primary p-8 rounded-2xl shadow-sm text-white relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full blur-[40px] opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <MessageSquare className="w-8 h-8 text-blue-300 mb-4" />
                <h3 className="text-xl font-bold mb-2">Enterprise Solutions</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Looking for bulk corporate gifting or custom bespoke curation? Let our enterprise team handle it.
                </p>
                <Button className="w-full bg-white text-primary hover:bg-slate-100">
                  Request Catalog
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@company.com" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-slate-50 focus:bg-white text-slate-700 appearance-none">
                    <option>General Inquiry</option>
                    <option>Corporate Gifting</option>
                    <option>Order Support</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea 
                    rows={6}
                    placeholder="How can we help you?" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <Button className="w-full md:w-auto h-12 px-8 bg-accent hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-accent/20 transition-all font-semibold text-base flex items-center justify-center">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
