import React from 'react';

interface MonthTabsProps {
  activeMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Translate month names for display
const PT_BR_MONTHS: { [key: string]: string } = {
  "January": "Janeiro", "February": "Fevereiro", "March": "Março", "April": "Abril",
  "May": "Maio", "June": "Junho", "July": "Julho", "August": "Agosto",
  "September": "Setembro", "October": "Outubro", "November": "Novembro", "December": "Dezembro"
};

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onMonthChange }) => {
  const currentMonthIndex = new Date().getMonth();
  // Show current month and next 5 months for simplicity
  const displayMonths = Array.from({ length: 12 }, (_, i) => MONTHS[(currentMonthIndex + i) % 12]);

  return (
    <div className="border-b border-white/20">
      <nav className="container mx-auto px-4 -mb-px flex space-x-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {MONTHS.map(month => {
          const isActive = activeMonth === month;
          return (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${isActive
                  ? 'border-white text-white'
                  : 'border-transparent text-indigo-200 hover:text-white hover:border-white/50'
                }`}
            >
              {PT_BR_MONTHS[month]}
            </button>
          )
        })}
      </nav>
    </div>
  );
};