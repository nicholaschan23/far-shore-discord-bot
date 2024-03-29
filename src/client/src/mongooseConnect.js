const mongoose = require("mongoose");
const mongoURI = process.env.DATABASE_URI;

async function mongooseConnect() {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on("error", (error) => {
        console.error("[ERROR] [mongooseConnect] MongoDB connection error:", error);

        // Handle connection timeout error
        if (error.code === 'UND_ERR_CONNECT_TIMEOUT') {
            console.log("[INFO] [mongooseConnect] Reconnecting to MongoDB...");
            mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        }
    });

    db.once("open", () => {
        console.log("[INFO] [mongooseConnect] MongoDB connected");
    });

    // Listen for the process exit event
    process.on("exit", () => {
        // Close the Mongoose connection before exiting
        mongoose.connection.close();
        console.log("[INFO] [mongooseConnect] MongoDB connection closed");
    });

    // Handle process termination signals (e.g., Ctrl+C)
    process.on("SIGINT", () => {
        // Close the Mongoose connection when the process is terminated
        mongoose.connection.close();
        console.log("[INFO] [mongooseConnect] MongoDB connection closed due to process termination");
        process.exit(0); // Exit the process gracefully
    });
}

async function getConnectionStatus() {
    switch (mongoose.connection.readyState) {
        case 0:
            return "Disconnected";
        case 1:
            return "Connected";
        case 2:
            return "Connecting";
        case 3:
            return "Disconnecting";
        default:
            return "Something went wrong retrieving database connection status.";
    }
}

module.exports = mongooseConnect;
