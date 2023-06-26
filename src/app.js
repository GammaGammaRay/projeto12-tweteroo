import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 5000;

const users = []
const tweets = []

app.post("/sign-in", (req, res) => {
    const { username, avatar } = req.body

    if(!username || !avatar || typeof username !== 'string' || typeof avatar !== 'string' ) {
        return res.statusCode(400).send("All fields are required")
    }

    users.push({username, avatar})
    return res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    const username = req.headers.user
    const { tweet } = req.body

    if(!users.find((user) => user.username === username)) {
        return res.status(401).send("Unauthorized attempt")
    }
    if (!tweet) {
        return res.status(400).send("All fields are required");
    }
    tweets.push({username, tweet})
    res.status(201).send("Ok")
})



app.listen(PORT, () => console.log(`Running on port ${PORT}`))