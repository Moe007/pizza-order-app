import dbConnect from "@/utils/dbConnection"
import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import OrderForm from "@/components/OrderForm"
import { useCart } from "@/context/CartContext"
import OrderDetails from "@/components/OrderDetails"

export default function Home({ toppings, pizzaTypes }) {
    const [formData, setFormData] = useState({
        pizzaType: "",
        toppings: [],
    })

    const [pizzaPrice, setPizzaPrice] = useState(0)

    const { items, setItems } = useCart()

    useEffect(() => {
        setFormData({ ...formData, pizzaType: pizzaTypes[0].ID })
    }, [])

    useEffect(() => {
        const pizzaTypePrice = pizzaTypes.find(
            (pizzaType) => formData.pizzaType === pizzaType.ID
        )?.price
        const toppingsPrices = toppings.filter((topping) =>
            formData.toppings.includes(topping.ID)
        )
        const totalToppings = toppingsPrices.reduce(
            (prev, curr) => prev + curr.price,
            0
        )

        setPizzaPrice(pizzaTypePrice + totalToppings)
    }, [formData, setFormData])

    const addToOrder = () => {
        setOrder([
            ...order,
            {
                pizzaType: pizzaTypes.find(
                    (pizzaType) => pizzaType.ID === formData.pizzaType
                ),
                toppings: toppings.filter((topping) =>
                    formData.toppings.includes(topping.ID)
                ),
                price: pizzaPrice,
            },
        ])
        setFormData({ pizzaType: pizzaTypes[0].ID, toppings: [] })

        setPizzaPrice(0)
    }

    return (
        <Layout>
            <div className="flex space-x-8">
                <div className="bg-slate-300 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
                    <h1 className="font-extrabold text-3xl text-black">
                        Place Order
                    </h1>
                    <OrderForm pizzaTypes={pizzaTypes} toppings={toppings} />
                </div>
                <div className="bg-slate-300 p-8 rounded-xl flex flex-col items-center justify-center space-y-4 h-fit">
                    <h2 className="font-extrabold text-3xl text-black">
                        Order Details
                    </h2>

                    <OrderDetails />
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps(ctx) {
    const connection = await dbConnect()

    const [toppings] = await connection.execute(
        "SELECT * FROM `pizza_toppings`"
    )
    const [pizzaTypes] = await connection.execute("SELECT * FROM `pizza_types`")

    return {
        props: {
            toppings,
            pizzaTypes,
        },
        revalidate: 1,
    }
}
