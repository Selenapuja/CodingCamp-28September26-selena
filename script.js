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
  limit = Number(limitInput.value) || 0;
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