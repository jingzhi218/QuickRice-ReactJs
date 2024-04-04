import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import classes from './orderItemsList.module.css';

export default function OrderItemsList({ order }) {
    return (
        <table className={classes.table}>
            <tbody>
                <tr>
                    <td colSpan="6">
                        <h3>Order Items:</h3>
                    </td>
                </tr>
                {order.items.map(item => (
                    <tr key={`${item.food.id}-${item.size}`}>
                        <td>
                            <Link to={`/food/${item.food.id}`}>
                                <img src={item.food.imageUrl} alt='' />
                            </Link>
                        </td>
                        <td>{item.food.name}</td>
                        <td>{item.size}</td>
                        <td>
                            <Price price={item.size === 'Big' ? item.food.price*1.5 : item.food.price} />
                            
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                            <Price price={item.price} />
                        </td>
                    </tr>
                ))}

                <tr>
                    <td colSpan="4"></td>
                    <td>
                        <strong>Total:</strong>
                    </td>
                    <td>
                        <Price price={order.totalPrice} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
