import { useCallback, useEffect, useMemo, useState } from 'react'
import { CartContext } from './cart-context'
import { saveOrderHistoryEntry } from '../utils/order-storage'

const CART_STORAGE_KEY = 'skillbridge-cart'

function readStoredValue(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error(`Unable to load ${key} from browser storage.`, error)
    return fallback
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const storedItems = readStoredValue(CART_STORAGE_KEY, [])
    return Array.isArray(storedItems) ? storedItems : []
  })
  const [latestOrder, setLatestOrder] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Unable to save the marketplace bag.', error)
    }
  }, [items])

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.name === product.name)
      if (existingItem) {
        return currentItems.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...currentItems, { ...product, quantity }]
    })
  }, [])

  const updateQuantity = useCallback((productName, quantity) => {
    setItems((currentItems) =>
      quantity < 1
        ? currentItems.filter((item) => item.name !== productName)
        : currentItems.map((item) =>
            item.name === productName ? { ...item, quantity } : item,
          ),
    )
  }, [])

  const removeFromCart = useCallback((productName) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.name !== productName),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const placeOrderRequest = useCallback((customer, user) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const order = {
      id: `SB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shipping: subtotal >= 1500 ? 0 : 99,
      total: subtotal + (subtotal >= 1500 ? 0 : 99),
    }

    saveOrderHistoryEntry(order, user)
    setLatestOrder(order)
    clearCart()
    return order
  }, [clearCart, items])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      latestOrder,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      placeOrderRequest,
    }),
    [
      addToCart,
      clearCart,
      items,
      latestOrder,
      placeOrderRequest,
      removeFromCart,
      updateQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
