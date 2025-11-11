import React from 'react';

interface MonthTabsProps {
  activeMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Translate month names to abbreviated Portuguese
const PT_BR_MONTHS_ABBR: { [key: string]: string } = {
  "January": "Jan", "February": "Fev", "March": "Mar", "April": "Abr",
  "May": "Mai", "June": "Jun", "July": "Jul", "August": "Ago",
  "September": "Set", "October": "Out", "November": "Nov", "December": "Dez"
};

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onMonthChange }) => {
  return (
    <div className="border-b border-violet-200">
      <nav className="container mx-auto px-4 py-2 -mb-px flex flex-nowrap justify-start overflow-x-auto gap-x-4" aria-label="Tabs">
        {MONTHS.map(month => {
          const isActive = activeMonth === month;
          return (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={`whitespace-nowrap py-3 px-2 border-b-2 font-semibold text-sm transition-colors duration-200
                ${isActive
                  ? 'border-violet-600 text-violet-800'
                  : 'border-transparent text-violet-500 hover:text-violet-800 hover:border-violet-300'
                }`}
            >
              {PT_BR_MONTHS_ABBR[month]}
            </button>
          )
        })}
      </nav>
    </div>
  );
};