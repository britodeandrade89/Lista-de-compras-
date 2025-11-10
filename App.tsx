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
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAddItemFormVisible, setIsAddItemFormVisible] = useState(false);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('Service Worker registered: ', registration))
          .catch(registrationError => console.log('Service Worker registration failed: ', registrationError));
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPromptEvent(null);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, 'shoppingLists', activeMonth);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const categoriesFromDb = docSnap.data().categories as Category[];
        // Sort items within each category for consistent display
        const sortedCategories = categoriesFromDb.map(category => ({
          ...category,
          items: [...category.items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        }));
        setCurrentShoppingList(sortedCategories);
      } else {
        console.log(`No document for ${activeMonth}, creating one.`);
        setDoc(docRef, { categories: INITIAL_CATEGORIES });
        setCurrentShoppingList(INITIAL_CATEGORIES);
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
      // Re-sort the items list to maintain alphabetical order
      newCategories[categoryIndex].items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    } else {
      newCategories.push({
        id: Date.now() + 1,
        name: categoryName,
        items: [itemToAdd]
      });
    }

    await updateDoc(docRef, { categories: newCategories });
    setIsAddItemFormVisible(false); // Close form after adding
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
      <header className="bg-transparent text-white">
        <div className="container mx-auto px-4 pt-8 pb-4 flex flex-col items-center">
            <Logo className="h-16 w-16 text-white mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest">Compras do Mês</h1>
            <p className="text-indigo-300 mt-2">Seu assistente pessoal de orçamento de compras</p>
             {installPromptEvent && (
              <button
                onClick={handleInstallClick}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instalar App
              </button>
            )}
        </div>
         <MonthTabs activeMonth={activeMonth} onMonthChange={handleMonthChange} />
      </header>
      
      <div className={`sticky top-0 z-20 transition-all duration-300 ${isAddItemFormVisible ? 'bg-slate-50 shadow-sm' : 'bg-transparent'}`}>
         <AddItemForm 
            onAddItem={handleAddItem} 
            existingCategories={allCategories}
            isVisible={isAddItemFormVisible}
            setIsVisible={setIsAddItemFormVisible} 
        />
      </div>

      <main className="container mx-auto p-4 pb-24">
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