// Dag 5: Validering av bokningsformuläret. Rena funktioner, lätta att testa.
// Varje valideraX-funktion tar ett värde (text) och returnerar ett felmeddelande som text,
// eller en tom text "" om värdet är giltigt. Meddelandena står i tests.js.

// Namn: obligatoriskt, minst 2 tecken efter trim().
export function valideraNamn(text: string): string {
  if (text.trim() === "") {
    return "Fyll i ditt namn.";
  } else if (text.length < 2) {
    return "Namnet måste vara minst 2 tecken.";
  } else {
    return "";
  }
}

// E-post: obligatorisk, måste innehålla @, och ha formen text@text.text.
export function valideraEpost(text: string): string {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (text === "") {
    return "Fyll i din e-postadress.";
  } else if (!text.includes("@")) {
    return "E-postadressen måste innehålla @.";
  } else if (!regex.test(text)) {
    return "Ange en giltig e-postadress, till exempel namn@exempel.se.";
  } else {
    return "";
  }
}

// Telefon: VALFRI (tom text är giltigt). Annars bara siffror, mellanslag, + och -, och minst 7 siffror.
export function valideraTelefon(text: string): string {
  const regex = /^[0123456789\+\-\s]+$/;
  if (text != "") {
    if (!regex.test(text)) {
      return "Telefonnumret får bara innehålla siffror, mellanslag, plus och bindestreck.";
    } else if (text.length < 7) {
      return "Telefonnumret är för kort.";
    }
  }
  return "";
}

// Datum: obligatoriskt. text och idag är datum som "2026-10-19". Inte före idag.
export function valideraDatum(text: string, idag: string): string {
  if (text === "") {
    return "Välj ett datum.";
  } else if (text < idag) {
    return "Datumet kan inte vara i det förflutna.";
  } else {
    return "";
  }
}

// Antal personer: obligatoriskt (en tom text betyder att inget valts).
export function valideraAntal(text: string): string {
  if (text === "") {
    return "Välj antal personer.";
  } else {
    return "";
  }
}

// Dagens datum som "2026-10-19" (färdig, du behöver inte ändra den).
export function dagensDatum(): string {
  return new Date().toLocaleDateString("sv-SE");
}

// Validera ett helt formulär. varden = { namn, epost, telefon, datum, antal } (texter).
// Returnera ett objekt med BARA de fält som har fel: { namn: "Fyll i ditt namn." }
// Giltigt formulär ger ett tomt objekt {}.
export function valideraFormular(varden: Record<string, string>, idag: string): Record<string, string> {
  const felLista: Record<string, string> = {};
  
  const felNamn = valideraNamn(varden.namn);
  if(felNamn != "") {
    felLista.namn = felNamn;
  }
  const felEpost = valideraEpost(varden.epost);
  if(felEpost != "") {
    felLista.epost = felEpost;
  }
  const felTelefon = valideraTelefon(varden.telefon);
  if(felTelefon != "") {
    felLista.telefon = felTelefon;
  }
  const felDatum = valideraDatum(varden.datum, idag);
  if(felDatum != "") {
    felLista.datum = felDatum;
  }
  const felAntal = valideraAntal(varden.antal);
  if(felAntal != "") {
    felLista.antal = felAntal;
  }

  return felLista;
}

/*
  const ok = { namn: "Anna", epost: "anna@exempel.se", telefon: "", datum: "2026-11-01", antal: "2" };
  assertEqual(valideraFormular(ok, "2026-10-19"), {});

  const fel = valideraFormular({ namn: "", epost: "anna@exempel.se", telefon: "", datum: "2026-11-01", antal: "" }, "2026-10-19");
  assertEqual(fel, { namn: "Fyll i ditt namn.", antal: "Välj antal personer." });
*/
