// Funzione hash semplice (non sicura, solo per demo)
function simpleHash(str) {
  let hash = 0;
  for(let i=0; i<str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // converti in 32bit int
  }
  return hash.toString();
}

// Controlla se ci sono utenti registrati
function hasUsers() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return users.length > 0;
}

// Mostra il form di registrazione
function showRegister() {
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "block";
  document.getElementById("diary").style.display = "none";
}

// Mostra il form di login
function showLogin() {
  document.getElementById("register").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("diary").style.display = "none";
}

let currentUser = null;

// Registra un nuovo utente
function registerUser() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if(username === "" || password === "") {
    alert("Inserisci username e password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if(users.find(u => u.username === username)) {
    alert("Username già esistente, scegline un altro.");
    return;
  }

  const hashedPass = simpleHash(password);
  users.push({ username, password: hashedPass });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registrazione completata! Ora puoi fare login.");
  document.getElementById("reg-username").value = "";
  document.getElementById("reg-password").value = "";
  showLogin();
}

// Login utente
function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if(username === "" || password === "") {
    alert("Inserisci username e password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const hashedPass = simpleHash(password);

  const user = users.find(u => u.username === username && u.password === hashedPass);
  if(!user) {
    alert("Credenziali errate.");
    return;
  }

  currentUser = username;
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("diary").style.display = "block";
  loadEntries();
  document.getElementById("entry").focus();
}

// Salva un pensiero per l'utente loggato
function saveEntry() {
  if(!currentUser) return alert("Devi fare login prima.");
  const entryText = document.getElementById("entry").value.trim();
  if (!entryText) {
    alert("Scrivi qualcosa prima di salvare!");
    return;
  }
  let entries = JSON.parse(localStorage.getItem("entries_" + currentUser) || "[]");
  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  entries.push({ text: entryText, date: dateStr });
  localStorage.setItem("entries_" + currentUser, JSON.stringify(entries));
  document.getElementById("entry").value = "";
  loadEntries();
}

// Carica tutte le note dell'utente loggato
function loadEntries() {
  if(!currentUser) return;
  let entries = JSON.parse(localStorage.getItem("entries_" + currentUser) || "[]");
  const list = document.getElementById("entries");
  list.innerHTML = "";
  entries.forEach((e, i) => {
    const li = document.createElement("li");

    const dateSpan = document.createElement("span");
    dateSpan.textContent = e.date;
    dateSpan.className = "date";

    const textSpan = document.createElement("span");
    textSpan.textContent = e.text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "btn-delete";
    delBtn.title = "Elimina nota";
    delBtn.setAttribute("aria-label", `Elimina nota scritta il ${e.date}`);
    delBtn.onclick = () => {
      if (confirm("Sei sicuro di voler eliminare questa nota?")) {
        deleteEntry(i);
      }
    };

    li.appendChild(dateSpan);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Elimina nota singola
function deleteEntry(index) {
  if(!currentUser) return;
  let entries = JSON.parse(localStorage.getItem("entries_" + currentUser) || "[]");
  entries.splice(index, 1);
  localStorage.setItem("entries_" + currentUser, JSON.stringify(entries));
  loadEntries();
}

// Elimina tutte le note
function deleteAllEntries() {
  if(!currentUser) return;
  if (confirm("Sei sicuro di voler eliminare TUTTE le note?")) {
    localStorage.removeItem("entries_" + currentUser);
    loadEntries();
  }
}

function newEntry() {
  document.getElementById("entry").value = "";
  document.getElementById("entry").focus();
}

// Logout utente
function logout() {
  currentUser = null;
  document.getElementById("diary").style.display = "none";
  showLogin();
  document.getElementById("entries").innerHTML = "";
  document.getElementById("entry").value = "";
}

// Consolazione casuale
function addConsolation() {
  const phrases = [
    "Non sei solo, anche i giorni difficili passano.",
    "Un respiro profondo e tutto andrà meglio.",
    "Ogni problema è un’opportunità mascherata.",
    "Ricorda: sei più forte di quanto pensi.",
    "Datti il tempo che ti serve per guarire.",
    "Anche le stelle brillano più luminose nel buio.",
    "Sei importante e meriti momenti di serenità."
  ];
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const consolingPhrase = phrases[randomIndex];
  const textarea = document.getElementById('entry');

  if(textarea.value.trim() !== '') textarea.value += '\n\n';
  textarea.value += consolingPhrase;
  textarea.focus();
}

// Emoji picker setup
document.addEventListener('DOMContentLoaded', () => {
  // Mostra login o registrazione in base a se ci sono utenti
  if(hasUsers()) {
    showLogin();
  } else {
    showRegister();
  }

  const button = document.querySelector('#emoji-btn');
  const textarea = document.querySelector('#entry');

  const picker = new EmojiButton({
    position: 'top-end',
    autoHide: true,
    theme: 'auto',
    showPreview: false,
  });

  button.addEventListener('click', () => {
    picker.togglePicker(button);
  });

  picker.on('emoji', emoji => {
    // Inserisce emoji nel punto del cursore nel textarea
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.slice(0, start) + emoji + text.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    textarea.focus();
  });
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(() => console.log("Service Worker registrato"))
      .catch((err) => console.log("Errore Service Worker:", err));
  });
}
