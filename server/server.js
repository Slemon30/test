const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const http = require("http");
const cors = require("cors");
const { log } = require("console");

app.use(cors());

const server = http.createServer(app);
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const messageSchema = new mongoose.Schema({
    room: String,
    author: String,
    message: String,
    time: String
});
const Message = mongoose.model('Message', messageSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

const roomSchema = new mongoose.Schema({
    author: String,
    room_id: String,
    issue: String
});
const Room = mongoose.model('Room', roomSchema);



app.get('/test', (req, res) => {
    console.log('Hello from Express.js');
    res.send('Hello from Express.js');
});

app.post('/get_rooms', async (req, res) => {
    try {
        const { username } = req.body;
        const rooms = await Room.find({ author: username }).distinct('room_id');
        console.log(rooms);
        res.json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8);
}

app.post('/add_issue', async (req, res) => {
    console.log(req.body);
    // const { author, issue } = req.body;
    try {
        const newRoom = new Room({ room_id: generateRoomId(), author: req.body.author, issue: req.body.issue });
        await newRoom.save();
        res.json({ success: true, message: 'Issue added successfully' });
    } catch (error) {
        console.error('Error adding issue:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post("/fetch_messages", async (req, res) => {
    console.log('Received : ', req.body);

    const { room } = req.body;
    try {
        const messages = await Message.find({ room });
        console.log(messages);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

app.post('/add_message', async (req, res) => {
    const { room, author, message } = req.body;
    const time = getCurrentTime();
    try {
        const newMessage = new Message({ room, author, message, time });
        await newMessage.save();
        res.status(200).send('Message added successfully');
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Username already exists' });
        } else {
            const newUser = new User({ username, password });
            await newUser.save();
            res.status(201).json({ success: true, message: 'User signed up successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

const PORT = 3;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
