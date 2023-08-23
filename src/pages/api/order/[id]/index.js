import dbConnect from "@/utils/dbConnection"

export default async function handler(req, res) {
    switch (req.method) {
        case "PUT":
            try {
                const connection = await dbConnect()

                const { id } = req.query
                const { status } = req.body

                await connection.execute(
                    `UPDATE orders SET status = '${status}' WHERE ID = ${id}`
                )

                return res.status(200).json({ message: "success" })
            } catch (error) {
                return res.json(error)
            }
        default:
            return res.status(400).end()
    }
}
