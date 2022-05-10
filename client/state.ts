const API_BASE_URL = "";
import { rtdb, ref, onValue } from "./rtdb";
import map from "lodash/map";
import { Router } from "express";

const state = {
  data: {
    visitor: false,
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    gamerName: "",
    online: false,
    start: false,
    fullRoom: false,
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
    historial: [{ local: 0, visitante: 0 }],
  },

  listeners: [],

  init() {
    const lastStorageState = localStorage.getItem("state");
    const cs = this.getState();
  },
  listenRoom() {
    const cs = this.getState();
    const gameRef = ref(rtdb, "/rooms/" + cs.rtdbRoomId);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();

      const gamesList = map(data.currentGame);
      const lastGame = gamesList[gamesList.length - 1];
      // terminar de modificar para que identifique cuando hay un 3er jugador
      if (lastGame) {
        console.log(limitaJugadores());
        const currentState = state.getState();
        if (limitaJugadores()) {
          currentState.fullRoom = false;
        } else {
          currentState.fullRoom = true;
          window.alert("Sala Completa, elige la opcion 'nuevo Juego'");
        }
        const localGamer = currentState.currentGame.jugadaLocal.gamerName;
        const rtdbName = lastGame.currentGame.jugadaLocal.gamerName;
        const rtdbOnline = lastGame.currentGame.jugadaLocal.online;
        currentState.historial = lastGame.historial;
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

      function limitaJugadores() {
        const cs = state.getState();
        if (
          lastGame.currentGame.jugadaLocal.gamerName === cs.gamerName ||
          lastGame.currentGame.jugadaVisitor.gamerName === cs.gamerName
        ) {
          console.log("ES DE LA SALA");
          return true;
        } else if (
          lastGame.currentGame.jugadaLocal.gamerName === "" ||
          lastGame.currentGame.jugadaVisitor.gamerName === ""
        ) {
          console.log("SALA VACIA 2");

          return true;
        } else {
          console.log("SALA COMPLETA");
          return false;
        }
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
        historial: cs.historial,
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
    localStorage.setItem(
      "save-history",
      JSON.stringify(this.getState().historial)
    );
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
  result(currentState) {
    let resultado;
    if (currentState.miJugada === 2 && currentState.suJugada === 0) {
      resultado = "perdiste";
    } else if (currentState.miJugada === 0 && currentState.suJugada === 2) {
      resultado = "ganaste";
    } else if (currentState.miJugada === 3) {
      resultado = "Oops!!!";
    } else if (currentState.suJugada === 3) {
      resultado = "Oops!!!";
    } else if (currentState.miJugada > currentState.suJugada) {
      resultado = "ganaste";
    } else if (currentState.miJugada === currentState.suJugada) {
      resultado = "empate";
    } else {
      resultado = "perdiste";
    }
    return resultado;
  },
};
export { state };
