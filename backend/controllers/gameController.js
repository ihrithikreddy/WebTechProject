const Game = require("../models/game");

exports.saveGame = async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.json({ message: "Game saved" });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getHistory = async (req, res) => {
    const games = await Game.find().sort({date:-1}).limit(10);
    res.json(games);
};

exports.getLeaderboard = async (req, res) => {

    const leaderboard = await Game.aggregate([
        { $match: { winner: { $ne: "Draw" } } },
        {
            $group: {
                _id: "$winner",
                wins: { $sum: 1 }
            }
        },
        { $sort: { wins: -1 } }
    ]);

    res.json(leaderboard);
};

exports.fastestWin = async (req, res) => {

    const game = await Game.findOne().sort({ duration: 1 });

    res.json(game);
};