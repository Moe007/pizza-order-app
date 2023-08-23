import Layout from "@/components/Layout"
import Order from "@/components/Order"
import dbConnect from "@/utils/dbConnection"

const Dashboard = ({ orders }) => {
    return (
        <Layout>
            <div className="bg-slate-300 p-8 rounded-xl flex flex-col items-center justify-center space-y-4 w-2/3">
                <h1 className="font-extrabold text-3xl text-black">Orders</h1>
                <ul className="space-y-4 w-full">
                    {orders.map((order) => (
                        <li className="" key={order.ID}>
                            <Order order={order} />
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}

export const getStaticProps = async (ctx) => {
    const connection = await dbConnect()

    const [orders] = await connection.execute("SELECT * FROM orders")

    for await (const [index, order] of orders.entries()) {
        const [typesLookup] = await connection.execute(
            `SELECT order_pizza_lookup.*, pizza_types.name, pizza_types.price 
            FROM order_pizza_lookup
            INNER JOIN pizza_types ON order_pizza_lookup.pizza_type_id=pizza_types.ID
            WHERE order_pizza_lookup.order_id=${order.ID}
            `
        )
        const items = []
        for await (const t of typesLookup) {
            const [toppingsLookup] = await connection.execute(
                `SELECT order_pizza_toppings_lookup.topping_id AS ID, pizza_toppings.name, pizza_toppings.price
                FROM order_pizza_toppings_lookup 
                INNER JOIN pizza_toppings ON order_pizza_toppings_lookup.topping_id=pizza_toppings.ID 
                WHERE order_pizza_type_id=${t.ID}`
            )
            const item = {
                pizzaType: { ID: t.order_id, name: t.name, price: t.price },
                toppings: toppingsLookup,
                price: toppingsLookup.reduce(
                    (prev, curr) => prev + curr.price,
                    t.price
                ),
            }

            items.push(item)
        }
        orders[index] = {
            ...orders[index],
            order_placed: orders[index].order_placed.toString(),
            items,
        }
    }

    return {
        props: {
            orders,
        },
        revalidate: 1,
    }
}

export default Dashboard
