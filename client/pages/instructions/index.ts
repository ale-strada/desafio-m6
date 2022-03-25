let imagen = require("url:../../img/fondo.png");
import { Router } from "@vaadin/router";
import { state } from "../../state";

class InstrictionsPage extends HTMLElement {
  connectedCallback() {
    this.render();
    const button = this.querySelector(".button-new");
    button.addEventListener("click", () => {
      Router.go("/game");
    });
  }

  render() {
    const cs = state.getState();
    console.log(cs, "inst");

    const localPlayer = cs.gamerName;
    const visitor = "visitante";

    this.innerHTML = `
    <style class="select-style" type="text/css">
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
            <div class="player">${localPlayer}</div>
            <div class="player visitor">${visitor}</div>
        </div>
        <div class="game-room-conteiner">
        <div class="player sala">Sala</div>
        <div class="player">${cs.roomId}</div>
        </div>
      </div>
    <titulo-comp>Piedra Papel ó Tijeras</titulo-comp>
    <texto-comp>Compartí el codigo ${cs.roomId} con tu contrincante. </texto-comp>
    <texto-comp>Presioná jugar
    y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
    </texto-comp>

    <div class="button-new">
    <button-comp class="button-jugar">¡Jugar!</button-comp>
    </div>
    
    <manos-comp></manos-comp>

    </div>
    `;
  }
}

customElements.define("instructions-page", InstrictionsPage);
