interface CartSummaryProps {
  total: number;
  onCheckout: () => void;
}

const CartSummary = ({ total, onCheckout }: CartSummaryProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
      <div className="flex justify-between mb-4">
        <span className="text-gray-600">Total:</span>
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Buy Now
      </button>
    </div>
  );
};

export default CartSummary;