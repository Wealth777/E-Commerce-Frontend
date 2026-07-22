import React, { useState } from "react";
import { PhoneCall, ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQ() {
    // Track open state for each individual question by index
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Why did I receive this security email?",
            answer:
                "You received this email because the primary email address on your CampusTrade account was recently changed or someone reported that the change was unauthorized.",
        },
        {
            question: "What happens after I report an unauthorized email change?",
            answer:
                "Our security system immediately records the incident, reviews your account activity, and applies additional protection measures where necessary. Depending on the situation, you may be required to verify your identity before regaining access.",
        },
        {
            question: "Will my account be locked?",
            answer:
                "Not always. If our system detects suspicious activity or believes your account is at risk, temporary restrictions may be applied until ownership is confirmed.",
        },
        {
            question: "Can I recover my original email address?",
            answer:
                "Yes. After ownership verification, our support team will help restore your original email address if the change was unauthorized.",
        },
        {
            question: "What should I do if I still have access to my account?",
            answer:
                "Immediately change your password, review your security settings, enable two factor authentication when available, and review your recent account activity.",
        },
        {
            question: "What if I no longer have access to my account?",
            answer:
                "Contact CampusTrade Support as soon as possible. Our security team will verify your identity and guide you through the account recovery process.",
        },
        {
            question: "How long does account recovery take?",
            answer:
                "Most cases are reviewed within 24 hours. More complex investigations may require additional verification before access is restored.",
        },
        {
            question: "Can someone change my email without my password?",
            answer:
                "Normally, no. However, if someone gains access to your account through stolen credentials or an active session, they may attempt to change your email. This is why you should always use a strong password and enable additional security features.",
        },
    ];

    return (
        <section className="mt-8 space-y-6">
            {/* Header */}
            <div className="text-left space-y-1 p-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#10B981]" />
                    Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                    Click any question below to reveal its answer.
                </p>
            </div>

            {/* FAQ Questions List */}
            <div className="space-y-3">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen
                                ? "border-[#10B981]/50 bg-emerald-50/20 dark:bg-emerald-500/5 shadow-sm"
                                : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-gray-300 dark:hover:border-slate-700"
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-gray-900 dark:text-slate-100 hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors focus:outline-none"
                                aria-expanded={isOpen}
                            >
                                <span>{faq.question}</span>
                                <ChevronDown
                                    className={`w-4 h-4 shrink-0 text-[#10B981] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                        }`}
                                />
                            </button>

                            {/* Collapsible Answer */}
                            {isOpen && (
                                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-slate-800/60 pt-3">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Still Have Questions Callout (Unchanged) */}
            <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight">Still have questions?</h3>
                        <p className="text-xs text-green-100 opacity-90 leading-relaxed">
                            Our support team is available to help you recover your account
                            and answer any security related questions.
                        </p>
                    </div>
                    <Link
                        to="/contactus"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 hover:text-green-950 transition-all shadow-md"
                    >
                        Contact Support
                    </Link>
                </div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
            </div>
        </section>
    );
}