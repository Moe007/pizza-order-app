import React, { useContext, useState } from "react"

const CartContext = React.createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([])

    return (
        <CartContext.Provider value={{ items, setItems }}>
            {children}
        </CartContext.Provider>
    )
}
