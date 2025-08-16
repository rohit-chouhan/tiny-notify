import "./styles.css";

const DEFAULTS = {
  position: "top-right", // top-right | top-left | bottom-right | bottom-left | top-center | bottom-center
  timeout: 3000, // ms; set 0 or Infinity for sticky
  type: "info", // info | success | warning | error
  dismissible: true, // show "×"
  showProgress: true, // animated timeout bar
  maxPerPosition: 5, // auto-trim if exceeded
};

const POSITIONS = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top-center",
  "bottom-center",
];

const containers = new Map();
const state = { defaults: { ...DEFAULTS } };

function ensureContainer(position) {
  if (containers.has(position)) return containers.get(position);
  const div = document.createElement("div");
  div.className = `tn-container tn-${position}`;
  document.body.appendChild(div);
  containers.set(position, div);
  return div;
}

function clampToMax(container, max) {
  const toasts = Array.from(container.querySelectorAll(".tn-toast"));
  if (toasts.length > max) {
    const overflow = toasts.length - max;
    // Remove the oldest (first in flow for top- positions; last for bottom- positions)
    const isBottom = container.className.includes("bottom");
    for (let i = 0; i < overflow; i++) {
      const el = isBottom ? toasts[0] : toasts[toasts.length - 1];
      destroyToast(el);
    }
  }
}

function destroyToast(el) {
  if (!el || el._destroyed) return;
  el._destroyed = true;
  el.style.animation = "tn-out .15s ease-in forwards";
  const remove = () => el.remove();
  el.addEventListener("animationend", remove, { once: true });
  // Fallback in case animationend doesn't fire
  setTimeout(remove, 250);
}

function startProgress(el, ms) {
  const bar = el.querySelector(".tn-progress > span");
  if (!bar) return;
  // Duration is controlled via transition; set immediately after layout.
  requestAnimationFrame(() => {
    bar.style.transitionDuration = `${ms}ms`;
    bar.style.transform = "scaleX(0)";
  });
}

function makeToastDOM({ message, type, dismissible, showProgress }) {
  const toast = document.createElement("div");
  toast.className = `tn-toast tn-${type}`;

  const msg = document.createElement("div");
  msg.className = "tn-msg";
  msg.textContent = message;

  const close = document.createElement("button");
  close.className = "tn-x";
  close.setAttribute("aria-label", "Dismiss notification");
  close.innerHTML = "&times;";
  if (!dismissible) close.style.display = "none";

  close.addEventListener("click", () => destroyToast(toast));

  toast.appendChild(msg);
  toast.appendChild(close);

  if (showProgress) {
    const prog = document.createElement("div");
    prog.className = "tn-progress";
    const span = document.createElement("span");
    prog.appendChild(span);
    toast.appendChild(prog);
  }

  return toast;
}

function normalizeOptions(opts = {}) {
  const o = { ...state.defaults, ...opts };
  if (!POSITIONS.includes(o.position)) o.position = state.defaults.position;
  if (!["info", "success", "warning", "error"].includes(o.type))
    o.type = state.defaults.type;
  if (typeof o.timeout !== "number" || o.timeout < 0)
    o.timeout = state.defaults.timeout;
  if (typeof o.maxPerPosition !== "number" || o.maxPerPosition < 1)
    o.maxPerPosition = state.defaults.maxPerPosition;
  return o;
}

/**
 * Core show function
 */
function show(message, options = {}) {
  if (!message) return;
  const opts = normalizeOptions(options);
  const container = ensureContainer(opts.position);
  clampToMax(container, opts.maxPerPosition);

  const toast = makeToastDOM({
    message,
    type: opts.type,
    dismissible: opts.dismissible,
    showProgress:
      opts.showProgress &&
      opts.timeout &&
      isFinite(opts.timeout) &&
      opts.timeout > 0,
  });

  // Auto-hide with hover pause
  let remaining = opts.timeout;
  let timer = null;
  let start = 0;

  const startTimer = () => {
    if (!remaining || !isFinite(remaining) || remaining <= 0) return;
    start = Date.now();
    timer = setTimeout(() => destroyToast(toast), remaining);
    startProgress(toast, remaining);
  };

  const pauseTimer = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    if (remaining && start) remaining -= Date.now() - start;
    const bar = toast.querySelector(".tn-progress > span");
    if (bar) {
      const computed = getComputedStyle(bar);
      const matrix = new DOMMatrixReadOnly(computed.transform);
      const scaleX = matrix.a || 1;
      bar.style.transitionDuration = "0ms";
      bar.style.transform = `scaleX(${scaleX})`;
    }
  };

  toast.addEventListener("mouseenter", pauseTimer);
  toast.addEventListener("mouseleave", startTimer);

  // Insert and start
  container.appendChild(toast);
  startTimer();

  // Force layout so entry animation plays cleanly (in some browsers)
  void toast.offsetHeight;

  return {
    el: toast,
    close: () => destroyToast(toast),
  };
}

/** Convenience helpers */
function success(msg, options = {}) {
  return show(msg, { ...options, type: "success" });
}
function error(msg, options = {}) {
  return show(msg, { ...options, type: "error" });
}
function info(msg, options = {}) {
  return show(msg, { ...options, type: "info" });
}
function warning(msg, options = {}) {
  return show(msg, { ...options, type: "warning" });
}

/** Globally adjust defaults */
function setDefaults(next = {}) {
  state.defaults = normalizeOptions({ ...state.defaults, ...next });
}

/** Remove all toasts (optionally per position) */
function clear(position) {
  if (position && containers.has(position)) {
    containers
      .get(position)
      .querySelectorAll(".tn-toast")
      .forEach(destroyToast);
    return;
  }
  containers.forEach((c) =>
    c.querySelectorAll(".tn-toast").forEach(destroyToast)
  );
}

/** Public API (UMD default export) */
const TinyNotify = {
  show,
  success,
  error,
  info,
  warning,
  setDefaults,
  clear,
  POSITIONS,
};

export default TinyNotify;

// Auto-attach to window for script-tag usage (UMD already does this; this is just extra-friendly)
if (typeof window !== "undefined" && !window.TinyNotify) {
  window.TinyNotify = TinyNotify;
}
