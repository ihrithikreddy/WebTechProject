const driver = require("../config/db");

exports.saveGame = async (req, res) => {
  const session = driver.session({ database: "neo4j" });

  const { playerX, playerO, winner, moves, timeTaken } = req.body;

  try {

    await session.run(
      `CREATE (g:Game {
        playerX:$playerX,
        playerO:$playerO,
        winner:$winner,
        moves:$moves,
        timeTaken:$timeTaken
      })`,
      { playerX, playerO, winner, moves, timeTaken }
    );

    res.json({ message: "Game saved successfully in Neo4j" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving game" });

  } finally {
    await session.close();
  }
};