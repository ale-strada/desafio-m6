let imagen = require("url:../../img/fondo.png");
import { Router } from "@vaadin/router";
import { stat } from "fs";
import { addListener } from "process";
import { state } from "../../state";

class InstrictionsPage extends HTMLElement {
  localPlayer: string;
  visit: string;
  roomId: number;
  start: boolean;
  visitor: boolean;
  oponentName: string;

  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      this.localPlayer = cs.currentGame.jugadaLocal.gamerName;
      this.roomId = cs.roomId;
      this.start = false;
      this.visitor = cs.visitor;
      if (cs.visitor) {
        this.visit = cs.gamerName;
      } else {
        this.visit = cs.currentGame.jugadaVisitor.gamerName;
      }
      this.render();
    });
    this.render();
  }
  addListenerts() {
    const cs = state.getState();

    const codigoSala = this.querySelector(".codigo");
    const instruccionFinal = this.querySelector(".instruccion-final");
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

    (function ocultarCodigo() {
      instruccionFinal.classList.add("none");
      setTimeout(() => {
        codigoSala.classList.add("none");
        instruccionFinal.classList.remove("none");
      }, 6000);
    })();

    // const cs = state.getState();
    if (this.visitor) {
      cs.currentGame.jugadaVisitor.gamerName = cs.gamerName;
      cs.currentGame.jugadaVisitor.online = cs.online;
      cs.currentGame.oponentID = cs.userId;
      return cs;
    }
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
            <div class="player visitor">${this.visit || "oponente"}</div>
        </div>
        <div class="game-room-conteiner">
        <div class="player sala">Sala</div>
        <div class="player">${this.roomId}</div>
        </div>
      </div>
    <titulo-comp>Piedra Papel ó Tijeras</titulo-comp>
    <texto-comp class="codigo">Compartí el codigo:
    <span class="info-del-state">${this.roomId}</span>
     con tu contrincante. </texto-comp>
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
