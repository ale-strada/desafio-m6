import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/welcome", component: "welcome-page" },
  { path: "/selectRoom", component: "select-room-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/play", component: "play" },
  { path: "/selectPlayers", component: "select-players-page" },
]);
