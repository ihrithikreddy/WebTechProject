const neo4j = require("neo4j-driver");

let driver;

const connectDB = async () => {
  const uri      = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

  try {
    await driver.verifyConnectivity();
    console.log("Connected to Neo4j AuraDB successfully ✅");
  } catch (error) {
    console.error("Neo4j connection failed:", error.message);
    process.exit(1);
  }
};

const getDriver = () => driver;

module.exports = { connectDB, getDriver };