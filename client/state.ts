const API_BASE_URL = "";
import { rtdb, ref, onValue } from "./rtdb";
import map from "lodash/map";

const state = {
  data: {
    visitor: false,
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    gamerName: "",
    online: false,
    start: false,
    choice: "",
    currentGame: {
      userId: "",
      jugadaLocal: {
        gamerName: "",
        choice: "",
        online: false,
        start: false,
      },
      oponentID: "",
      jugadaVisitor: {
        gamerName: "",
        choice: "",
        online: false,
        start: false,
      },
    },
  },
  historial: [],
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
      const lastGame = gamesList[gamesList.length - 1];
      if (lastGame) {
        const currentState = state.getState();
        const localGamer = currentState.currentGame.jugadaLocal.gamerName;
        const rtdbName = lastGame.currentGame.jugadaLocal.gamerName;
        const rtdbOnline = lastGame.currentGame.jugadaLocal.online;
        if (localGamer == rtdbName && rtdbOnline) {
          currentState.currentGame = lastGame.currentGame;
        } else {
          currentState.currentGame.jugadaLocal =
            lastGame.currentGame.jugadaLocal;
          currentState.currentGame.userId = lastGame.currentGame.userId;
          currentState.visitor = true;
          currentState.currentGame.jugadaVisitor.gamerName =
            currentState.gamerName;
        }

        this.setState(currentState);
      } else {
        console.log("SALA VACIA");
      }
    });
  },

  getState() {
    return this.data;
  },
  pushGame(currentGame) {
    const cs = state.getState();
    fetch(API_BASE_URL + "/currentGame/:rtdbRoomId", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        currentGame: currentGame,
        rtdbRoomId: cs.rtdbRoomId,
      }),
    });
  },
  setGamerName(gamerName: string) {
    const cs = this.getState();

    cs.currentGame.jugadaLocal.gamerName = gamerName;
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
    if (cs.currentGame.jugadaLocal.gamerName) {
      fetch(API_BASE_URL + "/singup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamerName: cs.currentGame.jugadaLocal.gamerName,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          cs.currentGame.userId = data.id;
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
    if (cs.currentGame.jugadaLocal.gamerName) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          gamerName: cs.currentGame.jugadaLocal.gamerName,
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
