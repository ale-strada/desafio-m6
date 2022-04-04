let imagen = require("url:../../img/fondo.png");
import { Router } from "@vaadin/router";
import { addListener } from "process";
import { state } from "../../state";
type Game = {
  userId: string;
  jugadaLocal: {
    gamerName: string;
    choice: string;
    online: boolean;
    start: boolean;
  };
  oponentID: string;
  jugadaVisitor: {
    gamerName: string;
    choice: string;
    online: boolean;
    start: boolean;
  };
};
class InstrictionsPage extends HTMLElement {
  localPlayer: string;
  visit: string;
  roomId: number;
  start: boolean;
  visitor: boolean;

  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      this.localPlayer = cs.currentGame.jugadaLocal.gamerName;
      this.visit = cs.currentGame.jugadaVisitor.gamerName;
      this.roomId = cs.roomId;
      this.start = cs.currentGame.jugadaLocal.start;
      this.visitor = cs.visitor;
      console.log(this.visit, "visitante");

      this.render();
    });

    this.render();
  }
  addListenerts() {
    const button = this.querySelector(".button-new");
    button.addEventListener("click", () => {
      const cs = state.getState();
      this.start = true;
      if (this.visitor) {
        cs.currentGame.jugadaVisitor.start = this.start;
      } else {
        cs.currentGame.jugadaLocal.start = this.start;
      }
      state.pushGame(cs.currentGame);
      Router.go("/game");
    });
    const codigoSala = this.querySelector(".codigo");
    const instruccionFinal = this.querySelector(".instruccion-final");

    (function ocultarCodigo() {
      instruccionFinal.classList.add("none");
      setTimeout(() => {
        codigoSala.classList.add("none");
        instruccionFinal.classList.remove("none");
      }, 6000);
    })();

    const cs = state.getState();
    if (this.visitor) {
      cs.currentGame.jugadaVisitor.gamerName = cs.gamerName;
      cs.currentGame.jugadaVisitor.online = cs.online;
      cs.currentGame.oponentID = cs.userId;
      return cs;
    }
    console.log(cs, "VIENDO");
  }

  render() {
    this.innerHTML = `
    <style class="select-style" type="text/css">
    .none{
      display:none;
    }
    .conteiner {
      background-image:url(${imagen});
      background-repeat: round;
      padding-top: 115px;
      padding-bottom: 0px;
      padding-left:auto;
      padding-rigth:auto;
      margin-bottom:0px
      }
      .header{
        display: flex;
        justify-content: space-between;
        margin: 0 30px;
      }
      .player{
        font-family: 'Source Serif Pro';
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
      }
      .game-room-conteiner{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .sala{
        font-weight: 900;
        font-size: 30px;
      }
      .visitor{
        color: red;
      }
    </style>
    <div class="conteiner">
      <div class="header">
        <div class="players-conteiner">
            <div class="player">${this.localPlayer}</div>
            <div class="player visitor">${this.visit}</div>
        </div>
        <div class="game-room-conteiner">
        <div class="player sala">Sala</div>
        <div class="player">${this.roomId}</div>
        </div>
      </div>
    <titulo-comp>Piedra Papel ó Tijeras</titulo-comp>
    <texto-comp class="codigo">Compartí el codigo: ${this.roomId} con tu contrincante. </texto-comp>
    <texto-comp class="instruccion-final">Presioná jugar
    y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
    </texto-comp>

    <div class="button-new">
    <button-comp class="button-jugar">¡Jugar!</button-comp>
    </div>
    
    <manos-comp></manos-comp>

    </div>
    `;
    this.addListenerts();
  }
}

customElements.define("instructions-page", InstrictionsPage);
