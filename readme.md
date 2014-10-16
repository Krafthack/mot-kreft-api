# Oppsett for utvikling
Applikasjonen (appen) kjøres på [Heroku](https://www.heroku.com/) og domene for
APIet er [api.mot-kreft.krafthack.it](http://api.mot-kreft.krafthack.it).

## Avhengigheter
* Postgres
  * **OS X.** Man kan laste ned postgres fra http://postgresapp.com/, men anebfaler
  også å laste ned postgres tools fra *Homebrew* ``brew install postgresql``.
  * **Windows.** *Har ikke sjekket ut*
  * **Linux.** *Har ikke sjekket ut*
* Node
  * **OS X.** ``brew install node`` eller http://nodejs.org/download/
  * **Windows.** http://nodejs.org/download/
  * **Linix.** http://nodejs.org/download/
* GIT:
  * http://git-scm.com/downloads

## Kjøre applikasjonen
Appen er skrevet i node så man kan bruke de verktøyene man vil
(hvis de støtter node da=) for å kjøre applikasjonen. I utvikling foretrekker
jeg selv å bruker ``supervisor`` som restarter appen hver gang du lagrer og/eller
den feiler.

**NB!** Det kan også være lurt å verifisere at appen klarer å starte på heroku ved å
kjøre den med ``foreman``.

``supervisor index.js``, ``foreman start`` eller kun ``node index.js``

## Configs
* **PORT**. Port er definert som en miljævariabel. Hvis denne ikke er definert
defaulter appen til å bruke port 5000.

## Databasen
For å få appen til å fungere som den skal trenger vi å sette opp databasen.
Vi har satt sammen et lite node-script som skal håndtere dette for deg.
Kjør følgende script for å sette opp databasen

```sh
cd db && node setup.js
```
dette scriptet vil be deg om å skrive inn ett passord. Dette passordet vil bli
brukt til å sette opp utviklingsbrukeren ``dev_krafthack`` i postgres hvis den
ikke finnes fra før.

Appen bruker *miljævariabler* for å vite hvor den skal lete etter database fra
 I OS X kan man sette *miljævariabelen* på følgende måte i terminalvinduet
 ```sh
 export DATABASE_URL=postgres://dev_krafthack:<dev_password>@localhost/krefthack
 ```
 der ``<dev_password>``er det passordet du valgte i steg 1.1.

### Populering av databasen
For å populere databasen med dev data kan du kjøre følgende kommandolinje.
Scriptet forutsetter at du har konfigurert opp ``DATABASE_URL`` og at
setup-scriptet fullførte som forventet

```sh
node db/populate.js | psql krefthack
```

# Oppdatere databasemodellen
Siden dette er en workshop der minst 3 apper kommer til å eksistere samtidig og
være under konstant forandring, har vi valgt å ha en veldig fleksibel datamodell
som kommer til å bli endret i etter tid. Under workshoppen vil det derfor ikke
være lov til å slette tabeller eller rader i tabellen. Dette er for å unngå at
større endringer i databsen propagerer ut i det eksponerte APIet.

Vi tror denne modellen vil føre til mindre feil, men kanskje litt
data regressjon under workshopen. Men vi kommer forhåpentligvis til å få tid til
å rydde opp i datamodellen i ettertid av workshoppen.

Hele datamodellen vil være definert i ``db/model.sql`` og eksverings rekkefølgen
til SQL queriene vil være i samme rekkefølge som de ble godkjent. For at en
SQL query skal bli godkjent inn i datamodellen må dere sende en PR der dere
oppdaterer ``model.sql`` til dette repoet. Da vil **@frodetbj** eller
**@gronnbeck** ta seg av mergingen.

For at en oppdatering skal bli godkjent må følgende være dokumentert i PR:
* Hva slags type endringer PR inneholder
* Datafelter som ikke lenger skal brukes skal merkes **deprecated** i
datamodellen som returneres. Se [Transition Migration](#Transition Migration)
for mer informasjon rundt migrering av funksjonalitet.

# Transition Migration
Ved å ta i bruk en transitionsmodell for migrering introduserer vi muligheten
for at flere versjoner av APIet kan eksistere samtidig. Vi gjør dette fordi vi
vil prøve å minimere endringer som fører til at appene som er under
konstantutvikling under workshoppen skal kræsje hele tiden fordi APIet også
er under utvikling. Altså det gjør oss smidige.

Siden APIet er under konstant endring er det viktig å eksponere hvilke endringer
som har skjedd og når de har skjedd. Ideelt hadde vært å informert brukeren når
endringen går fra å være transitionelle til "breaking", men føler ikke det er
nødvendig for en så kortvarig workshop, og kan heller introduseres om produktet
går i produksjon.

For APIet vil jeg adressere en modell for å transisjonsmigering for *endpoints*
og *datamodeller*.

## Datamodell
Ved migrering av datamodellen ønsker vi å informere brukerne av APIet at deler
av datamodellen ikke lenger skal brukes. Dette skjer typisk ved at vi ønsker å
endre på databasemodellen eller at vi ønsker å refakturere og endre navn på til
en variabel som eksponeres ut til brukeren.

Vi gjør dette ved å legge til et felt ``deprecated`` til alle
modeller, og oppdaterer denne ettersom ting fjernes, endres eller slettes.
Da er alle app utviklere (iOS, Android og Web) ansvarlig for å sjekke at endpointet
ikke har endret seg for mye siden sist. Det skal ligge en endringsdato der
for å vise når endringen skjedde. Da vet man litt mer hvor langt man henger bak.

Deprecated modellen ønsker vi at skal se slik ut
```js
{
  "key": "key that has changed",
  "use": "other_key" || "Model.attr" || "Model" || null,
  // other_key: The other key inside this model its been moved to
  // Model.attr:
  //  The field was moved to another model with the corresponding field
  // Model: The field has been moved to another model but not as one field
  // null: We have deleted this useless thing
  "desc": "Just a human friendly description. Should be hand written",
  "changed_on": 1413023904
}
```

Legger også ved et eksempel på hvordan jeg ser for meg at det skal brukes.

```js
// User object with deprecated fields
{
  "user": "olanord",
  "username": "olanordmann",
  "name": "Ola Nordmann",
  "meail": "ola@example.com",
  "email": "ola@example.com",
  "favorite_cheese": "Brown cheese",
  "address": "Skur 39, Oslo",
  "deprecated": [
    {
      "key": "meail",
      "use": "email",
      "desc": "Sorry. That was a type-o",
      "changed_on": 1413023904
    },
    {
      "key": "user",
      "use": "username",
      "desc": "Username is more descriptive than user",
      "changed_on": 1413023904
    },
    {
      "key": "favorite_cheese",
      "use": null,
      "desc": "No longer in use.",
      "changed_on": 1413023904
    },
    {
      "key": "address",
      "use": "Address",
      "desc": "Field was moved to another model",
      "changed_on": 1413023904
    }
  ]
}
```

## Endpoint
Hvis vi ønsker å flytte et endpoint bør vi også gjøre dette over tid. Og samtidig
informere brukeren at dette endpointet er endret og går snart ut på dato.
Jeg tenker at dette kan løses ved å legge til en *Depreacted* header i
HTTP responsene. Vi legger til følgende header i respnsene som er utdatert:

```txt
DEPRECATED-ENDPOINT: true
DEPRECATED-USE: /cheese
DEPRECATED-ON: 1413023904
DEPRECATED-DESC: Simply better
```

Så hvis ``DEPRECATED-ENDPOINT`` er definert så skal man ikke bruke
dette endpointet lenger. Og meta informasjon om hvorfor dette har endret seg.

Vi velger å **ikke** gjøre en **redirect** på dette tidspunktet siden dette
endpoint kan ha en annen datamodell enn den nye.


# Deploy til Heroku
Om du ønsker å sette opp appen på Heroku kan du følge stegene nedenfor.
Vennligst oppdater listen hvis den er mangelfull.

 1. Last ned heroku og initialiser appen for Heroku. Heroku har en fin
 [guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)
 for dette.
 2. Initialiser databasen ``heroku pg:psql < db/model.sql``
