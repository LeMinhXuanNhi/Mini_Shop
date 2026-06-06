import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCartItems(JSON.parse(saved))
  }, [])

  const saveCart = (items) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      const updated = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
      saveCart(updated)
    } else {
      saveCart([...cartItems, { ...product, quantity }])
    }
    toast.success(`✅ Đã thêm "${product.name}" vào giỏ hàng!`)
  }

  const removeFromCart = (productId) => {
    saveCart(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    saveCart(cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => saveCart([])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
