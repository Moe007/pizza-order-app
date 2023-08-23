import mysql from "mysql2/promise"

async function dbConnect() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOSTNAME,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    })

    // if (process.env.NODE_ENV === "production") {
    //     connection = await mysql.createConnection({
    //         host: process.env.DB_HOSTNAME,
    //         database: process.env.DB_NAME,
    //         user: process.env.DB_USER,
    //         password: process.env.DB_PASSWORD,
    //     })
    // } else {
    //     /**
    //      * Global is used here to maintain a cached connection across hot reloads
    //      * in development. This prevents connections growing exponentially
    //      * during API Route usage.
    //      */
    //     if (!global.conn) {
    //         global.conn = await mysql.createConnection({
    //             host: process.env.DB_HOSTNAME,
    //             database: process.env.DB_NAME,
    //             user: process.env.DB_USER,
    //             password: process.env.DB_PASSWORD,
    //         })
    //     }
    //     connection = global.conn
    // }

    return connection
}

export default dbConnect
