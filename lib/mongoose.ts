import { connect, set } from 'mongoose'

let isConnected = false // Variable to track the connection status

export const connectDB = async () => {
    // Set strict query mode for Mongoose to prevent unknown field queries.
    set('strictQuery', true)

    if(!process.env.MONGODB_URL) {
        return console.log('Missing MongoDB URL')
    }
    // If the connection is already established, return without creating a new connection.
    if(isConnected) {
        console.log('MongoDB connection already established')
        return
    }

    try {
        await connect(process.env.MONGODB_URL)
        isConnected = true // Set the connection status to true
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}