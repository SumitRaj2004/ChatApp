import express from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
config();
import hbs from "hbs";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from "http";

const app = express()
const server = http.createServer(app)
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on("sendUser", (user) => {
        socket.broadcast.emit("setUser", user)
    })
    socket.on("sendMsg", (msg, user) => {
        socket.emit("setOutgoingMsg", msg, user);
        socket.broadcast.emit("setIncomingMsg", msg, user)
    })
    socket.on("leave", (user) => {
        socket.on("disconnect", () => {
            io.emit("leftUser", user)
        })
    })
})



const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "./public");
app.use(express.static(publicPath))
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.set("view engine", "hbs")

app.get("/", (req, res) => {
    res.render("index")
})

server.listen(process.env.PORT, () => {
    console.log(`server started to listening to request on port ${process.env.PORT}`)
})