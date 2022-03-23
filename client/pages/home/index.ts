import { Router } from "@vaadin/router";
import { state } from "../../state";
let imagen = require("url:../../img/fondo.png");

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = this.querySelector(".ingreso");

    form.addEventListener("submit", (e) => {
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
    });
  }
  render() {
    this.innerHTML = `
    <style class="select-style" type="text/css">
    .conteiner {
      background-image:url(${imagen});
      background-repeat: round;
      padding-top: 90px;
      padding-bottom: 0px;
      margin-bottom:0px
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
        <manos-comp></manos-comp>
    </div>
    `;
  }
}

customElements.define("home-page", Home);
