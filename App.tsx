import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShoppingList } from './components/ShoppingList';
import { MonthTabs } from './components/MonthTabs';
import { SummaryBar } from './components/SummaryBar';
import { AddItemForm } from './components/AddItemForm';
import { INITIAL_CATEGORIES } from './constants';
import type { Category, ShoppingItem } from './types';
import { db } from './firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { Logo } from './components/Logo';

// Define a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}


const App: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<string>('November');
  const [currentShoppingList, setCurrentShoppingList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // PWA Service Worker and Install Prompt Logic
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('Service Worker registered: ', registration))
          .catch(registrationError => console.log('Service Worker registration failed: ', registrationError));
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      // Trigger the prompt immediately
      promptEvent.prompt();
      // Log the user choice
      promptEvent.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, 'shoppingLists', activeMonth);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentShoppingList(docSnap.data().categories);
      } else {
        console.log(`No document for ${activeMonth}, creating one.`);
        setDoc(docRef, { categories: INITIAL_CATEGORIES });
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching document:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeMonth]);

  const handleMonthChange = useCallback((month: string) => {
    setActiveMonth(month);
  }, []);
  
  const handleItemChange = useCallback(async (itemId: number, field: keyof ShoppingItem, value: string | number) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newCategories = JSON.parse(JSON.stringify(currentShoppingList));
    
    let itemFound = false;
    for (const category of newCategories) {
        for (const item of category.items) {
            if (item.id === itemId) {
                (item as any)[field] = value;
                if (field === 'quantity' || field === 'price') {
                    item.quantity = Number(isNaN(parseFloat(String(item.quantity))) ? 0 : item.quantity);
                    item.price = Number(isNaN(parseFloat(String(item.price))) ? 0 : item.price);
                }
                itemFound = true;
                break;
            }
        }
        if (itemFound) break;
    }
    
    await updateDoc(docRef, { categories: newCategories });
  }, [activeMonth, currentShoppingList]);

  const handleDeleteItem = useCallback(async (itemId: number) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    
    const newCategories = currentShoppingList.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== itemId)
    })).filter(category => category.items.length > 0);

    await updateDoc(docRef, { categories: newCategories });
  }, [activeMonth, currentShoppingList]);
  
  const handleAddItem = useCallback(async (newItem: Omit<ShoppingItem, 'id'>, categoryName: string) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newCategories = JSON.parse(JSON.stringify(currentShoppingList));
    
    const categoryIndex = newCategories.findIndex((cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase());
      
    const itemToAdd: ShoppingItem = {
      ...newItem,
      id: Date.now(),
    };

    if (categoryIndex > -1) {
      newCategories[categoryIndex].items.push(itemToAdd);
    } else {
      newCategories.push({
        id: Date.now() + 1,
        name: categoryName,
        items: [itemToAdd]
      });
    }

    await updateDoc(docRef, { categories: newCategories });
  }, [activeMonth, currentShoppingList]);


  const totalCost = useMemo(() => {
    if (!currentShoppingList) return 0;
    return currentShoppingList.reduce((total, category) => {
      return total + category.items.reduce((categoryTotal, item) => {
        return categoryTotal + (Number(item.quantity) * Number(item.price));
      }, 0);
    }, 0);
  }, [currentShoppingList]);

  const allCategories = useMemo(() => {
    if (!currentShoppingList) return [];
    return [...new Set(currentShoppingList.map(cat => cat.name))];
  }, [currentShoppingList]);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-black via-indigo-900 to-slate-50">
      <header className="bg-transparent text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 pt-8 pb-4 flex flex-col items-center">
            <Logo className="h-16 w-16 text-white mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest">Compras do Mês</h1>
            <p className="text-indigo-300 mt-2">Seu assistente pessoal de orçamento de compras</p>
        </div>
         <MonthTabs activeMonth={activeMonth} onMonthChange={handleMonthChange} />
      </header>
      
      <main className="container mx-auto p-4 pb-24">
        <AddItemForm onAddItem={handleAddItem} existingCategories={allCategories} />
        {isLoading ? (
             <div className="text-center py-10">
                <p className="text-lg text-gray-400">Carregando sua lista de compras...</p>
             </div>
        ) : (
            <ShoppingList 
                categories={currentShoppingList} 
                onItemChange={handleItemChange}
                onDeleteItem={handleDeleteItem}
            />
        )}
      </main>
      
      <SummaryBar total={totalCost} />
    </div>
  );
};

export default App;