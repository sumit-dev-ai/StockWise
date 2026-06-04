import app from "./app";
import { env } from "./config/env";
import { testDbConnection } from "./config/db";

const startServer = async () => {
  try {
    await testDbConnection();  

    app.listen(Number(env.port), () => {  
      console.log(`StockWise backend is running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();