import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body;

    if (!username || !avatar || typeof username !== 'string' || typeof avatar !== 'string') {
        return res.status(400).send("All fields are required");
    }

    users.push({ username, avatar });
    return res.status(201).send("OK/CREATED");
});

app.post("/tweets", (req, res) => {
    const username = req.headers.user;
    const { tweet } = req.body;

    if (!users.find((user) => user.username === username)) {
        return res.status(401).send("UNAUTHORIZED");
    }
    if (!tweet || typeof tweet !== 'string') {
        return res.status(400).send("All fields are required");
    }
    tweets.push({ username, tweet });
    res.status(201).send("OK/CREATED");
});

app.get("/tweets", (req, res) => {
    let page = parseInt(req.query.page, 10) || 1;

    if (page < 1 || isNaN(page)) {
        return res.status(400).send("Page is not valid");
    }

    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;

    const indexedTweets = tweets.slice(startIndex, endIndex).map((tweet) => ({
        username: tweet.username,
        avatar: users.find((user) => user.username === tweet.username).avatar,
        tweet: tweet.tweet,
    }));

    res.send(indexedTweets);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));