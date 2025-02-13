
import { useState } from 'react';
import { Thela } from '../../types/thela';

interface ThelaFormProps {
  onSubmit: (thela: Omit<Thela, 'id'>) => void;
  onCancel: () => void;
  location: { lat: number; lng: number };
}

export default function ThelaForm({ onSubmit, onCancel, location }: ThelaFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainFoodItem, setMainFoodItem] = useState("");
  const [type, setType] = useState<Thela["type"]>("food");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialityItem = (type === 'food' || type === 'drink') ? mainFoodItem : undefined;
    onSubmit({
      name,
      description,
      mainFoodItem: specialityItem,
      latitude: location.lat,
      longitude: location.lng,
      type,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add New ठेला</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ठेला Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stall Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Thela["type"])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
            >
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="tailor">Tailor</option>
              <option value="flowers">Flowers</option>
              <option value="mochi">Mochi</option>
            </select>
          </div>
          {(type === 'food' || type === 'drink') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'food' ? 'Main Food Item' : 'Main Drink Item'}
              </label>
              <input
                type="text"
                value={mainFoodItem}
                onChange={(e) => setMainFoodItem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
                placeholder={type === 'food' ? 'e.g., Vada Pav, Bhel Puri' : 'e.g., Sugarcane Juice, Lassi'}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black bg-white"
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <button 
              type="submit" 
              className="flex-1 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition"
            >
              Save Stall
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}