/* script.js - handle guestbook using localStorage */
(function(){
  const LS_KEY = 'paskibra_visitors_v1';
  const guestsEl = document.getElementById('guests');
  const form = document.getElementById('guest-form');
  const input = document.getElementById('guest-name');
  const clearBtn = document.getElementById('clear-guests');
  const yearEl = document.getElementById('year');

  yearEl.textContent = new Date().getFullYear();

  function loadGuests(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(!raw) return [];
      return JSON.parse(raw) || [];
    }catch(e){
      console.error('Failed to load guests', e);
      return [];
    }
  }

  function saveGuests(list){
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  function renderGuests(){
    const list = loadGuests();
    guestsEl.innerHTML = '';
    if(list.length === 0){
      const li = document.createElement('li');
      li.textContent = 'Belum ada pengunjung.';
      guestsEl.appendChild(li);
      return;
    }
    list.forEach((g, idx) => {
      const li = document.createElement('li');
      const time = new Date(g.ts).toLocaleString();
      li.textContent = `${g.name} — ${time}`;
      guestsEl.appendChild(li);
    });
  }

  function addGuest(name){
    const list = loadGuests();
    const entry = { name: name.trim(), ts: Date.now() };
    list.unshift(entry); // newest first
    saveGuests(list);
    renderGuests();
  }

  function clearGuests(){
    if(!confirm('Hapus semua data pengunjung?')) return;
    localStorage.removeItem(LS_KEY);
    renderGuests();
  }

  // form submit
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = input.value || '';
    if(name.trim().length < 2){
      alert('Nama terlalu pendek.');
      return;
    }
    addGuest(name);
    input.value = '';
    input.blur();
  });

  // buttons
  clearBtn.addEventListener('click', clearGuests);

  // initial render
  renderGuests();

  // For convenience: auto-focus input on mobile when scrolling to guestbook via URL hash
  if(location.hash === '#guestbook'){ setTimeout(()=> input.focus(), 400) }
})();