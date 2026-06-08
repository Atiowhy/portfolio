import Link from "next/link";
import { Terminal, Mail, Phone, MapPin, Building } from "lucide-react";
import { redirect } from "next/navigation";

export default function ContactPage() {

  async function handleContact(formData: FormData) {
    "use server";
    const name = formData.get("fullName") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const service = formData.get("service") as string;
    const details = formData.get("details") as string;

    // Construct WhatsApp message
    const message = `Halo TechOps, saya ${name} dari ${company}.
Email: ${email}
Layanan yang dibutuhkan: ${service}

Detail:
${details}`;

    const encodedMessage = encodeURIComponent(message);
    // Redirect to wa.me
    redirect(`https://wa.me/6281234567890?text=${encodedMessage}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans flex flex-col">
      {/* Navbar Minimalist */}
      <header className="w-full bg-white dark:bg-gray-950 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">TechOps<span className="text-blue-600">.</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Portofolio</Link>
            <Link href="#services" className="hover:text-gray-900 dark:hover:text-white transition-colors">Services</Link>
            <Link href="/contact" className="text-blue-600 dark:text-blue-400">Contact</Link>
          </nav>
          <Link 
            href="/login" 
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column - Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
                Let's build the future of your <br className="hidden md:block"/> infrastructure.
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl text-lg">
                Connect with our team of elite software architects and systems engineers. Tell us about your technical challenges, and we'll deliver a tailored solution.
              </p>

              <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">Service Inquiry</h2>
                
                <form action={handleContact} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input type="text" id="fullName" name="fullName" required placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                      <input type="text" id="company" name="company" placeholder="Acme Corp" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Email</label>
                      <input type="email" id="email" name="email" required placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Needed</label>
                      <select id="service" name="service" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white appearance-none">
                        <option value="">Select a service...</option>
                        <option value="Custom Software Development">Custom Software Development</option>
                        <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="IT Consulting">IT Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Project details</label>
                    <textarea id="details" name="details" rows={4} required placeholder="Tell us about your technical challenges and goals..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white resize-none"></textarea>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                    Send Message via WhatsApp
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Hello there!</h3>
                    <a href="mailto:hello@techops.id" className="text-blue-600 hover:underline">hello@techops.id</a>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Give us a call</h3>
                    <p className="text-gray-600 dark:text-gray-400">+62 812 3456 7890</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">San Francisco, CA</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">100 Innovation Way, Suite 300<br/>San Francisco Tech District.</p>
                    </div>
                  </div>
                </div>
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 relative">
                  {/* Mock map/building image */}
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Office Building" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gray-900/10"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-3">Stay updated with TechOps insights</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">Get exclusive content, early access to new case studies, and insights from our engineering team.</p>
          
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 mb-16">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-sm transition-colors">
              Subscribe
            </button>
          </form>
          
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-gray-800/50 text-xs text-gray-500">
            <p>&copy; 2026 TechOps Solution. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
              <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
              <Link href="/dashboard" className="hover:text-gray-300">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
