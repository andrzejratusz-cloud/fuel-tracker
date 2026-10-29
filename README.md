# Fuel Tracker — PWA

## Instalacja na iPhonie

1. Rozpakuj paczkę. Umieść CAŁĄ zawartość katalogu FuelTrackerHTML na statycznym hostingu HTTPS. Nie są potrzebne baza danych, API ani proces budowania. Zachowaj jeden stały adres.
2. Otwórz adres index.html w Safari na iPhonie, mając połączenie z internetem.
3. W ustawieniach Fuel Tracker sprawdź status „Gotowa do pracy offline”.
4. W Safari wybierz Udostępnij → Dodaj do ekranu początkowego. Jeżeli widoczna jest opcja „Otwórz jako aplikację”, pozostaw ją włączoną.
5. Uruchom nową ikonę, jeszcze z internetem, i poczekaj na status gotowości offline w ustawieniach. Następnie sprawdź ponowne otwarcie i dodanie wpisu w trybie samolotowym.

Nie opublikowano aplikacji. Lokalny adres file:// jest podglądem HTML i nie obsługuje service workera ani instalacji PWA. Na komputerze można testować przez http://localhost. Zwykły adres HTTP komputera w sieci Wi-Fi nie zastępuje HTTPS na iPhonie.

Źródła: https://support.apple.com/en-gb/guide/iphone/iphea86e5236/27/ios/27 oraz https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

## Przeniesienie dotychczasowych danych

Przed zmianą adresu lub instalacją wykonaj eksport danych w starej wersji. W aplikacji otwartej z ekranu początkowego wybierz import. Import wymaga potwierdzenia i zastępuje wszystkie dane. Nie zakładaj, że Safari i zainstalowana aplikacja współdzielą zapisy. Format kopii HTML i PWA jest taki sam; wcześniejsza aplikacja Swift ma inny format.

## Offline i prywatność

Service worker zapisuje wyłącznie kod, manifest i ikony w Cache Storage. Tankowania, samochody, limit i obraz karty pozostają w localStorage na urządzeniu. Nie są wysyłane na hosting. Pierwsze wczytanie i sprawdzanie aktualizacji pobierają pliki aplikacji z hostingu. Wybrany hosting może zapisywać standardowe logi dostępu, np. adres IP. Aplikacja nie ma kont, analityki ani synchronizacji.

Regularnie eksportuj kopię. localStorage i Cache Storage mogą zostać usunięte przez użytkownika lub system; PWA nie daje gwarancji trwałości danych jak osobny plik kopii. Kopia CSV nie jest szyfrowana. Czyszczenie danych strony lub zmiana domeny może usunąć dostęp do zapisów. Systemowa aplikacja Pliki może korzystać z chmury, jeśli wybierzesz ją jako miejsce eksportu.

## Aktualizacje i hosting

Publikuj razem index.html, pwa.js, sw.js, manifest.webmanifest oraz icons/. Przy każdej zmianie plików zwiększ VERSION w sw.js (np. v1 na v2). Nowa wersja przygotowuje oddzielną pamięć podręczną, czeka na zamknięcie wszystkich okien starej aplikacji i dopiero wtedy się aktywuje. Nie wymusza odświeżenia otwartego formularza i nie usuwa localStorage.

Dla sw.js zalecany nagłówek Cache-Control: no-cache oraz Content-Type: application/javascript. Dla manifestu application/manifest+json. Nie przekierowuj nieistniejących plików do HTML. Hosting wymagający logowania może ograniczać instalację i odświeżanie PWA; do tej aplikacji wystarczy zwykły hosting statycznych plików HTTPS. Nie umieszczaj kopii JSON ani danych użytkownika w publikowanym katalogu.

## Funkcje

Wspólny miesięczny limit wszystkich aut, tankowania i inne wydatki, edycja/usuwanie, zmiana aktywnego samochodu, karta lojalnościowa, historia i statystyki, eksport/import. Limit można zmieniać od bieżącego lub przyszłego miesiąca; wcześniejsze miesiące zachowują poprzednią wartość. Statystyki dotyczą całej historii aktywnego auta. Spalanie to suma litrów pomiędzy pełnymi tankowaniami podzielona przez dystans razy 100, z uwzględnieniem częściowych tankowań; średnia jest ważona dystansem. Inne wydatki nie wpływają na spalanie i dystans.

## Weryfikacja

Sprawdzono składnię skryptów, manifest, rozmiary ikon PNG, obecność 7 plików buforowanych, instalację i aktywację service workera w modelu testowym, nawigację i odczyt zasobów bez sieci oraz izolację pamięci podręcznej między ścieżkami. Poprzednio sprawdzono logikę aplikacji i lokalny zapis. Nie wykonano testu w rzeczywistym Safari ani instalacji na urządzeniu. Testy service workera były symulacją API w Node, nie testem przeglądarkowym.

## Aktualizacja v2

Historia aktywnego samochodu znajduje się na dole Podsumowania (cała historia, od najnowszych wpisów); osobna zakładka Historia została usunięta. Formularz tankowania pokazuje cenę za litr obliczaną na żywo jako koszt / litry, także przy edycji. Puste lub zerowe litry nie generują wyniku. Kolor paska zmienia się płynnie: zielony przy początku, pomarańczowy przy 50%, czerwony przy 100% i przekroczeniu limitu. Wersja pamięci PWA: v2. Format danych bez zmian. Sprawdzono składnię i 12 kontroli renderowania/logiki w modelu DOM; nie wykonano testu na iPhonie.

## Aktualizacja v5 — kolory, limity i CSV

W ustawieniach wybierz domyślną wersję kolorystyczną. Przy dodawaniu lub edycji samochodu przypisz mu własny kolor albo wybierz kolor domyślny. Kolory interfejsu odpowiadają aktywnemu samochodowi.

Limit wspólny dla aut zmienia się od wybranego miesiąca do kolejnej zaplanowanej zmiany. Nie można ustawiać zmian od minionego miesiąca. Dotychczasowy limit stanowi podstawę dla historii; aplikacja nie może odtworzyć starszych limitów, których poprzednia wersja nie zapisywała.

Eksport to CSV UTF-8 z BOM i separatorem średnikowym. Plik nie zawiera ID. Wiersze typu wpis można edytować, usuwać i dopisywać; samochód jest rozpoznawany po unikalnej nazwie. Nowa nazwa we wpisie tworzy samochód. Daty: RRRR-MM-DD, rodzaj: tankowanie lub wydatek, do_pelna: tak lub nie. Kwoty i litry mogą zawierać kropkę lub przecinek dziesiętny. Zachowaj wszystkie kolumny oraz wiersze ustawienia, samochod, limit i karta, aby zachować pełną kopię. Wiersz ustawienia zawiera domyślny kolor, bazowy limit i nazwę aktywnego auta w kolumnie wartosc. Wiersz karta zawiera obraz karty, którego nie trzeba edytować.

Import zastępuje cały zbiór danych po potwierdzeniu; ponowny import nie dopisuje duplikatów. ID są generowane automatycznie. Stare kopie JSON nadal można importować. Importowana pełna kopia przywraca także zapisaną w niej historię limitów.

Walidacja v5: 25 kontroli logiki i obsługi formularzy w modelu DOM (Node), w tym historia limitów, migracja starej kopii, kolory samochodów i CSV z wieloma liniami, polskimi znakami oraz nowymi wpisami bez ID. Brak testu w rzeczywistym Safari/iPhonie.
