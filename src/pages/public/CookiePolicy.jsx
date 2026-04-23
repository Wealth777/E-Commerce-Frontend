import React from 'react';
import SectionCard from '../../components/cards/SectionCard';
import { 
  Cookie, 
  HelpCircle, 
  Settings, 
  EyeOff,
  Clock,
  CheckCircle2,
  Info,
  Mail,
  AlertTriangle
} from 'lucide-react';

const CookiePolicy = () => {
  const lastUpdated = "January 2026";

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for the website to function properly. Cannot be disabled.",
      examples: ["Session cookies", "Authentication tokens", "Security cookies"],
      required: true,
      icon: CheckCircle2
    },
    {
      name: "Preference Cookies",
      description: "Remember your settings and preferences for a better experience.",
      examples: ["Theme preference", "Language settings", "Login information"],
      required: false,
      icon: Settings
    },
    {
      name: "Cart Cookies",
      description: "Keep track of items in your shopping cart.",
      examples: ["Cart contents", "Saved items", "Recently viewed"],
      required: false,
      icon: Cookie
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Last Updated Badge */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            Last Updated: {lastUpdated}
          </span>
        </div>

        {/* What Are Cookies */}
        <SectionCard title="What Are Cookies?" icon={HelpCircle}>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to the website owners.
            </p>
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-300">Did You Know?</h4>
                  <p className="text-amber-700 dark:text-amber-400 mt-1">
                    Cookies cannot harm your computer and do not contain any personal or private information. 
                    They simply help us remember your preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Cookie Types */}
        <div className="mt-6 grid gap-6">
          <SectionCard title="Types of Cookies We Use" icon={Cookie}>
            <div className="space-y-4">
              {cookieTypes.map((type) => (
                <div 
                  key={type.name}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{type.name}</h3>
                        {type.required && (
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-3 ml-13">{type.description}</p>
                  <div className="flex flex-wrap gap-2 ml-13">
                    {type.examples.map((example) => (
                      <span 
                        key={example}
                        className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* How Long Cookies Last */}
        <div className="mt-6">
          <SectionCard title="Cookie Duration" icon={Clock}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Session Cookies
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Temporary cookies that are deleted when you close your browser. Used for essential 
                  website functions.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Persistent Cookies
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Remain on your device for a set period (30 days to 1 year) to remember your 
                  preferences and settings.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* No Tracking Section */}
        <div className="mt-6">
          <SectionCard title="Our Commitment to Privacy" icon={EyeOff}>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
                    We Don't Track You
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-400">
                    CampusTrade does not use cookies to track you across the internet. We don't use 
                    analytics cookies or advertising cookies. Your browsing activity on other websites 
                    is not our concern, and we don't share cookie data with third-party advertisers.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Managing Cookies */}
        <div className="mt-6">
          <SectionCard title="Managing Your Cookies" icon={Settings}>
            <p className="mb-6">
              You have the right to decide whether to accept or reject cookies. You can exercise 
              your cookie preferences in the following ways:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Browser Settings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Most web browsers allow you to control cookies through their settings preferences. 
                    You can usually find these settings in the "Options" or "Preferences" menu.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Account Settings</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Go to your account settings → Privacy section to manage your cookie preferences 
                    specifically for our platform.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Cookie Banner</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When you first visit our site, you'll see a cookie banner where you can customize 
                    your preferences.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Warning */}
        <div className="mt-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-300">Important Note</h4>
                <p className="text-amber-700 dark:text-amber-400 mt-1">
                  If you choose to reject cookies, you may still use our website, but some functionality 
                  and features may be restricted or not work properly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-8 text-center">
          <Mail className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Questions About Cookies?</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            If you have any questions about our Cookie Policy, please contact us.
          </p>
          <div className="space-y-2">
            <a
              href="mailto:olujidewealth3@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              olujidewealth3@gmail.com
            </a>
            <p className="text-slate-500 text-sm">Support hours: 7am to 8pm | Response within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
