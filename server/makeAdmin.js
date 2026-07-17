require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function promoteAdmin() {
    try {
        // 1. Connect to the database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database...");

        // 2. Update all users to be admins
        const result = await User.updateMany({}, { $set: { isAdmin: true } });

        console.log(`Success! Made ${result.modifiedCount} user(s) an Admin.`);

        // 3. Disconnect
        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

promoteAdmin();