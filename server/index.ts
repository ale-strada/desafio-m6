import { baseDeDatos, rtdb } from "./db";
import * as express from "express";
import { nanoid } from "nanoid";
import * as cors from "cors";
import path = require("path");

const port = process.env.PORT || 3100;
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

// const userCollection = baseDeDatos.collection("users");
// const roomsCollection = baseDeDatos.collection("rooms");
const gamersCollection = baseDeDatos.collection("gamers");
const gameRoomsCollection = baseDeDatos.collection("game-rooms");

app.get("/hola", (req, res) => {
  res.json({
    message: "hola soy el servidor",
  });
});

app.get("/gamers/:gamerId", (req, res) => {
  const { gamerId } = req.params;
  gamersCollection
    .doc(gamerId)
    .get()
    .then((snap) => {
      const data = snap.data();
      res.json(data);
    });
});

app.post("/games/:rtdbRoomId", function (req, res) {
  var rtdbRoomId = req.body.rtdbRoomId;
  const chatRoomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/currentGame");
  chatRoomRef.push(req.body, function (err) {
    res.json("todo ok");
  });
});

app.post("/singup", (req, res) => {
  const gamerName = req.body.gamerName;
  gamersCollection
    .where("gamerName", "==", gamerName)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        gamersCollection
          .add({
            gamerName,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "user already exist",
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { gamerName } = req.body;
  gamersCollection
    .where("gamerName", "==", gamerName)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.post("/game-rooms", (req, res) => {
  const { userId } = req.body;
  gamersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("game-rooms/" + nanoid());
        roomRef
          .set({
            userId: userId,
          })
          .then(() => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);

            gameRoomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

app.get("/game-rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  gamersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        gameRoomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
