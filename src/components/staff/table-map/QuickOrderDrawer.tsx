'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { dishes_services } from '@/services/dish.services';
import { postOrder } from '@/services/order.services';
import { IDish, IOrderCreate, IOrderDetailBase } from '@/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { toast } from 'react-toastify';
import {
  X,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Loader2,
  UtensilsCrossed,
} from 'lucide-react';

interface CartItem {
  dish: IDish;
  quantity: number;
}

interface QuickOrderDrawerProps {
  isOpen: boolean;
  tableId: number;
  tableName?: string;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export const QuickOrderDrawer: React.FC<QuickOrderDrawerProps> = ({
  isOpen,
  tableId,
  tableName,
  onClose,
  onOrderCreated,
}) => {
  const user = useAppSelector((state) => state.auth.user);

  const [dishes, setDishes] = useState<IDish[]>([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dishes list when opened
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    const fetchDishes = async () => {
      setIsLoadingDishes(true);
      try {
        const res = await dishes_services.getDishes({});
        if (mounted && res?.data && Array.isArray(res.data)) {
          setDishes(res.data);
        }
      } catch (err: any) {
        console.error('Failed to load dishes:', err);
        toast.error('Failed to load menu dishes.');
      } finally {
        if (mounted) setIsLoadingDishes(false);
      }
    };

    fetchDishes();
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    dishes.forEach((d) => {
      if (d.category?.name) set.add(d.category.name);
    });
    return Array.from(set);
  }, [dishes]);

  // Filter dishes by search term and category
  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      const matchCat =
        selectedCategory === 'ALL' || d.category?.name === selectedCategory;
      const matchSearch =
        !searchTerm ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [dishes, selectedCategory, searchTerm]);

