import "./pages/welcome";
import "./pages/home";
import "./pages/selectRoom";
import "./pages/selectPlayers";
import "./pages/instructions";
import "./pages/play";
import "./router";
import { state } from "./state";
import { initTitle } from "./components/titulo";
import { initButton } from "./components/boton";
import { initManos } from "./components/manos";
import { initManosPlay } from "./components/manos/manosplay";
import { initTexto } from "./components/texto-instructions";
import { initCountdown } from "./components/countdown";

(function () {
  state.init();
  console.log("INIT");

  initTitle();
  initButton();
  initManos();
  initManosPlay();
  initTexto();
  initCountdown();
})();
