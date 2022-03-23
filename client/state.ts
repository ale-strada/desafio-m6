const API_BASE_URL = "";
import { rtdb, ref, onValue } from "./rtdb";
import map from "lodash/map";
// import { json } from "stream/consumers";

// type Message = {
//   from: string;
//   message: string;
// };

type Game = {
  choice: string;
  name: string;
  online: boolean;
  start: boolean;
};

const state = {
  data: {
    gamerName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    game: {
      choice: "",
      online: "",
      start: "",
    },
  },
  listeners: [],
  init() {
    const lastStorageState = localStorage.getItem("state");
    const cs = this.getState();
    // state.setState(JSON.parse(lastStorageState));
  },
  listenRoom() {
    // console.log("listenroom");

    const cs = this.getState();
    const mensajeRef = ref(rtdb, "/rooms/" + cs.rtdbRoomId);

    onValue(mensajeRef, (snapshot) => {
      const currentState = this.getState();
      const messagesFromServer = snapshot.val();
      // console.log(messagesFromServer);

      // const messagesList = map(messagesFromServer.messages);

      // currentState.messages = messagesList;
      this.setState(currentState);
    });
  },
  getState() {
    return this.data;
  },
  setNombre(name: string) {
    const currentState = this.getState();
    currentState.name = name;
    this.setState(currentState);
  },
  // setEmail(email: string) {
  //   const currentState = this.getState();
  //   currentState.email = email;
  //   this.setState(currentState);
  // },
  pushMessage(message: string) {
    const cs = state.getState();
    const nombreDelState = this.data.fullName;
    fetch(API_BASE_URL + "/messages/:rtdbRoomId", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: nombreDelState,
        message: message,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    });
  },
  setGamerName(gamerName: string) {
    const cs = this.getState();

    cs.gamerName = gamerName;
    this.setState(cs);
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("soy el state, he cambiado", this.getState());
  },
  signUp(callback?) {
    const cs = this.getState();
    if (cs.gamerName) {
      fetch(API_BASE_URL + "/singup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamerName: cs.gamerName,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un nombre en el state");
      callback(true);
    }
  },
  singIn(callback?) {
    const cs = this.getState();
    if (cs.gamerName) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ gamerName: cs.gamerName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un nombre en el state");
      callback(true);
    }
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      // console.log(cs.userId);
      fetch(API_BASE_URL + "/game-rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("no hay user id");
    }
  },
  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = this.roomId;
    fetch(API_BASE_URL + "/game-rooms/" + cs.roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};
export { state };