  // Cart actions
  const handleAddToCart = (dish: IDish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateQty = (dishId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveFromCart = (dishId: number) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  // Calculations
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0),
    [cart]
  );
  const tax = Math.round(subtotal * 0.085);
  const totalPrice = subtotal + tax;

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      toast.warn('Please select at least 1 menu item.');
      return;
    }

    setIsSubmitting(true);
    try {
      const details: IOrderDetailBase[] = cart.map((item) => ({
        dishID: item.dish.id,
        quantity: item.quantity,
        price: item.dish.price,
      }));

      const payload: IOrderCreate = {
        customerID: user?.id || 1,
        staffID: user?.id,
        tableID: tableId,
        details,
        subtotal,
        tax,
        delivery: 0,
        totalPrice,
        notes: `Quick order for table B${tableId}`,
      };

      const res = await postOrder(payload);
      if (res?.data || res?.success) {
        toast.success(
          `Order placed successfully for table ${tableName || `B${tableId}`}!`
        );
        setCart([]);
        onOrderCreated?.();
        onClose();
      } else {
        toast.error(res?.message || 'Failed to place order.');
      }
    } catch (err: any) {
      console.error('Post order error:', err);
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        toast.error(data?.message || data?.detail || 'Order conflict or table is currently locked. Please try again.');
      } else if (status === 422) {
        toast.error(data?.detail || data?.message || 'Invalid order data or payload conflict. Please verify items.');
      } else {
        toast.error(
          data?.detail || data?.message || err.message || 'Error submitting order request.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FFFDF7] h-full shadow-2xl flex flex-col border-l border-[#CFC3A6]/40">
        {/* Header */}
        <div className="p-5 border-b border-[#CFC3A6]/30 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F25C14]/10 text-[#F25C14] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1F2535]">
                Quick Order
              </h2>
              <p className="text-xs text-[#5F6575]">
                Place orders directly for table{' '}
                <strong className="text-[#1F2535]">{tableName || `B${tableId}`}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-[#5F6575] hover:bg-[#F3EAD3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Dish Grid (Left) + Cart Summary (Right) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Dishes Selection Panel */}
          <div className="flex-1 flex flex-col border-r border-[#CFC3A6]/30 overflow-hidden">
            {/* Search & Categories */}
            <div className="p-4 space-y-3 border-b border-[#CFC3A6]/20 bg-[#FBF5E4]/30">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#5F6575]" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#CFC3A6] text-sm text-[#1F2535] focus:outline-none focus:border-[#F25C14]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-3 py-1 rounded-full font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#1F2535] text-white'
                      : 'bg-white border border-[#CFC3A6] text-[#5F6575] hover:bg-[#F3EAD3]/30'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full font-medium shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#1F2535] text-white'
                        : 'bg-white border border-[#CFC3A6] text-[#5F6575] hover:bg-[#F3EAD3]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dish List */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoadingDishes ? (
                <div className="flex items-center justify-center h-48 text-sm text-[#5F6575]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2 text-[#F25C14]" />
                  Loading menu dishes...
                </div>
              ) : filteredDishes.length === 0 ? (
                <div className="py-12 text-center text-sm text-[#5F6575]">
                  No matching dishes found.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredDishes.map((dish) => {
                    const cartItem = cart.find((c) => c.dish.id === dish.id);
                    return (
                      <div
                        key={dish.id}
                        className="bg-white p-3 rounded-2xl border border-[#CFC3A6]/40 shadow-xs flex flex-col justify-between hover:border-[#D9A63E] transition-all"
                      >
                        {dish.imgUrl && (
                          <img
                            src={dish.imgUrl}
                            alt={dish.name}
                            className="w-full h-24 object-cover rounded-xl mb-2 bg-[#FBF5E4]"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-sm text-[#1F2535] line-clamp-1">
                            {dish.name}
                          </h4>
                          <p className="text-xs font-bold text-[#F25C14] mt-0.5">
                            {dish.price.toLocaleString('en-US')} VND
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-[#CFC3A6]/20 flex items-center justify-between">
                          {cartItem ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(dish.id, -1)}
                                className="w-6 h-6 rounded-lg bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center hover:bg-[#CFC3A6] text-xs font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-[#1F2535]">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(dish.id, 1)}
                                className="w-6 h-6 rounded-lg bg-[#F25C14] text-white flex items-center justify-center hover:bg-[#d84e0e] text-xs font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddToCart(dish)}
                              className="w-full py-1.5 px-3 bg-[#FBF5E4] hover:bg-[#F25C14] hover:text-white text-[#1F2535] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Item</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart Column (Right) */}
          <div className="w-72 flex flex-col bg-[#FFFDF7] p-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#CFC3A6]/30">
              <ShoppingBag className="w-4 h-4 text-[#F25C14]" />
              <h3 className="font-bold text-sm text-[#1F2535]">
                Selected Items ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#5F6575]">
                  No items selected yet.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.dish.id}
                    className="p-2.5 bg-white rounded-xl border border-[#CFC3A6]/30 flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1F2535] leading-tight">
                        {item.dish.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.dish.id)}
                        className="text-[#962B1A] hover:opacity-80 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5F6575]">
                        {(item.dish.price * item.quantity).toLocaleString('en-US')} VND
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.dish.id, -1)}
                          className="w-5 h-5 rounded-md bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center text-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs px-1 text-[#1F2535]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.dish.id, 1)}
                          className="w-5 h-5 rounded-md bg-[#F25C14] text-white flex items-center justify-center text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pricing Summary */}
            <div className="pt-3 border-t border-[#CFC3A6]/30 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5F6575]">
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString('en-US')} VND</span>
              </div>
              <div className="flex justify-between text-[#5F6575]">
                <span>VAT (8.5%):</span>
                <span>{tax.toLocaleString('en-US')} VND</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1F2535] pt-1.5 border-t border-[#CFC3A6]/20">
                <span>Total:</span>
                <span className="text-[#F25C14]">
                  {totalPrice.toLocaleString('en-US')} VND
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full mt-3 py-3 rounded-xl bg-[#F25C14] hover:bg-[#d84e0e] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting order...</span>
                  </>
                ) : (
                  <span>Confirm Order</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
