import axios from "axios"
import { useState, useId } from "react"
import Select from "react-select"
import Input from "../Input"

const Order = ({ order }) => {
    const [status, setStatus] = useState(order.status)

    const [showModal, setShowModal] = useState(false)

    return (
        <div
            className={`flex justify-between rounded-md w-full p-6 cursor-pointer ${
                status === "New"
                    ? "bg-green-400"
                    : status === "In Progress"
                    ? "bg-yellow-200"
                    : "bg-blue-400"
            }`}
            onClick={() => setShowModal(!showModal)}
        >
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-40 w-full h-full bg-white opacity-30" />
                    <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 w-2/3 h-[90%] p-8 rounded-xl flex flex-col items-center space-y-4">
                        <h2 className="font-extrabold text-3xl text-black">
                            Order Details
                        </h2>

                        <ul className="w-full space-y-2">
                            {order.items.map((item, index) => (
                                <li
                                    className="flex justify-between"
                                    key={index}
                                >
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
                        <Input
                            id={"additional-instructions"}
                            label="Additional Instructions"
                            type="textarea"
                            value={order.additional_instructions}
                            disabled={true}
                        />
                        <Input
                            id={"name"}
                            label="Name"
                            type="text"
                            value={order.user_name}
                            disabled={true}
                        />
                        <Input
                            id={"email"}
                            label="Email"
                            type="email"
                            value={order.user_email}
                            disabled={true}
                        />
                        <Input
                            id={"contact"}
                            label="Contact Number"
                            type="text"
                            value={order.user_contact}
                            disabled={true}
                            pattern="^(\+27|0)[0-9]{9}$"
                        />
                    </div>
                </>
            ) : (
                ""
            )}
            <p>{order.refnum}</p>
            <div onClick={(e) => e.stopPropagation()}>
                <Select
                    defaultValue={{ value: status, label: status }}
                    options={[
                        { label: "New", value: "New" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "Ready", value: "Ready" },
                    ]}
                    instanceId={useId()}
                    onChange={async (val) => {
                        await axios.put(`/api/order/${order.ID}`, {
                            status: val.value,
                        })
                        setStatus(val.value)
                    }}
                />
            </div>
            <p>R{order.total_price.toFixed(2)}</p>
        </div>
    )
}

export default Order
