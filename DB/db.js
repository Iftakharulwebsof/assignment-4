const mongoose = require("mongoose")

const dBConnection = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
}

module.exports=dBConnection;