import { state } from "../../state";
import { Router } from "@vaadin/router";
let imagen = require("url:../../img/fondo.png");

class SelectPlayersPage extends HTMLElement {
  connectedCallback() {
    this.render();

    const buttonOnePlayer = this.querySelector(".one-player");
    const buttonTwoPlayers = this.querySelector(".two-players");

    buttonOnePlayer.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("1 player");
      Router.go("/instructions");
    });
    buttonTwoPlayers.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("2 player");

      state.askNewRoom(() => {
        state.accessToRoom(() => {
          state.listenRoom();
        });
      });
      Router.go("/instructions");
    });
  }
  render() {
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
    </style>
    <div class="conteiner">
      <titulo-comp>Piedra Papel o Tijeta</titulo-comp>
      <button-comp class="one-player">1 Player</button-comp>
      <button-comp class="two-players">2 Players</button-comp>
      <manos-comp></manos-comp>
     </div>
    `;
  }
}

customElements.define("select-players-page", SelectPlayersPage);
