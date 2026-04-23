import React from 'react';
import {
  Users,
  Store,
  Target,
  Heart,
  Shield,
  Zap,
  Globe,
  Mail,
  Clock,
  CheckCircle,
  Handshake,
  Sparkles,
  TrendingUp,
  Lock,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ValueCard = ({ icon, title, description }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 hover:-translate-y-1">
    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="relative flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
        {number}
      </div>
      <div className="w-0.5 flex-1 bg-green-200 dark:bg-green-800 my-2"></div>
    </div>
    <div className="pb-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
    <div className="text-green-600 dark:text-green-400">
      {icon}
    </div>
    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{text}</span>
  </div>
);

export default function AboutUs() {
  const values = [
    {
      icon: <Shield size={24} />,
      title: "Trust",
      description: "Honest dealings between Buyers and Vendors. We verify all transactions to ensure peace of mind."
    },
    {
      icon: <Zap size={24} />,
      title: "Simplicity",
      description: "Easy to use platform with no complicated processes. Start trading in minutes."
    },
    {
      icon: <Users size={24} />,
      title: "Community",
      description: "Supporting local buyers and sellers in Student Communities. Building connections that matter."
    },
    {
      icon: <Globe size={24} />,
      title: "Transparency",
      description: "Clear rules and fair treatment for all. No hidden fees or surprises."
    }
  ];

  const steps = [
    { number: "1", title: "Connect Directly", description: "Buyers and Vendors connect directly on our platform with verified profiles." },
    { number: "2", title: "Agree on Terms", description: "Discuss and agree on price, delivery, and other details through our secure chat." },
    { number: "3", title: "Secure Payment", description: "Payments made directly between buyer and seller with our verification system." },
    { number: "4", title: "Complete Deal", description: "Receive your items and leave feedback to help build trust in the community." }
  ];

  const features = [
    { icon: <MapPin size={18} />, text: "Built for Student Communities" },
    { icon: <Sparkles size={18} />, text: "Independent Platform" },
    { icon: <Handshake size={18} />, text: "Fair Rules for All" },
    { icon: <Zap size={18} />, text: "Quick Support" },
    { icon: <CheckCircle size={18} />, text: "Simple & Easy to Use" },
    { icon: <Lock size={18} />, text: "Your Data is Safe" }
  ];

  const stats = [
    { value: "1000+", label: "Active Users" },
    { value: "500+", label: "Verified Vendors" },
    { value: "24h", label: "Support Response" },
    { value: "100%", label: "Community Focused" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 dark:from-green-950 dark:via-green-900 dark:to-green-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Welcome to CampusTrade</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empowering <span className="text-yellow-300">Local Commerce</span> in Student Community
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
              An independent e-commerce platform connecting buyers and vendors with trust,
              transparency, and community at its heart.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={'/products'}>
              <button className="bg-white text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-300 shadow-lg">
                Start Shopping
              </button>
              </Link>
              <Link to={'/register'}>
                <button className="bg-green-700/50 backdrop-blur-sm text-white border border-green-500/30 px-8 py-3 rounded-full font-semibold hover:bg-green-700/70 transition-colors duration-300">
                  Become a Vendor
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center border border-gray-100 dark:border-gray-700">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
              <Users size={20} />
              <span>Who We Are</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              An Independent Platform Built for Student Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              CampusTrade is an independent e-commerce platform.
              We are built and run independently to serve student communities across Nigeria.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Our mission is to make buying and selling easy, safe, and simple for everyone.
              We believe in community commerce where trust matters and honest deals happen.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <Store size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">CampusTrade Marketplace</h3>
                <p className="text-gray-600 dark:text-gray-400">Your trusted local trading platform</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Heart size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Made with Love</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">For Student Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-gray-800 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
              <Heart size={20} />
              <span>Our Values</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Believe In
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our core values guide everything we do, from building features to supporting our community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
              <TrendingUp size={20} />
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Secure, and Transparent
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              CampusTrade is different from other platforms. We&apos;ve created a straightforward process
              that puts trust and safety first.
            </p>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <StepCard key={index} {...step} />
              ))}
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why CampusTrade Stands Out</h3>
              <div className="space-y-3">
                <FeatureItem icon={<CheckCircle size={18} />} text="No payment gateway fees - direct transactions" />
                <FeatureItem icon={<Shield size={18} />} text="Verified payments to prevent fraud" />
                <FeatureItem icon={<Users size={18} />} text="Direct connection between buyers and sellers" />
                <FeatureItem icon={<Lock size={18} />} text="Clear rules and fair treatment for all" />
                <FeatureItem icon={<Zap size={18} />} text="Quick support when you need help" />
              </div>
              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-300 font-medium text-center">
                  &ldquo;We believe in empowering local commerce through trust and transparency.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-green-900 dark:bg-green-950 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-green-300 font-semibold mb-4">
              <Sparkles size={20} />
              <span>Why Choose CampusTrade</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Better Way to Trade Locally
            </h2>
            <p className="text-green-100">
              Experience the difference of a platform built specifically for campus communities.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-colors duration-300">
                <div className="text-green-300">{feature.icon}</div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-3xl p-8 lg:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
              <Target size={20} />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Supporting Young People & Local Commerce
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
              We are here to support young people and local buyers who want to buy and sell quality items.
              We believe in community commerce - where trust matters and honest deals happen.
              Our platform is designed to empower the next generation of entrepreneurs in Ilesa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm">
                <Users size={20} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Student First</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm">
                <TrendingUp size={20} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Youth Empowerment</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm">
                <Heart size={20} className="text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Local Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white dark:bg-gray-800 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
                <Mail size={20} />
                <span>Contact Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                Have questions about CampusTrade? We&apos;re here to help you with anything you need.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">For general inquiries and support</p>
                    <a href="mailto:olujidewealth3@gmail.com" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                      olujidewealth3@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Support Hours</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">We&apos;re available to help you</p>
                    <p className="text-gray-900 dark:text-white font-semibold">7:00 AM - 8:00 PM Daily</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Response Time</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Fast and reliable support</p>
                    <p className="text-gray-900 dark:text-white font-semibold">Within 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Commitment</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We are committed to keeping CampusTrade safe, fair, and useful for everyone. We listen to your feedback
                and keep improving our platform to serve you better.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
                <p className="text-green-800 dark:text-green-300 font-medium text-center italic">
                  &ldquo;Thank you for being part of the CampusTrade community. Together, we&apos;re building a better
                  marketplace for Ilesa.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg">
                  Join Our Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Store size={24} className="text-green-400" />
            <span className="text-xl font-bold">CampusTrade</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} GMC Marketplace. Built with love for the Ilesa community.
          </p>
        </div>
      </footer>
    </div>
  );
}