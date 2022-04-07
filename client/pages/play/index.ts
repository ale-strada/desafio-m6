import { json } from "body-parser";
import { type } from "os";
import { getLeadingCommentRanges, isJSDocEnumTag } from "typescript";
import { state } from "../../state";
import { Router } from "@vaadin/router";
let imagen = require("url:../../img/fondo.png");
type Game = {
  gamerName: string;
  choice: string;
  online: boolean;
  start: boolean;
};
class Gamepage extends HTMLElement {
  gamerName: string;
  start: boolean;
  startVisitor: boolean;
  online: boolean;
  choice: string;
  localPlayer: string;
  visit: string;
  roomId: number;
  oponente: string;
  jugada: Game;
  connectedCallback() {
    state.subscribe(() => {
      const cs = state.getState();
      this.localPlayer = cs.currentGame.jugadaLocal.gamerName;
      this.visit = cs.currentGame.jugadaVisitor.gamerName;
      this.roomId = cs.roomId;
      if (cs.visitor) {
        this.oponente = cs.currentGame.jugadaLocal.gamerName;
        this.jugada = cs.currentGame.jugadaVisitor;
        this.start = cs.currentGame.jugadaVisitor.start;
        this.startVisitor = cs.currentGame.jugadaLocal.start;
      } else {
        this.oponente = cs.currentGame.jugadaVisitor.gamerName;
        this.jugada = cs.currentGame.jugadaLocal;
        this.start = cs.currentGame.jugadaLocal.start;
        this.startVisitor = cs.currentGame.jugadaVisitor.start;
      }

      this.render();
    });

    this.render();
  }

  addListenerts() {
    const boton = this.querySelector(".button");
    const volver = this.querySelector(".button-volver");
    const piedra = this.querySelector(".piedra");
    const papel = this.querySelector(".papel");
    const tijera = this.querySelector(".tijera");
    const game = this.querySelector(".game");
    const esperando = this.querySelector(".esperando");

    boton.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      console.log(cs.currentGame);
    });
    volver.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      if (cs.visitor) {
        cs.currentGame.jugadaVisitor.start = false;
        cs.start = false;
        console.log("VISITOR");
      } else {
        cs.currentGame.jugadaLocal.start = false;
        cs.start = false;
        console.log("LOCAL SI");
      }
      state.pushGame(cs.currentGame);
      state.setState(cs);
      console.log(cs);

      Router.go("/instructions");
    });

    piedra.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      this.jugada.choice = "piedra";
    });
    papel.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      this.jugada.choice = "papel";
    });
    tijera.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      this.jugada.choice = "tijera";
    });

    // (function esperandoOponente() {
    //   console.log(this.start, this.startVisitor);

    //   // if (this.start && this.startVisitor) {
    //   //   console.log("ESTAN LOS DOS");
    //   // }
    // })();
  }
  render() {
    const cs = state.getState();
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

    <div class="game">
        <titulo-comp>GAME</titulo-comp>
        <button class="button">JUGAR</button>
        <div>
          <button class="piedra">PIE</button>
          <button class="papel">PAP</button>
          <button class="tijera">TIJ</button>
        </div>
        <button class="button-volver button">VOLVER</button>
    </div>

    <div class="esperando">
      <texto-comp>Esperando a que
        <span class="info-del-state">${this.oponente || "OPONENTE"}</span>
      presione ¡jugar!..</texto-comp>
    </div>
      `;

    this.addListenerts();
  }
}

customElements.define("game-page", Gamepage);
