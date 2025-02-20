import { Utensils, CupSoda, Scissors, Hammer, Flower2 } from "lucide-react"; 
import { Thela } from '../../types/thela';

interface ThelaInfoWindowProps {
  thela: Thela;
  onClose: () => void;
  onDelete: (id: string) => void;
}

// Mapping type to corresponding icon component
const iconMap: Record<string, JSX.Element> = {
    food: <Utensils className="mr-3 text-emerald-600" size={20} />,
    drink: <CupSoda className="mr-3 text-blue-600" size={20} />,
    tailor: <Scissors className="mr-3 text-red-600" size={20} />,
    mochi: <Hammer className="mr-3 text-yellow-600" size={20} />,
    flowers: <Flower2 className="mr-3 text-pink-600" size={20} />
  };
  

export default function ThelaInfoWindow({ thela, onClose, onDelete }: ThelaInfoWindowProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl">
      <div className="flex items-center p-3 border-b">
        {iconMap[thela.type] || null}
        <h2 className="text-lg font-bold text-gray-900">{thela.name}</h2>
      </div>
  
      <div className="p-3 space-y-2">
        <div>
          <span className="font-semibold text-gray-700 text-sm">Type:</span>{' '}
          <span className="text-gray-900 text-sm capitalize">{thela.type}</span>
        </div>
        {thela.type === 'food' && thela.mainFoodItem && (
          <div>
            <span className="font-semibold text-gray-700 text-sm">Main Food Item:</span>{' '}
            <span className="text-gray-900 text-sm">{thela.mainFoodItem}</span>
          </div>
        )}
        {thela.type === 'drink' && thela.mainFoodItem && (
          <div>
            <span className="font-semibold text-gray-700 text-sm">Main Drink Item:</span>{' '}
            <span className="text-gray-900 text-sm">{thela.mainFoodItem}</span>
          </div>
        )}
        {thela.description && (
          <div>
            <span className="font-semibold text-gray-700 text-sm">Description:</span>{' '}
            <span className="text-gray-900 text-sm italic">{thela.description}</span>
          </div>
        )}
        <button
          onClick={() => onDelete(thela.id!)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete Stall
        </button>
      </div>
    </div>
  );
}
