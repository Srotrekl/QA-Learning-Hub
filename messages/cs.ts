import type { Messages } from "./en";

export const cs: Messages = {
  nav: {
    about: "O mně",
    github: "GitHub",
  },
  hero: {
    badge: "✓ hledám práci",
    title: "QA Automation Engineer",
    subtitle:
      "Playwright · API testování · CI/CD · bezpečnost AI/LLM — každé téma je interaktivní: vysvětlení, živý kód a kvíz.",
    browseTopics: "Procházet témata ↓",
    githubCv: "GitHub / CV →",
  },
  topics: {
    heading: (count: number) => `Témata — ${count} dostupných`,
  },
  tabs: {
    explanation: "Vysvětlení",
    code: "Kód",
    tryIt: "Vyzkoušej",
    quiz: "Kvíz",
    ariaLabel: "Sekce tématu",
  },
  code: {
    copy: "kopírovat",
    copied: "✓ zkopírováno",
    noExamples: "Žádné ukázky kódu pro toto téma.",
    noRunnable: "Žádné spustitelné příklady pro toto téma.",
  },
  quiz: {
    noQuiz: "Pro toto téma zatím není kvíz.",
    progress: (current: number, total: number) => `${current} / ${total}`,
    correct: "✓ Správně",
    incorrect: "✗ Špatně",
    next: "Další →",
    seeResults: "Zobrazit výsledky →",
    tryAgain: "Zkusit znovu",
    allCorrect: "Vše správně — výborně.",
    noneCorrect: "Žádná správná odpověď — zkus to znovu.",
    toReview: (n: number) => `${n} k procvičení.`,
  },
  whyItMatters: "Proč je to důležité",
  viewRelatedRepo: "Zobrazit repozitář →",
  footer: {
    name: "Steve Rotrekl · QA Automation Engineer",
    build: "build: passing",
  },
  notFound: {
    label: "test: FAILED",
    message: "Tato stránka neexistuje. Očekáváno: platná adresa. Získáno: nic.",
    back: "← Zpět na témata",
  },
  about: {
    backToTopics: "← témata",
  },
  breadcrumb: {
    topics: "← témata",
  },
};
