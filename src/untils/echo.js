import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Dùng WebSocket Pusher
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "fe1c0e32755be3371c56",           // 🔁 Thay bằng key thật của bạn
  cluster: "ap1",                   // 🔁 Cụm (cluster) bạn chọn trong Pusher (ví dụ: ap1)
  forceTLS: true,
  disableStats: true,
  encrypted: true,
});

export default echo;
