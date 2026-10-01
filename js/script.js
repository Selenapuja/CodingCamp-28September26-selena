const KEY_TX = "ebv_transactions";
const KEY_LIMIT = "ebv_limit";
const KEY_THEME = "ebv_theme";

let transactions = load(KEY_TX, []);
let limit = Number(load(KEY_LIMIT, 0));
let chart = null;

const form = document.getElementById("txForm");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const errorEl = document.getElementById("error");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const totalEl = document.getElementById("totalBalance");
const sortEl = document.getElementById("sort");
const limitInput = document.getElementById("limitInput");
const themeBtn = document.getElementById("themeToggle");

const COLORS = { Food: "#2ecc71", Transport: "#3498db", Fun: "#e67e22" };

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Could not save data", e);
  }
}

function formatMoney(n) {
  return "Rp " + Number(n).toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

function getSorted() {
  const copy = [...transactions];
  switch (sortEl.value) {
    case "amount-desc": return copy.sort((a, b) => b.amount - a.amount);
    case "amount-asc": return copy.sort((a, b) => a.amount - b.amount);
    case "category": return copy.sort((a, b) => a.category.localeCompare(b.category));
    default: return copy.sort((a, b) => b.id - a.id);
  }
}

function renderList() {
  listEl.innerHTML = "";
  const items = getSorted();
  emptyEl.classList.toggle("hidden", items.length > 0);

  items.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (limit > 0 && t.amount > limit ? " over" : "");

    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = t.name;
    const price = document.createElement("div");
    price.className = "price";
    price.textContent = formatMoney(t.amount);
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = t.category;
    info.append(name, price, tag);

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => deleteTransaction(t.id));

    li.append(info, del);
    listEl.appendChild(li);
  });
}

function renderTotal() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalEl.textContent = formatMoney(total);
}

function renderChart() {
  const categories = ["Food", "Transport", "Fun"];
  const data = categories.map((c) =>
    transactions.filter((t) => t.category === c).reduce((s, t) => s + t.amount, 0)
  );

  if (!window.Chart) return;

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
    return;
  }

  chart = new Chart(document.getElementById("chart"), {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{ data, backgroundColor: categories.map((c) => COLORS[c]), borderWidth: 1 }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } },
  });
}

function render() {
  renderList();
  renderTotal();
  renderChart();
}

function addTransaction(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (!(name && !isNaN(amount) && category)) {
    errorEl.textContent = "Please fill in item name, amount, and category.";
    return;
  }
  if (amount <= 0) {
    errorEl.textContent = "Amount must be greater than 0.";
    return;
  }

  errorEl.textContent = "";
  transactions.push({ id: Date.now(), name, amount, category });
  save(KEY_TX, transactions);
  form.reset();
  render();
}
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save(KEY_TX, transactions);
  render();
}
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  save(KEY_THEME, theme);
}

form.addEventListener("submit", addTransaction);
sortEl.addEventListener("change", renderList);

limitInput.addEventListener("input", () => {
  limit = Number(limitInput.value);
  save(KEY_LIMIT, limit);
  renderList();
});

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

limitInput.value = limit > 0 ? limit : "";
setTheme(load(KEY_THEME, "light"));
render();