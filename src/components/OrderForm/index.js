import { useState, useEffect } from "react"
import Input from "../Input"
import { useCart } from "@/context/CartContext"

const OrderForm = ({ toppings, pizzaTypes }) => {
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
        if (formData.toppings.length > 0) {
            setItems([
                ...items,
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
        } else {
            alert("Please select at least one topping.")
        }
    }
    return (
        <>
            <div className="flex space-x-8">
                <div className="">
                    <h3 className="font-semibold">Select a pizza type: </h3>
                    <ul>
                        {pizzaTypes.map((pizzaType, index) => (
                            <li key={pizzaType.ID}>
                                <Input
                                    id={pizzaType.ID}
                                    label={`${
                                        pizzaType.name
                                    } (R${pizzaType.price.toFixed(2)})`}
                                    type="radio"
                                    name="pizza-types"
                                    value={pizzaType.ID}
                                    className={
                                        "flex items-center justify-between"
                                    }
                                    inpClass={"h-3 w-3"}
                                    lblClass={"w-full"}
                                    checked={
                                        pizzaType.ID === formData.pizzaType
                                    }
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            pizzaType: Number(e.target.value),
                                        })
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold ">Select Pizza Toppings:</h3>
                    <ul>
                        {toppings.map((topping) => (
                            <li key={topping.ID}>
                                <Input
                                    id={topping.ID}
                                    label={`${
                                        topping.name
                                    } (R${topping.price.toFixed(2)})`}
                                    type="checkbox"
                                    value={topping.ID}
                                    className={
                                        "flex items-center justify-between"
                                    }
                                    inpClass={"h-3 w-3"}
                                    lblClass={"w-full"}
                                    checked={formData.toppings.includes(
                                        topping.ID
                                    )}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            toppings: e.target.checked
                                                ? [
                                                      ...formData.toppings,
                                                      Number(e.target.value),
                                                  ]
                                                : formData.toppings.filter(
                                                      (t) =>
                                                          t !==
                                                          Number(e.target.value)
                                                  ),
                                        })
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className="button" onClick={addToOrder}>
                Add Pizza to Order (R{pizzaPrice.toFixed(2)})
            </button>
        </>
    )
}

export default OrderForm
