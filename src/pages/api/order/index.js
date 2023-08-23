import dbConnect from "@/utils/dbConnection"

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            try {
                const connection = await dbConnect()

                const validPrices = []

                for await (const item of req.body.items) {
                    const toppingIds = item.toppings.map(
                        (topping) => topping.ID
                    )

                    const pizzaTypePriceQuery = `
                        SELECT SUM(price) AS total_price
                        FROM pizza_types
                        WHERE ID=${item.pizzaType.ID} 
                    `

                    const pizzaToppingPriceQuery = `
                        SELECT SUM(price) AS total_price
                        FROM pizza_toppings 
                        WHERE ID IN (${toppingIds.join(",")})`

                    const [pizzaTypePrice] = await connection.execute(
                        pizzaTypePriceQuery
                    )
                    const [pizzaToppingPrice] = await connection.execute(
                        pizzaToppingPriceQuery
                    )
                    const totalPrice =
                        pizzaTypePrice[0].total_price +
                        pizzaToppingPrice[0].total_price

                    validPrices.push(totalPrice)
                }

                const refnum = `#ref${Date.now() + Math.random()}`
                const totalPrice = validPrices.reduce(
                    (prev, curr) => prev + curr,
                    0
                )

                const insertOrderQuery = `
                INSERT INTO orders (refnum, user_name, user_email, user_contact, additional_instructions, total_price)
                    VALUES ('${refnum}', '${req.body.name}', '${req.body.email}', '${req.body.contactNumber}', '${req.body.additionalInfo}', ${totalPrice});
                `

                const getOrderIdQuery = `SELECT ID FROM orders WHERE ID=LAST_INSERT_ID()`

                const insertPTypeLookupQ = `INSERT INTO order_pizza_lookup (order_id, pizza_type_id)
                                    VALUES ${req.body.items
                                        .map(
                                            (item) =>
                                                `(LAST_INSERT_ID(),${item.pizzaType.ID})`
                                        )
                                        .join(",")}`

                await connection.execute(insertOrderQuery)

                const [order] = await connection.execute(getOrderIdQuery)

                await connection.execute(insertPTypeLookupQ)

                const getPTypeLookupQ = `SELECT ID FROM order_pizza_lookup WHERE order_id=${order[0].ID}`

                const [pTypeLookup] = await connection.execute(getPTypeLookupQ)

                for await (const [index, row] of pTypeLookup.entries()) {
                    await connection.execute(`
                    INSERT INTO order_pizza_toppings_lookup (order_pizza_type_id, topping_id)
                        VALUES ${req.body.items[index].toppings
                            .map((topping) => `(${row.ID},${topping.ID})`)
                            .join(",")}
                    `)
                }

                return res.status(201).json({ message: "success" })
            } catch (error) {
                return res.json(error)
            }
        default:
            return res.status(404).end()
    }
}
