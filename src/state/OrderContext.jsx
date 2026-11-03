import { useState } from 'react'
import { initialOrder } from './initialOrder'
import { OrderContext } from './orderContext'

export function OrderProvider({ children }) {
  const [order, setOrder] = useState(initialOrder)

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}
