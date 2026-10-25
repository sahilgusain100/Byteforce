const ORDER_HISTORY_KEY = 'skillbridge-order-history'

function getOwnerId(user) {
  return user?.id ?? user?.email?.trim().toLowerCase() ?? 'guest'
}

function readOrderHistory() {
  const storedOrders = window.localStorage.getItem(ORDER_HISTORY_KEY)
  if (!storedOrders) return []

  try {
    const orders = JSON.parse(storedOrders)
    if (!Array.isArray(orders)) {
      throw new Error('Saved order history has an invalid format.')
    }
    return orders
  } catch (error) {
    console.error('Saved order history in browser storage is invalid.', error)
    throw new Error('Order history could not be read. Clear the app storage and try again.')
  }
}

export function getOrderHistory(user) {
  const ownerId = getOwnerId(user)
  const email = user?.email?.trim().toLowerCase()
  return readOrderHistory()
    .filter(
      (order) =>
        order.ownerId === ownerId ||
        (email && order.customerEmail === email),
    )
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      customerEmail: order.customer?.email?.trim().toLowerCase() ?? null,
    }))
}

export function saveOrderHistoryEntry(order, user) {
  const ownerId = getOwnerId(user)
  const historyEntry = {
    id: order.id,
    ownerId,
    createdAt: order.createdAt,
    items: order.items.map(({ name, category, artisan, price, quantity }) => ({
      name,
      category,
      artisan,
      price,
      quantity,
    })),
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    status: 'Demo request saved',
  }

  try {
    const orders = readOrderHistory()
    window.localStorage.setItem(
      ORDER_HISTORY_KEY,
      JSON.stringify([...orders, historyEntry]),
    )
  } catch (error) {
    console.error('Unable to save order history in this browser.', error)
    if (error instanceof Error && error.message.startsWith('Order history could not be read')) {
      throw error
    }
    throw new Error('Order history could not be saved. Check browser storage settings and try again.')
  }

  return historyEntry
}
