require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./config/seed");

const PORT = process.env.PORT || 5000;

const startServer = async () => {

  try {

    await connectDB();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error(error);
    process.exit(1);

  }

};

startServer();