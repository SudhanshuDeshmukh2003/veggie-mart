export type CartItem = {
  vegetableId: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  quantity: number;
};

const CART_KEY = "sabzi_cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">, qty = 1) {
  const cart = readCart();
  const existing = cart.find((c) => c.vegetableId === item.vegetableId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  writeCart(cart);
}

export function updateCartQty(vegetableId: string, quantity: number) {
  const cart = readCart()
    .map((item) =>
      item.vegetableId === vegetableId ? { ...item, quantity } : item,
    )
    .filter((item) => item.quantity > 0);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
