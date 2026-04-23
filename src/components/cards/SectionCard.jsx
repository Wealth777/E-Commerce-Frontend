import React from 'react';

const SectionCard = ({ 
  title, 
  icon: Icon, 
  children,
  className = ""
}) => {
  return (
    <section className={`bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {children}
      </div>
    </section>
  );
};

export default SectionCard;
