// Dag 5: Bokningsformuläret. Kopplas på kontakt.html.
import { valideraNamn, valideraEpost, valideraTelefon, valideraDatum, valideraAntal, valideraFormular, dagensDatum } from "./validering";

import { hamta } from "./dom";

type Falt = HTMLInputElement | HTMLSelectElement;

const form = hamta<HTMLFormElement>("#bokningsform");
const bekraftelse = hamta("#bekraftelse");

// elements.namedItem ger Element | RadioNodeList | null. Vi kollar att det är ett fält vi känner igen.
function hittaFalt(namn: string): Falt {
  const falt = form.elements.namedItem(namn);
  if (falt instanceof HTMLInputElement || falt instanceof HTMLSelectElement) {
    return falt;
  }
  throw new Error(`Fältet ${namn} saknas i formuläret`);
}

// Vilken regel hör till vilket fält? Nyckeln är fältets name-attribut.
const regler: Record<string, (text: string) => string> = {
  namn: valideraNamn,
  epost: valideraEpost,
  telefon: valideraTelefon,
  datum: (text: string) => valideraDatum(text, dagensDatum()),
  antal: valideraAntal,
};

// 1. visaFel(falt, meddelande): visa ett felmeddelande under fältet.
//    - Finns det inget <p class="falt-fel" id="NAMN-fel"> efter fältet? Skapa det (insertAdjacentElement("afterend", p)).
//    - p.textContent = meddelande
//    - Är meddelandet tomt: ta bort aria-invalid och aria-describedby från fältet.
//      Annars: falt.setAttribute("aria-invalid", "true") och aria-describedby = p:ts id.
function visaFel(falt: Falt, meddelande: string): void {
  const namn: string = falt.name;
  if (!(document.querySelector(`#${namn}-fel`))) {
    const p = document.createElement("p");
    p.classList.add("falt-fel");
    p.id = `#${namn}-fel`;
    falt.insertAdjacentElement("afterend", p);
  }
  const p = hamta(`#${namn}-fel`);
  p.textContent = meddelande;
  if (meddelande === "") {
    falt.removeAttribute("aria-invalid");
    falt.removeAttribute("aria-describedby");
  } else {
    falt.setAttribute("aria-invalid", "true");
    falt.setAttribute("aria-describedby", p.id);
  }

}

// 2. Koppla varje fält i regler: validera när användaren LÄMNAR fältet ("blur"),
//    och validera på nytt vid "input" men bara om fältet redan är markerat som fel (aria-invalid="true").
const namnFalt = hamta("#namn");
namnFalt.addEventListener("blur", (handelse) => {
  valideraNamn(namnFalt.textContent);
})
namnFalt.addEventListener("input", (handelse) => {
  if (namnFalt.getAttribute("aria-invalid") === "true") {
    valideraNamn(namnFalt.textContent);
  }
})

const epostFalt = hamta("#epost");
epostFalt.addEventListener("blur", (handelse) => {
  valideraEpost(epostFalt.textContent);
})
epostFalt.addEventListener("input", (handelse) => {
  if (epostFalt.getAttribute("aria-invalid") === "true") {
    valideraEpost(epostFalt.textContent);
  }
})

const telefonFalt = hamta("#telefon");
telefonFalt.addEventListener("blur", (handelse) => {
  valideraTelefon(telefonFalt.textContent);
})
telefonFalt.addEventListener("input", (handelse) => {
  if (telefonFalt.getAttribute("aria-invalid") === "true") {
    valideraTelefon(telefonFalt.textContent);
  }
})

const datumFalt = hamta("#datum");
datumFalt.addEventListener("blur", (handelse) => {
  valideraDatum(datumFalt.textContent, dagensDatum());
})
datumFalt.addEventListener("input", (handelse) => {
  if (datumFalt.getAttribute("aria-invalid") === "true") {
    valideraDatum(datumFalt.textContent, dagensDatum());
  }
})

const antalFalt = hamta("#antal");
antalFalt.addEventListener("blur", (handelse) => {
  valideraAntal(antalFalt.textContent);
})
antalFalt.addEventListener("input", (handelse) => {
  if (antalFalt.getAttribute("aria-invalid") === "true") {
    valideraAntal(antalFalt.textContent);
  }
})

// 3. Vid "submit": preventDefault(). Validera hela formuläret med valideraFormular.
//    - Finns fel: visa dem alla med visaFel, flytta fokus till första felaktiga fältet.
//    - Annars: skriv "Tack! Vi bekräftar din bokning inom ett dygn." i #bekraftelse och töm formuläret (form.reset()).
//    Tips: new FormData(form) ger fält av typen string | File. valideraFormular vill ha Record<string, string>,
//    så loopa och ta bara värden där typeof varde === "string".
//    Använd hittaFalt(namn) för att hämta ett fält med rätt typ.

// Samla ihop alla fält i formuläret.
// FormData hämtar varje fälts name och det användaren har skrivit.
const data = new FormData(form);
// DEBUG: visar innehållet i FormData (syns i F12 > Console)
console.log("FormData:", Object.fromEntries(data));

// Ett tomt objekt som vi fyller på, t.ex. { namn: "Anna", epost: "anna@mail.se" }
const formular: Record<string, string> = {};

// Gå igenom varje fält. Varje varv får vi fältets namn och dess värde.
for (const [namn, varde] of data) {
  // Värdet kan vara text eller en fil (från <input type="file">).
  // valideraFormular vill bara ha text, så vi sparar bara strängar.
  if (typeof varde === "string") {
    formular[namn] = varde;
  }
}
// DEBUG: visar det som faktiskt skickas vidare
console.log("formular:", formular);

/*for (const element of form) {
  if (typeof element.textContent === "string") {
    formular[`${element.id}`] = `${element.textContent}`;
  }
}*/

const submitKnapp = hamta(".knapp");
submitKnapp.addEventListener("submit", (handelse) => {
  handelse.preventDefault();
  const formularFel: Record<string, string> = valideraFormular(formular, dagensDatum());
  let noError: boolean = true;
  if (formularFel.namn) {
    const namnFalt: Falt = hittaFalt("namn");
    visaFel(namnFalt, formularFel.namn);
    if (noError === true) {
      namnFalt.focus();
      noError = false;
    }
  }
  if (formularFel.epost) {
    const epostFalt: Falt = hittaFalt("epost");
    visaFel(epostFalt, formularFel.epost);
    if (noError === true) {
      epostFalt.focus();
      noError = false;
    }
  }
  if (formularFel.telefon) {
    const telefonFalt: Falt = hittaFalt("telefon");
    visaFel(telefonFalt, formularFel.telefon);
    if (noError === true) {
      telefonFalt.focus();
      noError = false;
    }
  }
  if (formularFel.datum) {
    const datumFalt: Falt = hittaFalt("datum");
    visaFel(datumFalt, formularFel.datum);
    if (noError === true) {
      datumFalt.focus();
      noError = false;
    }
  }
  if (formularFel.antal) {
    const antalFalt: Falt = hittaFalt("antal");
    visaFel(antalFalt, formularFel.antal);
    if (noError === true) {
      antalFalt.focus();
      noError = false;
    }
  }
  if (noError === true) {
    let bekraftelseMeddelande = document.createElement("p");
    bekraftelseMeddelande.textContent = "Tack! Vi bekräftar din bokning inom ett dygn.";
    bekraftelse.appendChild(bekraftelseMeddelande);
    form.reset();
  }
})
