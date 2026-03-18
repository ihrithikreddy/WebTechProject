const neo4j = require("neo4j-driver");
const { getDriver } = require("../config/db");

const saveGame = async (req, res) => {
  const { playerX, playerO, winner, moves, timeTaken } = req.body;

  if (!playerX || !playerO || !winner || moves === undefined || timeTaken === undefined) {
    return res.status(400).json({ error: "Missing required game data" });
  }

  const session = getDriver().session();   // ← changed

  try {
    const result = await session.run(
      `
      MERGE (px:Player {name: $playerX})
      ON CREATE SET px.createdAt = timestamp()

      MERGE (po:Player {name: $playerO})
      ON CREATE SET po.createdAt = timestamp()

      CREATE (g:Game {
        id:        randomUUID(),
        winner:    $winner,
        moves:     $moves,
        timeTaken: $timeTaken,
        playedAt:  timestamp()
      })

      CREATE (px)-[:PLAYED_AS_X]->(g)
      CREATE (po)-[:PLAYED_AS_O]->(g)

      WITH px, po, g
      FOREACH (_ IN CASE WHEN $winner = $playerX THEN [1] ELSE [] END |
        CREATE (px)-[:WON]->(g)
      )
      FOREACH (_ IN CASE WHEN $winner = $playerO THEN [1] ELSE [] END |
        CREATE (po)-[:WON]->(g)
      )
      FOREACH (_ IN CASE WHEN $winner = 'Draw' THEN [1] ELSE [] END |
        CREATE (g)-[:ENDED_IN_DRAW]->(:DrawResult {recordedAt: timestamp()})
      )

      RETURN g.id AS gameId
      `,
      {
        playerX,
        playerO,
        winner,
        moves:     neo4j.int(moves),
        timeTaken: neo4j.int(timeTaken),
      }
    );

    res.status(201).json({
      message: "Game saved successfully",
      gameId:  result.records[0].get("gameId"),
      playerX,
      playerO,
      winner,
    });

  } catch (error) {
    console.error("Error saving game:", error);
    res.status(500).json({ error: "Failed to save game to Neo4j" });

  } finally {
    await session.close();
  }
};

const getHistory = async (req, res) => {
  const session = getDriver().session();   // ← changed

  try {
    const result = await session.run(
      `
      MATCH (px:Player)-[:PLAYED_AS_X]->(g:Game)<-[:PLAYED_AS_O]-(po:Player)
      RETURN
        px.name     AS playerX,
        po.name     AS playerO,
        g.winner    AS winner,
        g.moves     AS moves,
        g.timeTaken AS timeTaken,
        g.playedAt  AS playedAt
      ORDER BY g.playedAt DESC
      LIMIT 20
      `
    );

    const history = result.records.map((record) => ({
      playerX:   record.get("playerX"),
      playerO:   record.get("playerO"),
      winner:    record.get("winner"),
      moves:     record.get("moves"),
      timeTaken: record.get("timeTaken"),
      playedAt:  record.get("playedAt"),
    }));

    res.status(200).json(history);

  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch game history" });

  } finally {
    await session.close();
  }
};

module.exports = { saveGame, getHistory };