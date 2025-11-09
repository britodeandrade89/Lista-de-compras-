import React from 'react';
import type { Category, ShoppingItem } from '../types';
import { ShoppingItemRow } from './ShoppingItemRow';

interface ShoppingListProps {
  categories: Category[];
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number) => void;
  onDeleteItem: (itemId: number) => void;
}

const categoryColors = [
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', icon: 'text-violet-600' },
    { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', icon: 'text-sky-600' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-600' },
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-600' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', icon: 'text-rose-600' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', icon: 'text-cyan-600' },
    { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-800', icon: 'text-fuchsia-600' },
];

interface CategoryIconProps {
  categoryName: string;
  className: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryName, className }) => {
    const iconClasses = `w-6 h-6 mr-3 ${className}`;
    if (categoryName.toLowerCase().includes('grãos') || categoryName.toLowerCase().includes('derivados')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 0H9v-2h2v2z" /></svg>;
    }
    if (categoryName.toLowerCase().includes('limpeza')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>;
    }
    if (categoryName.toLowerCase().includes('carnes') || categoryName.toLowerCase().includes('ovos')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.25c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75V15c0-1.105-.895-2-2-2h-1.5c-1.105 0-2 .895-2 2v5.25zM12 8.25c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75V3c0-1.105-.895-2-2-2h-1.5C12.895 1 12 1.895 12 3v5.25z" /></svg>;
    }
     return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
};

export const ShoppingList: React.FC<ShoppingListProps> = ({ categories, onItemChange, onDeleteItem }) => {
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div className="space-y-6 mt-6">
      {sortedCategories.map((category, index) => {
        const color = categoryColors[index % categoryColors.length];
        return (
            <div key={category.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${color.border}`}>
            <h2 className={`px-6 py-3 ${color.bg} text-xl font-bold ${color.text} border-b ${color.border} flex items-center`}>
                <CategoryIcon categoryName={category.name} className={color.icon} />
                {category.name}
            </h2>
            <div className="divide-y divide-gray-200">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="col-span-5">Produto</span>
                    <span className="col-span-2 text-center">Quantidade</span>
                    <span className="col-span-2 text-center">Preço Unit.</span>
                    <span className="col-span-2 text-center">Subtotal</span>
                    <span className="col-span-1"></span>
                </div>
                {category.items.map(item => (
                <ShoppingItemRow
                    key={item.id}
                    item={item}
                    onItemChange={onItemChange}
                    onDeleteItem={onDeleteItem}
                />
                ))}
            </div>
            </div>
        )
      })}
    </div>
  );
};