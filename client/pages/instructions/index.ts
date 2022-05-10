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
  startVisitor: boolean;
  visitor: boolean;
  oponentName: string;
  fullRoom: boolean;
  connectedCallback() {
    const cs = state.getState();
    this.localPlayer = cs.gamerName;
    if (cs.roomId === 1210) {
      this.roomId = 1210;
      this.startVisitor = true;
      this.oponentName = "PC";
      this.visit = "PC";
    }
    state.subscribe(() => {
      const cs = state.getState();
      this.localPlayer = cs.currentGame.jugadaLocal.gamerName;
      this.roomId = cs.roomId;
      this.visitor = cs.visitor;
      this.fullRoom = cs.fullRoom;

      if (cs.visitor) {
        this.visit = cs.gamerName;
        this.start = cs.currentGame.jugadaVisitor.start;
        this.startVisitor = cs.currentGame.jugadaLocal.start;
        this.oponentName = cs.currentGame.jugadaLocal.gamerName;
      } else {
        this.visit = cs.currentGame.jugadaVisitor.gamerName;
        this.start = cs.currentGame.jugadaLocal.start;
        this.startVisitor = cs.currentGame.jugadaVisitor.start;
        this.oponentName = cs.currentGame.jugadaVisitor.gamerName;
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
    const buttonSalir = this.querySelector(".button-salir");
    const esperando = this.querySelector(".esperando");
    const instucctions = this.querySelector(".instructions-conteiner");

    (() => {
      if (this.start && this.startVisitor) {
        // ambos start
        Router.go("/game");
      } else if (this.start) {
        // start solo yo
        instucctions.classList.add("none");
        esperando.innerHTML = `
        <texto-comp>Esperando a que
        <span class="info-del-state">${this.oponentName || "OPONENTE"}</span>
        presione ¡jugar!..</texto-comp> 
        `;
      } else {
        esperando.innerHTML = ``;
      }
    })();

    (() => {
      if (cs.fullRoom) {
        Router.go("/");
      }
    })();

    button.addEventListener("click", () => {
      const cs = state.getState();
      this.start = true;
      if (this.visitor) {
        cs.currentGame.jugadaVisitor.start = this.start;
      } else {
        cs.currentGame.jugadaLocal.start = this.start;
      }
      state.setState(cs);
      state.pushGame(cs.currentGame);
    });

    buttonSalir.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      if (cs.visitor) {
        cs.currentGame.jugadaVisitor.start = false;
        cs.currentGame.jugadaVisitor.online = false;
        cs.currentGame.jugadaVisitor.choice = "";
        cs.start = false;
        cs.online = false;
      } else {
        cs.currentGame.jugadaLocal.start = false;
        cs.currentGame.jugadaLocal.online = false;
        cs.currentGame.jugadaLocal.choice = "";
        cs.start = false;
        cs.online = false;
      }
      state.pushGame(cs.currentGame);
      state.setState(cs);
      Router.go("/");
    });

    (function ocultarCodigo() {
      instruccionFinal.classList.add("none");
      setTimeout(() => {
        codigoSala.classList.add("none");
        instruccionFinal.classList.remove("none");
      }, 6000);
    })();

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

    <div class="instructions-conteiner">
      <texto-comp class="codigo">Compartí el codigo:
      <span class="info-del-state">${this.roomId || ""}</span>
      con tu contrincante. </texto-comp>
      <texto-comp class="instruccion-final">Presioná jugar
      y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
      </texto-comp>
    
      <div class="button-new">
        <button-comp class="button-jugar">¡Jugar!</button-comp>
      </div>
      
        <button-comp class="button-salir">Salir del juego</button-comp>
      
    
      <manos-comp></manos-comp>
    </div>
    <div class="esperando"></div>

    </div>
    `;
    this.addListenerts();
  }
}

customElements.define("instructions-page", InstrictionsPage);
