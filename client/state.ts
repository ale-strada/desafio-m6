const API_BASE_URL = "";
import { rtdb, ref, onValue } from "./rtdb";
import map from "lodash/map";

type Game = {
  choice: string;
  gamerName: string;
  online: boolean;
  start: boolean;
};

const state = {
  data: {
    gamerName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    games: [],
  },
  listeners: [],

  init() {
    const lastStorageState = localStorage.getItem("state");
    const cs = this.getState();
    // state.setState(JSON.parse(lastStorageState));
  },
  listenRoom() {
    const cs = this.getState();
    const gameRef = ref(rtdb, "/rooms/" + cs.rtdbRoomId);

    onValue(gameRef, (snapshot) => {
      const currentState = this.getState();
      const data = snapshot.val();
      const gamesList = map(data.currentGame);
      currentState.games = gamesList;
      this.setState(currentState);
    });
  },

  getState() {
    return this.data;
  },
  pushGame(game: Game) {
    const cs = state.getState();
    fetch(API_BASE_URL + "/currentGame/:rtdbRoomId", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        game: game,
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
      fetch(API_BASE_URL + "/gamerooms", {
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
    fetch(API_BASE_URL + "/gamerooms/" + cs.roomId + "?userId=" + cs.userId)
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
