import { Router } from "@vaadin/router";
import { state } from "../../state";
let imagen = require("url:../../img/fondo.png");

class WelcomePage extends HTMLElement {
	connectedCallback() {
		this.render();
		const form = this.querySelector(".ingreso");
		const singUp = this.querySelector(".button-sign-up");

		const buttonNew = this.querySelector(".button-new");
		const buttonGameRoom = this.querySelector(".button-gameroom");

		buttonNew &&
			buttonNew.addEventListener("click", (e) => {
				e.preventDefault();
				const cs = state.getState();
				Router.go("/selectPlayers");
			});

		buttonGameRoom &&
			buttonGameRoom.addEventListener("click", (e) => {
				e.preventDefault();
				Router.go("/selectRoom");
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

      .button-new, .button-gameroom{
        width: 560px;
      }
    </style>
    <div class="conteiner">

    <titulo-comp>Piedra Papel ó Tijeras</titulo-comp>
    
    <div class="button-new">
    <button-comp>Nuevo Juego</button-comp>
    </div>

    <div class="button-gameroom">
    <button-comp>ingresar a una sala</button-comp>
    </div>
    
    <manos-comp class="manos-comp"></manos-comp>

    </div>
    `;
	}
}

customElements.define("welcome-page", WelcomePage);
