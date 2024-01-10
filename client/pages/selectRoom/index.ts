import { state } from "../../state";
import { Router } from "@vaadin/router";
let imagen = require("url:../../img/fondo.png");

class SelectRoomPage extends HTMLElement {
	connectedCallback() {
		this.render();

		const form = this.querySelector(".select-room-form");

		form &&
			form.addEventListener("submit", (e) => {
				e.preventDefault();
				const cs = state.getState();
				const target = e.target as any;

				cs.roomId = target.RoomId.value;
				cs.currentGame.jugadaLocal.online = true;
				cs.online = true;
				state.setState(cs);

				state.accessToRoom(() => {
					state.listenRoom();
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
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      }
      manos-comp{
        position: absolute;
        bottom: 0px;
        margin:0 auto;
      }
    </style>
    <div class="conteiner">
      <titulo-comp>Piedra Papel o Tijeta</titulo-comp>
      <form class = "select-room-form form">
    
      <div>
        <input class="input" type="number" name ="RoomId" placeholder="CODIGO">
        </div>
        <button class="button">Ingresar a Sala</button>
      </form>
      <manos-comp class="manos-comp"></manos-comp>
     </div>
    `;
		// this.connectedCallback();
	}
}

customElements.define("select-room-page", SelectRoomPage);
