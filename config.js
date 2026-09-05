// =============================================================================
// KONFIGURACJA STRONY DLA OLIWII ❤️
// Możesz tu łatwo zmienić dowolny tekst, datę, zdjęcia lub pytania w quizie!
// =============================================================================

window.CONFIG = {
  // Imię i nagłówki
  herName: "Oliwii",
  title: "Dla Oliwii ✨",
  counterMessage: "Krótko, ale każdy od czegoś zaczynał...",

  // DATA ROZPOCZĘCIA ZWIĄZKU (Format: RRRR-MM-DDTHH:MM:SS)
  // Wczorajsza data (możesz zmienić dokładną godzinę, np. '2026-09-04T20:00:00')
  startDate: "2026-09-04T20:00:00",

  // MUZYKA W TLE (Airplanes gra jako pierwsze!)
  music: [
    {
      title: "Airplanes ✈️",
      fullTitle: "B.o.B - Airplanes (feat. Hayley Williams)",
      src: "assets/airplanes.m4a"
    },
    {
      title: "Stereo Hearts 📻",
      fullTitle: "Gym Class Heroes - Stereo Hearts (ft. Adam Levine)",
      src: "assets/stereo_hearts.m4a"
    },
    {
      title: "Self Aware 🎧",
      fullTitle: "Temper City - Self Aware",
      src: "assets/self_aware.m4a"
    }
  ],

  // WIRTUALNY LIST / WIADOMOŚĆ
  letter: {
    title: "Hejka Oliwka... ❤️",
    paragraphs: [
      "Wiem, że to dopiero początek naszej wspólnej drogi, ale każda chwila z Tobą od samego początku jest po prostu zajebista.",
      "Tak naprawdę już od pierwszego spotkania bardzo chciałem, żeby wyszło z tego coś znacznie więcej niż tylko zwykła znajomość. Masz przepiękny uśmiech, który jak tylko zobaczę, potrafi rozjaśnić nawet najbardziej pochmurny dzień.",
      "Spotkania i rozmowy z Tobą zlatują dosłownie w ułamku sekundy, bo przy nikim innym tak super mi się nie rozmawia. Stworzyłem tę stronę specjalnie dla nas, żebyśmy w każdej chwili mogli zerknąć, jak bije nasz licznik i jak szybko leci nam ten czas spędzony razem.",
      "Mam ogromną nadzieję, że ta nasza wspólna droga będzie po prostu cudowna – pełna kolejnych przygód, wspólnych wspomnień i co najważniejsze... całej masy uśmiechu! 🥰"
    ],
    sign: "Maks ❤️",
    ps: "P.S. Zerknij na piosenki w prawym górnym rogu – wybrałem 3, które najbardziej kojarzą mi się z Tobą haha! I zobacz też koniecznie naszą galerię wspomnień poniżej 🎶📸"
  },

  // GALERIA ZDJĘĆ
  // Możesz wrzucić swoje zdjęcia do folderu 'assets/' i wpisać tu ich nazwy np. 'assets/nasze1.jpg'
  // Domyślnie ustawione są klimatyczne grafiki ilustracyjne
  gallery: [
    {
      url: "assets/yyyy_fairs.png",
      caption: "yyyy fairs",
      date: ""
    },
    {
      url: "assets/pierwsze_zdjecie.jpg",
      caption: "Chyba nasze pierwsze wspólne zdjęcie (chyba). 🎱❤️",
      date: "Początki ✨"
    },
    {
      url: "assets/manekin.jpg",
      caption: "To było chyba po twoim zdaniu egzaminu wewnętrznego. Wziąłem sobie złego naleśnika a tobie wziąłem herbatę 🤨",
      date: ""
    },
    {
      url: "assets/dart.jpg",
      caption: "Pamiętam była lampa jak chuj. Tutaj dart i pokazałaś mi tego chińczyka",
      date: ""
    },
    {
      url: "assets/naleczow1.jpg",
      images: [
        "assets/naleczow1.jpg",
        "assets/naleczow2.jpg",
        "assets/naleczow3.jpg",
        "assets/naleczow4.jpg",
        "assets/naleczow5.jpg"
      ],
      caption: "Pojechaliśmy do Nałęczowa coś około po półtorej tygodnia od darta. Nałęczów zasysa ale z tobą było fajnie. yy najlepsza pizza w mieście u PAWŁOWSKICH",
      date: ""
    },
    {
      url: "assets/jarmark.jpg",
      caption: "Tu był ten jarmark bodajże. Pamiętam jakąś sekte co walczyli żeby panśtwa G7 czegoś tam nie robiły. Szkoda że nie medytowaliśmy razem z nimi. Jedzenie z chiszy wywołuje u mnie rewolucje żołądkowe😔",
      date: ""
    },
    {
      url: "assets/randka1.jpg",
      images: [
        "assets/randka1.jpg",
        "assets/randka2.jpg",
        "assets/randka3.jpg"
      ],
      caption: "Pierwsza taka w sumie poważna randka. było zajebiście. I w sumie no można by powiedzieć, że tutaj zaczął się nasz związek😉",
      date: ""
    }
  ],

  // MINI-QUIZ O WAS
  quiz: [
    {
      question: "Jaką kobietę trafiłem we wczorajszym blind boxie z UFC? 🥊",
      options: [
        "Joanna Jędrzejczyk",
        "Amanda Nunes",
        "Ronda Rousey",
        "Valentina Shevchenko"
      ],
      correctIndex: 1,
      comment: "Dokładnie tak – Amanda Nunes! 🦁🥊"
    },
    {
      question: "W jaki dzień oficjalnie się poznaliśmy? 🗓️✨",
      options: [
        "16 lipca",
        "17 lipca",
        "18 lipca",
        "19 lipca"
      ],
      correctIndex: 1,
      comment: "Dokładnie 17 lipca! Pamiętasz idealnie! 🥰❤️"
    },
    {
      question: "Jakiego dnia odbyło się nasze pierwsze spotkanie? ☕✨",
      options: [
        "19 lipca",
        "20 lipca",
        "21 lipca",
        "22 lipca"
      ],
      correctIndex: 1,
      comment: "Dokładnie 20 lipca! Tego dnia nie da się zapomnieć! 🥰❤️"
    },
    {
      question: "Jaka jest moja ulubiona kuchnia? (proste!) 🍕🍝",
      options: [
        "Azjatycka",
        "Włoska",
        "Gruzińska",
        "Amerykańska"
      ],
      correctIndex: 1,
      comment: "Oczywiście, że włoska! Pizza i makaron ponad wszystko! 🍕❤️"
    }
  ]
};
