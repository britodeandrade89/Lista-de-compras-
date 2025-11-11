import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShoppingList } from './components/ShoppingList';
import { MonthTabs } from './components/MonthTabs';
import { SummaryBar } from './components/SummaryBar';
import { AddItemForm } from './components/AddItemForm';
import { INITIAL_CATEGORIES } from './constants';
import type { Category, ShoppingItem } from './types';
import { Logo } from './components/Logo';
import { AIAssistantButton } from './components/AIAssistantButton';
import { AIAssistant } from './components/AIAssistant';

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
  const [shoppingData, setShoppingData] = useState<Record<string, Category[]>>({
    'November': JSON.parse(JSON.stringify(INITIAL_CATEGORIES)) // Deep copy
  });

  const currentShoppingList = useMemo(() => shoppingData[activeMonth] || [], [shoppingData, activeMonth]);

  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAddItemFormVisible, setIsAddItemFormVisible] = useState(false);
  const [isAIAssistantVisible, setIsAIAssistantVisible] = useState(false);
  
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

  const handleMonthChange = useCallback((month: string) => {
    if (!shoppingData[month]) {
      setShoppingData(prevData => ({
        ...prevData,
        [month]: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)) // Create new list for new month
      }));
    }
    setActiveMonth(month);
  }, [shoppingData]);
  
  const handleItemChange = useCallback((itemId: number, field: keyof ShoppingItem, value: string | number) => {
    setShoppingData(prevData => {
        const newCategories = JSON.parse(JSON.stringify(prevData[activeMonth]));
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
        return { ...prevData, [activeMonth]: newCategories };
    });
  }, [activeMonth]);

  const handleDeleteItem = useCallback((itemId: number) => {
     setShoppingData(prevData => {
        const newCategories = prevData[activeMonth]
            .map(category => ({
                ...category,
                items: category.items.filter(item => item.id !== itemId)
            }))
            .filter(category => category.items.length > 0);
        return { ...prevData, [activeMonth]: newCategories };
     });
  }, [activeMonth]);
  
  const handleAddItem = useCallback((newItem: Omit<ShoppingItem, 'id'>, categoryName: string) => {
    setShoppingData(prevData => {
        const newCategories = JSON.parse(JSON.stringify(prevData[activeMonth] || []));
        const categoryIndex = newCategories.findIndex((cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase());
          
        const itemToAdd: ShoppingItem = {
          ...newItem,
          id: Date.now(),
        };

        if (categoryIndex > -1) {
          newCategories[categoryIndex].items.push(itemToAdd);
          newCategories[categoryIndex].items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        } else {
          newCategories.push({
            id: Date.now() + 1,
            name: categoryName,
            items: [itemToAdd]
          });
        }
        return { ...prevData, [activeMonth]: newCategories };
    });
    setIsAddItemFormVisible(false); // Close form after adding
  }, [activeMonth]);


  const totalCost = useMemo(() => {
    return currentShoppingList.reduce((total, category) => {
      return total + category.items.reduce((categoryTotal, item) => {
        return categoryTotal + (Number(item.quantity) * Number(item.price));
      }, 0);
    }, 0);
  }, [currentShoppingList]);

  const allCategories = useMemo(() => {
    return [...new Set(currentShoppingList.map(cat => cat.name))];
  }, [currentShoppingList]);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-violet-100 to-slate-50">
      <header className="bg-transparent text-slate-800">
        <div className="container mx-auto px-4 pt-8 pb-4 flex flex-col items-center">
            <Logo className="h-16 w-16 text-slate-800 mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-center">Compras do Mês</h1>
            <p className="text-violet-700 mt-2 font-semibold">Seu assistente pessoal de orçamento de compras</p>
             {installPromptEvent && (
              <button
                onClick={handleInstallClick}
                className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-transform transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instalar no seu dispositivo
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
        <ShoppingList 
            categories={currentShoppingList} 
            onItemChange={handleItemChange}
            onDeleteItem={handleDeleteItem}
        />
      </main>
      
      <SummaryBar total={totalCost} />

      <AIAssistant isVisible={isAIAssistantVisible} onClose={() => setIsAIAssistantVisible(false)} />
      {!isAIAssistantVisible && <AIAssistantButton onClick={() => setIsAIAssistantVisible(true)} />}
    </div>
  );
};

export default App;
