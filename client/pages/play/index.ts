import { state } from "../../state";
type Game = {
  chioce: string;
  gamerName: string;
  online: boolean;
  start: boolean;
};

class Gamepage extends HTMLElement {
  games: Game[] = [];

  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.games = currentState.games;

      this.render();
    });

    this.render();
  }

  addListenerts() {
    const boton = this.querySelector(".button");

    boton.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      state.pushGame({
        choice: "piedra",
        gamerName: "ale",
        online: true,
        start: true,
      });
      console.log(this.games);
    });
  }
  render() {
    const cs = state.getState();
    this.innerHTML = `
      <titulo-comp>GAME</titulo-comp>
      <button class="button">JUGAR</button>
      <div>${this.games} </div>
      `;
    //     <style class="select-style" type="text/css">
    //     .messages {
    //       display: flex;
    //       flex-direction: column;
    //       margin: 20px;
    //      }
    //      .message-comp{
    //       align-self: end;
    //      }

    //    </style>
    //     <titulo-comp>Chat</titulo-comp>
    //     <h3 class="titulo label">${"room id:" + cs.roomId}</h3>
    //     <div>
    //      <div class="messages">
    //         ${this.games
    //           .map((m) => {
    //             const message = {
    //               quien: m.from,
    //               que: m.message,
    //             };
    //             let messageClass = "";
    //             if (message.quien === cs.fullName) {
    //               messageClass = "message-comp";
    //             }
    //             return `<message-comp class= ${messageClass}>
    //             ${JSON.stringify(message)}
    //               </message-comp>`;
    //           })
    //           .join("")}
    //      </div>
    //      </div>

    //      <div>
    //      <form class="submit-message form">
    //         <input class="input" type="text" name ="new-message">
    //         <button class="button">Enviar</button>
    //      </form>
    //     </div>
    //        `;
    this.addListenerts();
  }
}

customElements.define("game-page", Gamepage);
