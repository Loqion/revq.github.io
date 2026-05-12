const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const userId = tg?.initDataUnsafe?.user?.id || new URLSearchParams(location.search).get("user_id") || 0;

function qs(id) { return document.getElementById(id); }

async function loadState() {
  const res = await fetch(`/api/state?user_id=${encodeURIComponent(userId)}`);
  const data = await res.json();
  qs("relations-box").textContent = JSON.stringify(data.relation, null, 2);
  qs("mood-box").textContent = JSON.stringify(data.mood, null, 2);
  renderMemory(data.memory || []);
  renderDiary(data.diary || []);
}

function renderMemory(items) {
  const q = (qs("memory-search").value || "").toLowerCase();
  const list = qs("memory-list");
  list.innerHTML = "";
  items
    .filter(x => !q || (x.content || "").toLowerCase().includes(q))
    .forEach(x => {
      const el = document.createElement("div");
      el.className = "card";
      el.textContent = `[${x.memory_type}] ${x.content}\nimportance: ${x.importance}\nstatus: ${x.status}`;
      list.appendChild(el);
    });
}

function renderDiary(items) {
  const list = qs("diary-list");
  list.innerHTML = "";
  items.forEach(x => {
    const el = document.createElement("div");
    el.className = "card";
    el.textContent = `${x.title || x.kind}\n${x.content}`;
    list.appendChild(el);
  });
}

qs("reload").onclick = loadState;
qs("memory-search").oninput = () => loadState();

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tabs button").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    qs(btn.dataset.tab).classList.add("active");
  };
});

loadState();
