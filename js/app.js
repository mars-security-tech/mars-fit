// Entry point: router + render de vistas MĀRS FIT
import { getState, setState, updateProfile, subscribe, reset } from "./store.js";
import { renderOnboarding } from "./views/onboarding.js";
import { renderHome } from "./views/home.js";
import { renderWorkout } from "./views/workout.js";
import { renderNutrition } from "./views/nutrition.js";
import { renderCircle } from "./views/circle.js";
import { renderProfile } from "./views/profile.js";

const app = document.getElementById("app");
const topbar = document.getElementById("topbar");
const tabbar = document.getElementById("tabbar");
const brandMode = document.getElementById("brand-mode");
const topbarAvatar = document.getElementById("topbar-avatar");
const topbarAdd = document.getElementById("topbar-add");

const routes = {
  home: renderHome,
  workout: renderWorkout,
  nutrition: renderNutrition,
  circle: renderCircle,
  profile: renderProfile
};

let currentRoute = "home";
let cleanupFn = null;

export function navigate(route) {
  currentRoute = route;
  render();
}

function render() {
  // cleanup previous view (dispose 3D, etc.)
  if (cleanupFn) { try { cleanupFn(); } catch(e){} cleanupFn = null; }

  const state = getState();

  if (!state.onboarded) {
    topbar.classList.add("hidden");
    tabbar.classList.add("hidden");
    cleanupFn = renderOnboarding(app, () => { setState({ onboarded: true }); navigate("home"); });
    return;
  }

  topbar.classList.remove("hidden");
  tabbar.classList.remove("hidden");

  // Mode badge (civil / operativo)
  const isOp = state.profile.role === "operativo";
  brandMode.textContent = isOp ? "OPERATIVO" : "CIVIL";
  brandMode.classList.toggle("operativo", isOp);

  // Avatar chip with user initials
  const name = state.profile.name || "U";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (topbarAvatar) topbarAvatar.textContent = initials;

  // Active tab
  tabbar.querySelectorAll(".tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.route === currentRoute);
  });

  const fn = routes[currentRoute] || renderHome;
  cleanupFn = fn(app, { navigate });
}

// Tab clicks
tabbar.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  navigate(btn.dataset.route);
});

// Topbar quick actions
if (topbarAdd) topbarAdd.onclick = () => navigate("workout");
if (topbarAvatar) topbarAvatar.onclick = () => navigate("profile");

// Re-render on state changes from outside
subscribe(() => {
  // Mode badge update
  const isOp = getState().profile.role === "operativo";
  brandMode.textContent = isOp ? "OPERATIVO" : "CIVIL";
  brandMode.classList.toggle("operativo", isOp);
});

// Expose for debug
window.__marsfit = { getState, setState, reset, navigate };

// Register service worker (best-effort)
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

render();
