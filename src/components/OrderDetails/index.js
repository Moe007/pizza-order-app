import { useState } from "react"
import Input from "../Input"
import { useCart } from "@/context/CartContext"
import axios from "axios"

const OrderDetails = () => {
    const [details, setDetails] = useState({
        additionalInfo: "",
        name: "",
        contactNumber: "",
        email: "",
    })

    const { items, setItems } = useCart()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await axios.post("/api/order", { items, ...details })

        if (response.status === 201) {
            alert("Successfully placed order")
            setItems([])
            setDetails({
                additionalInfo: "",
                name: "",
                contactNumber: "",
                email: "",
            })
        }
    }

    return (
        <>
            <ul className="w-full space-y-2">
                {items.map((item, index) => (
                    <li className="flex justify-between" key={index}>
                        <div className="flex flex-col">
                            <span>Type: {item.pizzaType.name}</span>
                            <span>
                                Toppings:{" "}
                                {item.toppings.reduce(
                                    (prev, curr, index) =>
                                        index === 0
                                            ? curr.name
                                            : `${prev}, ${curr.name}`,
                                    ""
                                )}
                            </span>
                        </div>
                        <p>R{item.price.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
            <form className="space-y-2" onSubmit={handleSubmit}>
                <Input
                    id={"additional-instructions"}
                    label="Additional Instructions"
                    type="textarea"
                    value={details.additionalInfo}
                    onChange={(e) =>
                        setDetails({
                            ...details,
                            additionalInfo: e.target.value,
                        })
                    }
                />
                <Input
                    id={"name"}
                    label="Name"
                    type="text"
                    value={details.name}
                    required={true}
                    onChange={(e) =>
                        setDetails({ ...details, name: e.target.value })
                    }
                />
                <Input
                    id={"email"}
                    label="Email"
                    type="email"
                    value={details.email}
                    required={true}
                    onChange={(e) =>
                        setDetails({ ...details, email: e.target.value })
                    }
                />
                <Input
                    id={"contact"}
                    label="Contact Number"
                    type="text"
                    value={details.contactNumber}
                    required={true}
                    pattern="^(\+27|0)[0-9]{9}$"
                    onChange={(e) =>
                        setDetails({
                            ...details,
                            contactNumber: e.target.value,
                        })
                    }
                />
                <button type="submit" className="button">
                    Place Order
                </button>
            </form>
        </>
    )
}

export default OrderDetails
