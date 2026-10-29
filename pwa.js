'use strict';
(() => {
 let installPrompt = null;
 let status = 'Przygotowywanie trybu offline…';
 const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
 const section = document.createElement('div');
 section.className = 'panel';
 section.style.marginTop = '18px';
 section.innerHTML = '<h3>Aplikacja PWA</h3><p class="help" id="pwaStatus" role="status"></p><div class="actions"><button class="primary" id="pwaInstall" hidden>Zainstaluj aplikację</button></div><p class="help">iPhone: otwórz adres HTTPS w Safari → Udostępnij → Dodaj do ekranu początkowego. Jeśli pojawi się opcja „Otwórz jako aplikację”, pozostaw ją włączoną. Następnie uruchom ikonę z ekranu i poczekaj na komunikat gotowości offline.</p><p class="help">Przed przejściem z pliku HTML lub innego adresu wyeksportuj dane, a potem zaimportuj je w zainstalowanej aplikacji. Przeglądarka i aplikacja mogą korzystać z oddzielnych danych. Nie usuwaj danych przeglądarki bez kopii.</p>';
 function update() {
   if (!section.isConnected) document.getElementById('settings').append(section);
   section.querySelector('#pwaStatus').textContent = (standalone() ? 'Uruchomiono jako aplikację. ' : '') + status;
   section.querySelector('#pwaInstall').hidden = !installPrompt || standalone();
 }
 // Existing app renders settings after each data change. Reattach only when needed.
 const observer = new MutationObserver(() => { if (!section.isConnected) update(); });
 observer.observe(document.getElementById('settings'), {childList:true});
 section.querySelector('#pwaInstall').onclick = async () => {
   if (!installPrompt) return;
   const prompt = installPrompt; installPrompt = null; update();
   try { await prompt.prompt(); await prompt.userChoice; } catch { /* Installation remains optional. */ }
 };
 window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; update(); });
 window.addEventListener('appinstalled', () => { installPrompt = null; update(); });
 async function init() {
   if (location.protocol === 'file:') {
     status = 'Podgląd z pliku: instalacja i pamięć offline PWA wymagają HTTPS (lub localhost na komputerze). Dane i funkcje HTML nadal działają lokalnie.';
     update(); return;
   }
   if (!window.isSecureContext || !('serviceWorker' in navigator)) {
     status = 'Ta przeglądarka lub adres nie obsługuje trybu PWA. Otwórz aplikację przez HTTPS w aktualnym Safari, Chrome lub Edge.';
     update(); return;
   }
   try {
     const registration = await navigator.serviceWorker.register('./sw.js', {scope:'./', updateViaCache:'none'});
     function watch(worker) {
       if (!worker) return;
       worker.addEventListener('statechange', () => {
         if (worker.state === 'redundant' && !registration.active) {status = 'Nie udało się przygotować plików offline. Sprawdź połączenie i otwórz aplikację ponownie.';update();}
         if (worker.state === 'installed' && registration.active) {status = 'Aktualizacja gotowa. Zamknij wszystkie okna aplikacji i uruchom ją ponownie. Dane pozostaną zapisane.';update();}
       });
     }
     watch(registration.installing);
     registration.addEventListener('updatefound', () => watch(registration.installing));
     await navigator.serviceWorker.ready;
     status = registration.waiting ? 'Aktualizacja gotowa. Zamknij wszystkie okna aplikacji i uruchom ponownie.' : 'Gotowa do pracy offline. Tankowania, wydatki i karta działają bez internetu. Regularnie eksportuj kopię.';
     update();
   } catch (error) {
     status = 'Nie udało się włączyć trybu offline. Sprawdź HTTPS oraz dostępność plików aplikacji i odśwież stronę.';
     update();
   }
 }
 update(); init();
})();
