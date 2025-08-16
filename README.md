# 🔔 Tiny Notify

Super lightweight, dependency-free **toast/notification system** for the web.  

---

## 🚀 Features

- ✅ Zero dependencies, ultra-lightweight
- ✅ Multiple positions (`top-right`, `bottom-left`, `top-center`, etc.)
- ✅ Toast types: **info, success, warning, error**
- ✅ Auto-dismiss with configurable timeout
- ✅ Sticky toasts (`timeout: 0` or `Infinity`)
- ✅ Hover to pause, dismiss button
- ✅ Progress bar option
- ✅ Limit max toasts per position
- ✅ Works with **CDN** or **bundlers**

---

## 📦 Installation

### 1. Use in a bundler (ESM/TypeScript)

```bash
npm install tiny-notify
```
Import in your app:
```js
import TinyNotify from "tiny-notify";

TinyNotify.success("Hello from bundler!", 
    { 
        position: "bottom-right", 
        timeout: 2500
    }
);
```

### 1. Use in CDN (for plain HTML)

```html
<script src="https://cdn.jsdelivr.net/gh/rohit-chouhan/tiny-notify/dist/tiny-notify.js"></script>
```

Now TinyNotify is available globally:
```html
<button onclick="TinyNotify.success('Saved successfully!', { position: 'top-right', timeout: 2000 })">
  Show Success
</button>
```

## ⚡ Usage Examples

### Basic Example
```js
TinyNotify.show("Hello World!");
```

### Different Types
```js
TinyNotify.success("Operation successful!");
TinyNotify.error("Something went wrong...");
TinyNotify.info("Here is some info");
TinyNotify.warning("Be careful!");
```

### Options
```js
TinyNotify.show("Custom notification", {
  type: "info",          // success | error | warning | info
  position: "bottom-left", // top-right | top-left | bottom-right | bottom-left | top-center | bottom-center
  timeout: 4000,         // ms; 0 or Infinity = sticky
  dismissible: true,     // show × button
  showProgress: true,    // progress bar
  maxPerPosition: 3      // auto-trim old toasts
});
```

### Set Defaults (globally)
```js
TinyNotify.setDefaults({
  position: "top-right",
  timeout: 3000,
  maxPerPosition: 4
});
```

### Clear All
```js
TinyNotify.clear(); // removes all toasts
```

## Demo
👉 Live Playground [https://tiny-notify.js.org/](https://tiny-notify.js.org/)


# Copyright and License

> Copyright © 2025 **[Rohit Chouhan](https://rohitchouhan.com)**. Licensed under the _[MIT LICENSE](https://github.com/rohit-chouhan/tiny-notify/blob/main/LICENSE)_.