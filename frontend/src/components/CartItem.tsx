import { Trash2 } from "lucide-react";

interface CartItemProps {
  courseid: number;
  courseName: string;
  price: number;
  courseImageURL: string;
  onRemove: (courseid: number) => void;
}

const CartItem = ({ courseid, courseName, price, courseImageURL, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <img
        src={courseImageURL}
        alt={courseName}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800">{courseName}</h3>
        <p className="text-primary font-bold">${price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => onRemove(courseid)}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;