import React from 'react';
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCart';
import Title from '../../components/Title/Title';
import { Link } from 'react-router-dom';
import Price from '../../components/Price/Price';
import NotFound from '../../components/NotFound/NotFound';

export default function CartPage() {
    const { cart, removeFromCart, changeQuantity, changeSize } = useCart();

    return (
        <>
            <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />
            {cart.items.length === 0 ? (
                <NotFound message="Cart Page Is Empty!" />
            ) : (
                <div className={classes.container}>
                    <ul className={classes.list}>
                        {cart.items.map(item => (
                            <li key={`${item.food.id}-${item.size}`}>
                                <div>
                                    <img src={`${item.food.imageUrl}`} alt={item.food.name} />
                                </div>
                                <div>
                                    <Link to={`/food/${item.food.id}`}>{item.food.name}</Link>
                                </div>
                                <div>
                                    <select value={item.size} onChange={e => changeSize(item, e.target.value)}>
                                        <option value="Normal">Normal</option>
                                        <option value="Big">Big</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={item.quantity} onChange={e => changeQuantity(item, Number(e.target.value))}>
                                        {[...Array(10).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Price price={item.price} />
                                </div>
                                <div>
                                    <button className={classes.remove_button} onClick={() => removeFromCart(item.food.id, item.size)}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={classes.checkout}>
                        <div>
                            <div className={classes.foods_count}>{cart.totalCount}</div>
                            <div className={classes.total_price}>
                                <Price price={cart.totalPrice} />
                            </div>
                        </div>

                        <Link to="/checkout" className={classes.checkoutButton}>Proceed To Checkout</Link>
                    </div>
                </div>
            )}
        </>
    );
}
