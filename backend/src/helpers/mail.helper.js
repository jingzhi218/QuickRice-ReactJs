import { getClient } from "../config/mail.config.js"

export const sendEmailReceipt = function (order) {
    const mailClient = getClient();

    mailClient.messages.create(
        'sandboxae5072231f934bf897c514880501ab68.mailgun.org',
        {
            from: 'jiyu8743@gmail.com',
            to: order.user.email,
            subject: `Order ${order.id} is being processed`,
            html: getReceiptHtml(order),
        }).then(msg => console.log(msg))//success
        .catch(err => console.log(err));//fail
};

const getReceiptHtml = function (order){
    return `
    <html>
        <head>
            <style>
                table {
                    border-collapse: collapse;
                    max-width:35rem;
                    width: 100%;
                    background-color:#f8f8f8;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    border-radius: 8px
                }
                th, td{
                    text-align: left;
                    padding: 8px;
                }
                th{
                    border-bottom: 1px solid #dddddd;
                    background-color: burlywood;
                }
                tr{
                    transition: all .5s ease;
                }
                tr:hover{
                    background-color: antiquewhite;
                }
            </style>
        </head>
        <body>
            <h1>Order Payment Confirmation</h1>
            <p>Dear ${order.name},</p>
            <p>Thank you for choosing us! Your order has been successfully paid and is now being processed.</p>
            <p><strong>Tracking ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${order.createdAt
                .toISOString()
                .replace('T', ' ')
                .substr(0, 11)}</p>
                <h2>Order Details</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Item</th>
                        <th>Size</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${order.items
                        .map(
                            item =>
                            `
                            <tr>
                            <td>${item.food.name}</td>
                            <td>${item.size}</td>
                            <td>RM${item.size === 'Big' ? item.Bprice.toFixed(2) : item.food.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>    
                            <td>RM${item.price.toFixed(2)}</td>
                            </tr>
                            `
                        )
                        .join('\n')}
                    </tbody>
                    <tfoot>
                        <tr>
                        <td colspan="4"><strong>Total:</strong></td>
                        <td>RM${order.totalPrice.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <p><strong>Shipping Address:</strong> ${order.address}</p>
            </body>
      </html>
    `
}