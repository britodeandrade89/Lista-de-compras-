import React from 'react';
import type { ShoppingItem } from '../types';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number) => void;
  onDeleteItem: (itemId: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({ item, onItemChange, onDeleteItem }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseFloat(value);
    onItemChange(item.id, name as keyof ShoppingItem, isNaN(numericValue) ? 0 : numericValue);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    onItemChange(item.id, 'quantity', Math.max(0, newQuantity));
  };

  const subtotal = (item.quantity || 0) * (item.price || 0);

  return (
    <div className="grid grid-cols-12 gap-x-1 md:gap-2 py-2 px-2 md:px-4 items-center hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0 border-gray-100">
        <div className="col-span-4 md:col-span-6">
            <p className="text-gray-800 font-medium text-sm truncate">{item.name}</p>
        </div>
        <div className="col-span-3 md:col-span-2">
            <div className="flex items-center justify-center">
                <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 0}
                    className="p-1 md:p-2 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    aria-label="Diminuir quantidade"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="w-8 md:w-12 text-center p-1 md:p-2 border-t border-b border-gray-300 bg-white font-medium text-gray-800 select-none text-sm">{item.quantity}</span>
                <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="p-1 md:p-2 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    aria-label="Aumentar quantidade"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-6-6h12" />
                    </svg>
                </button>
            </div>
        </div>
        <div className="col-span-2 md:col-span-2">
            <input
                type="number"
                name="price"
                value={item.price}
                onChange={handleInputChange}
                className="w-full p-1 md:p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-center text-sm"
                min="0"
                step="0.01"
            />
        </div>
        <div className="col-span-2 md:col-span-1 text-center">
            <p className="text-gray-900 font-semibold text-sm">{formatCurrency(subtotal)}</p>
        </div>
        <div className="col-span-1 md:col-span-1 flex justify-center md:justify-end">
            <button 
              onClick={() => onDeleteItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
              aria-label={`Delete ${item.name}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    </div>
  );
};