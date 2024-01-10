import { state } from "../../state";
import { Router } from "@vaadin/router";
let imagen = require("url:../../img/fondo.png");

class SelectPlayersPage extends HTMLElement {
	connectedCallback() {
		this.render();

		const buttonOnePlayer = this.querySelector(".one-player");
		const buttonTwoPlayers = this.querySelector(".two-players");

		buttonOnePlayer &&
			buttonOnePlayer.addEventListener("click", (e) => {
				e.preventDefault();
				const cs = state.getState();
				cs.currentGame.jugadaLocal.online = true;
				cs.online = true;
				cs.currentGame.jugadaVisitor.gamerName = "PC";
				cs.currentGame.jugadaVisitor.online = true;
				cs.currentGame.jugadaVisitor.start = true;
				cs.roomId = 1210;
				localStorage.setItem("room-1210", JSON.stringify(state.getState()));
				state.setState(cs);

				Router.go("/instructions");
			});
		buttonTwoPlayers &&
			buttonTwoPlayers.addEventListener("click", (e) => {
				e.preventDefault();
				const cs = state.getState();
				cs.currentGame.jugadaLocal.online = true;
				cs.online = true;
				state.setState(cs);
				state.askNewRoom(() => {
					state.accessToRoom(() => {
						state.listenRoom();
					});
				});
				state.pushGame(cs.currentGame);
				Router.go("/instructions");
			});
	}
	render() {
		this.innerHTML = `
    <style class="select-style" type="text/css">
    .conteiner {
      background-image:url(${imagen});
      background-repeat: round;
      padding-top: 50px;
      padding-bottom: 0px;
      margin-bottom:0px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      }
      
      .manos-comp{
        position: absolute;
        bottom: 0px;
        margin:0 auto;
      }

      .one-player, .two-players{
        width: 560px;
      }
    </style>
    <div class="conteiner">
      <titulo-comp>Piedra Papel o Tijeta</titulo-comp>
      <button-comp class="one-player">1 Player</button-comp>
      <button-comp class="two-players">2 Players</button-comp>
      <manos-comp class="manos-comp"></manos-comp>
     </div>
    `;
	}
}

customElements.define("select-players-page", SelectPlayersPage);
