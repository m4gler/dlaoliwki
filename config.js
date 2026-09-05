// =============================================================================
// KONFIGURACJA STRONY DLA OLIWII ❤️
// Możesz tu łatwo zmienić dowolny tekst, datę, zdjęcia lub pytania w quizie!
// =============================================================================

window.CONFIG = {
  // Imię i nagłówki
  herName: "Oliwia",
  title: "Dla Oliwii ✨",
  subtitle: "Nasza wspólna historia zaczyna się właśnie teraz...",

  // DATA ROZPOCZĘCIA ZWIĄZKU (Format: RRRR-MM-DDTHH:MM:SS)
  // Wczorajsza data (możesz zmienić dokładną godzinę, np. '2026-09-04T20:00:00')
  startDate: "2026-09-04T20:00:00",

  // WIRTUALNY LIST / WIADOMOŚĆ
  letter: {
    title: "Hejka Oliwka... ❤️",
    paragraphs: [
      "Wiem, że to dopiero sam początek naszej wspólnej drogi, ale już teraz wiem, że każda chwila spędzona z Tobą ma w sobie niesamowitą magię.",
      "Twój uśmiech potrafi rozjaśnić nawet najbardziej pochmurny dzień, a rozmowy z Tobą mijają w ułamku sekundy. Cieszę się niesamowicie, że od wczoraj możemy mówić o sobie 'MY'.",
      "Stworzyłem tę stronę specjalnie dla Ciebie, żebyś w każdej chwili mogła zerknąć, jak bije nasz wspólny licznik i przypomnieć sobie, jak bardzo jesteś dla mnie wyjątkowa.",
      "Przed nami cała masa wspólnych wspomnień, podróży, śmiechu i przygód. Nie mogę się doczekać każdego kolejnego dnia z Tobą! 🥰"
    ],
    sign: "Na zawsze Twój ❤️"
  },

  // GALERIA ZDJĘĆ
  // Możesz wrzucić swoje zdjęcia do folderu 'assets/' i wpisać tu ich nazwy np. 'assets/nasze1.jpg'
  // Domyślnie ustawione są klimatyczne grafiki ilustracyjne
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
      caption: "Początek czegoś niezwykłego ✨",
      date: "Wczoraj"
    },
    {
      url: "assets/pierwsze_zdjecie.jpg",
      caption: "Chyba nasze pierwsze wspólne zdjęcie (chyba). 🎱❤️",
      date: "Początki ✨"
    },
    {
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80",
      caption: "Wspólne wieczory i rozmowy do rana 🌙",
      date: "Każdy dzień"
    },
    {
      url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&auto=format&fit=crop&q=80",
      caption: "Tylko Ty i ja przeciwko całemu światu 💫",
      date: "Przyszłość"
    }
  ],

  // MINI-QUIZ O WAS
  quiz: [
    {
      question: "Kto z nas dwojga częściej patrzy na drugą osobę maślanym wzrokiem? 👀",
      options: [
        "Zdecydowanie ja (chłopak)",
        "Oliwia, chociaż próbuje to ukryć",
        "Oboje równo – nie da się oderwać wzroku!",
        "Tylko jak jest jedzenie w pobliżu"
      ],
      correctIndex: 2,
      comment: "Dokładnie! Nie da się na siebie nie patrzeć! 😍"
    },
    {
      question: "Jaka jest oficjalna supermoc Oliwii? 🦸‍♀️",
      options: [
        "Rozczulanie mnie jednym spojrzeniem",
        "Bycie najcudowniejszą osobą pod słońcem",
        "Wybieranie filmów przez godzinę",
        "Wszystkie powyższe (szczególnie dwie pierwsze!)"
      ],
      correctIndex: 3,
      comment: "Oczywiście, że wszystkie! Zwłaszcza to z rozczulaniem! 🥺✨"
    },
    {
      question: "Jaki jest nasz wspólny plan na najbliższy czas? 🚀",
      options: [
        "Jedzenie dużej ilości dobrego jedzonka",
        "Kolejne niesamowite randki i przygody",
        "Kolekcjonowanie wspólnych wspomnień",
        "Wszystko naraz i jeszcze więcej!"
      ],
      correctIndex: 3,
      comment: "Bingo! Przed nami najlepszy czas! 🎉"
    },
    {
      question: "Od kiedy oficjalnie tworzymy najlepszy duet na świecie? 🏆",
      options: [
        "Od wczoraj!",
        "Od zawsze w gwiazdach",
        "Od pierwszego wejrzenia",
        "Wszystkie odpowiedzi są poprawne ❤️"
      ],
      correctIndex: 3,
      comment: "To było przeznaczenie! 🥂❤️"
    }
  ]
};
