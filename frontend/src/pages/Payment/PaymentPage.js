import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import PaypalButtons from '../../components/PaypalButtons/PaypalButtons';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

export default function PaymentPage() {
    const [order, setOrder] = useState();

    useEffect(() => {
        setTimeout(() => {
            getNewOrderForCurrentUser().then(data => setOrder(data));
        }, 1000);
    }, []);

    // if (!order) return null;

    return (
        <>
        {!order ? (
                <Loading />
            ) : (
            <div className={classes.container}>
                <div className={classes.content}>
                    <Title title="Order Form" fontSize="1.6rem" />

                    <div className={classes.summary}>
                        <div>
                            <h3>Name:</h3>
                            <span>{order.name}</span>
                        </div>
                        <div>
                            <h3>Address:</h3>
                            <span>{order.address}</span>
                        </div>
                    </div>
                    <OrderItemsList order={order} />
                </div>

                <div className={classes.map}>
                    <Title title="Your Location" fontSize="1.6rem" />
                    <Map readonly={true} location={order.addressLatLng} />
                </div>

                <div className={classes.buttons_container}>
                    <div className={classes.buttons}>
                        <PaypalButtons order={order} />
                    </div>
                </div>
            </div>
    )}
        </>
    );
}
