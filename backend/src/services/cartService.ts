import { CartRepository } from '../repositories/cartRepository';

export class CartService {
  public static calculateCartTotals(items: any[]) {
    const subtotal = items.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const shipping = items.length === 0 ? 0 : subtotal >= 50 ? 0 : 10;
    const discount = 0; // Default discount until promo applied
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  static async getUserCart(userId: string) {
    const cart = await CartRepository.getOrCreateCart(userId);
    const totals = this.calculateCartTotals(cart.items);
    return {
      cart,
      totals,
    };
  }

  static async addItemToCart(userId: string, productId: string, quantity: number) {
    const cart = await CartRepository.addItem(userId, productId, quantity);
    const totals = this.calculateCartTotals(cart.items);
    return { cart, totals };
  }

  static async updateCartItemQuantity(userId: string, productId: string, quantity: number) {
    const cart = await CartRepository.updateQuantity(userId, productId, quantity);
    const totals = this.calculateCartTotals(cart.items);
    return { cart, totals };
  }

  static async removeCartItem(userId: string, productId: string) {
    const cart = await CartRepository.removeItem(userId, productId);
    const totals = this.calculateCartTotals(cart.items);
    return { cart, totals };
  }

  static async syncCart(userId: string, guestItems: { productId: string; quantity: number }[]) {
    const cart = await CartRepository.syncItems(userId, guestItems);
    const totals = this.calculateCartTotals(cart.items);
    return { cart, totals };
  }

  static async clearCart(userId: string) {
    const cart = await CartRepository.clearCart(userId);
    const totals = this.calculateCartTotals(cart.items);
    return { cart, totals };
  }
}
