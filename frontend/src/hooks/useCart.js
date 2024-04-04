import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
    items: [],
    totalPrice: 0,
    totalCount: 0,
};

export default function CartProvider({ children }) {
    const initCart = getCartFromLocalStorage();
    const [cartItems, setCartItems] = useState(initCart.items);
    const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
    const [totalCount, setTotalCount] = useState(initCart.totalCount);

    useEffect(() => {
        const totalPrice = sum(cartItems.map(item => item.price));
        const totalCount = sum(cartItems.map(item => item.quantity));
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);

        localStorage.setItem(CART_KEY, JSON.stringify({
            items: cartItems,
            totalPrice,
            totalCount,
        }));
    }, [cartItems]);

    function getCartFromLocalStorage() {
        const storedCart = localStorage.getItem(CART_KEY);
        return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
    }

    const sum = items => items.reduce((prevValue, curValue) => prevValue + curValue, 0);

    const removeFromCart = (foodId, size) => {
        const filteredCartItems = cartItems.filter(item => item.food.id !== foodId || item.size !== size);
        setCartItems(filteredCartItems);
    };

    const removeFoodFromCart = (foodId) => {
        const filteredCartItems = cartItems.filter(item => item.food.id !== foodId);
        setCartItems(filteredCartItems);
    };

    const changeQuantity = (cartItem, newQuantity) => {
        const { food, size } = cartItem;
        newQuantity = Math.min(newQuantity, 10);  // Ensure the quantity does not exceed 10
        if (newQuantity <= 0) {
            removeFromCart(food.id, size);
            return;
        }
        const changeCartItem = {
            ...cartItem,
            quantity: newQuantity,
            price: size === 'Big' ? food.price * 1.5 * newQuantity : food.price * newQuantity,
        };

        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => item.food.id === food.id && item.size === size ? changeCartItem : item);
            return mergeItems(updatedItems);
        });
    };

    const changeSize = (cartItem, newSize) => {
        const { food, quantity } = cartItem;
        const changeCartItem = {
            ...cartItem,
            size: newSize,
            price: newSize === 'Big' ? food.price * 1.5 * quantity : food.price * quantity,
        };

        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => item.food.id === food.id && item.size === cartItem.size ? changeCartItem : item);
            return mergeItems(updatedItems);
        });
    };

    const addToCart = (food, size = 'Normal') => {
        const cartItem = cartItems.find(item => item.food.id === food.id && item.size === size);
        if (cartItem) {
            changeQuantity(cartItem, Math.min(cartItem.quantity + 1, 10));  // Ensure the quantity does not exceed 10
        } else {
            const newItem = {
                food,
                quantity: 1,
                price: size === 'Big' ? food.price * 1.5 : food.price,
                size,
            };
            setCartItems(prevItems => mergeItems([...prevItems, newItem]));
        }
    };

    const mergeItems = (items) => {
        const mergedItems = [];
        items.forEach(item => {
            const existingItem = mergedItems.find(i => i.food.id === item.food.id && i.size === item.size);
            if (existingItem) {
                existingItem.quantity = Math.min(existingItem.quantity + item.quantity, 10);  // Ensure the quantity does not exceed 10
                existingItem.price = item.size === 'Big' ? existingItem.food.price * 1.5 * existingItem.quantity : existingItem.food.price * existingItem.quantity;
            } else {
                mergedItems.push(item);
            }
        });
        return mergedItems;
    };

    const clearCart = () => {
        localStorage.removeItem(CART_KEY);
        const { items, totalPrice, totalCount } = EMPTY_CART;
        setCartItems(items);
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);
    };

    return (
        <CartContext.Provider value={{ cart: { items: cartItems, totalPrice, totalCount }, removeFromCart, removeFoodFromCart, changeQuantity, changeSize, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
