import { Router } from "@vaadin/router";
import { state } from "../../state";
let imagen = require("url:../../img/fondo.png");

class Home extends HTMLElement {
	connectedCallback() {
		const cs = state.getState();
		if (cs.fullRoom) {
			location.reload();
		}
		this.render();
	}
	addListenerts() {
		const form = this.querySelector(".ingreso");

		form
			? form.addEventListener("submit", (e) => {
					e.preventDefault();
					const cs = state.getState();
					const target = e.target as any;
					state.setGamerName(target.gamerName.value);

					state.signUp(() => {
						state.singIn((err) => {
							if (err) console.log("hubo un error en el signIn");
						});
					});

					Router.go("/welcome");
			  })
			: false;
	}
	render() {
		this.innerHTML = `
    <style class="select-style" type="text/css">
    .conteiner {
      background-image:url(${imagen});
      padding-top: 50px;
      padding-bottom: 0px;
      margin-bottom:0px;
      height: 100vh;
      }
      .manos-comp{
        position: absolute;
        bottom: 0px;
      }
    </style>
  
    <div class="conteiner">
      <titulo-comp>Piedra Papel o Tijeras</titulo-comp>

      <div class="conteiner-box">
        <form class = "ingreso form form">
          <div class="conteiner-box">
            <label class="label">Tu Nombre</label>
          </div>
          <input class="input" type="text" name = "gamerName">
  
          <button class="button">Comenzar</button>
        </form>
        <manos-comp class="manos-comp"></manos-comp>
    </div>
    `;
		this.addListenerts();
	}
}

customElements.define("home-page", Home);
