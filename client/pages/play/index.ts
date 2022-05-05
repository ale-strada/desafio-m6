import { json } from "body-parser";
import { type } from "os";
import { getLeadingCommentRanges, isJSDocEnumTag } from "typescript";
import { state } from "../../state";
import { Router } from "@vaadin/router";
let imagen = require("url:../../img/fondo.png");

class Gamepage extends HTMLElement {
  localPlayer: string;
  visit: string;
  roomId: number;

  connectedCallback() {
    const cs = state.getState();
    this.localPlayer = cs.currentGame.jugadaLocal.gamerName;
    this.visit = cs.currentGame.jugadaVisitor.gamerName;
    this.roomId = cs.roomId;

    this.render();
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
          <div class="player visitor">${this.visit || "oponente"}</div>
        </div>
        <div class="game-room-conteiner">
          <div class="player sala">Sala</div>
          <div class="player">${this.roomId}</div>
        </div>
      </div>
   

      <div class="game">
        <countdown-comp class="cuenta"></countdown-comp>
        <manos-play></manos-play>
      </div>
    </div>
      `;
  }
}

customElements.define("game-page", Gamepage);
