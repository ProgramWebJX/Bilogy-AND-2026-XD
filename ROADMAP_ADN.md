# 🧬 Udhërrëfyesi i Plotë i Krijimit 3D të ADN-së (B-ADN)

Ky udhërrëfyes shpjegon **të gjitha pjesët përbërëse të molekulës së ADN-së (Acidi Deoksiribonukleik)** dhe procesin e saktë hap-pas-hapi të ndërtimit të modelit 3D atomik (`ball-and-stick`, CPK) me **Three.js / WebGL** dhe eksportimit të tyre në skedarë `.glb`, bazuar në strukturën reale të B-ADN (Watson–Crick) dhe modelin fizik laboratorik *Indigo Instruments*.

---

## Harta e 8 Fazave të Ndërtimit 3D

| Faza | Pjesa e ADN-së | Formula / Elementet | Gjeometria 3D & Roli Biologjik | Skedari `.glb` |
|---|---|---|---|---|
| **01** | **Atomet Themelore (Kodi CPK)** | `C`, `O`, `N`, `H`, `P` | Sfera atomike me rreze proporcionale (Karbon i zi, Oksigjen i kuq, Azot blu, Hidrogjen i bardhë, Fosfor vjollcë) + cilindra kovalentë. | `models/nukleotid_A.glb` |
| **02** | **Grupi Fosfat** | $\text{PO}_4^{3-}$ | Gjeometri tetraedrike me 1 atom Fosfori në qendër dhe 4 Oksigjene; i jep ADN-së ngarkesë negative dhe skelet hidrofil. | `models/grup_fosfat.glb` |
| **03** | **Sheqeri 2′-Deoksiribozë** | $\text{C}_5\text{H}_{10}\text{O}_4$ | Unazë pentozë furanozike me konformacion *C2′-endo* (pa oksigjen në C2′, çka e bën ADN-në më të qëndrueshme se ARN). | `models/deoksiriboze.glb` |
| **04** | **Nukleotidi i Plotë** | Fosfat + Deoksiribozë + Bazë | Njësia monomere e ADN-së: baza lidhet në C1′ (lidhje $\beta$-N-glikozidike), fosfati në C5′. | `models/nukleotid_A.glb` |
| **05** | **Bazat Azotike (Purinat & Pirimidinat)** | A, G (Purina) · T, C (Pirimidina) | Purinat (A, G) kanë **2 unaza**; Pirimidinat (T, C) kanë **1 unazë** (Timina ka grupin karakteristik metil $-\text{CH}_3$). | `models/adenine.glb`, `timine.glb`, `guanine.glb`, `citozine.glb` |
| **06** | **Çiftëzimi Komplementar & Lidhjet H** | `A = T` (2 lidhje) · `G ≡ C` (3 lidhje) | Rregulli i Chargaff-it mban diametër konstant (20 Å) sepse çdo purinë çiftohet gjithmonë me një pirimidinë. | `models/cift_AT.glb`, `models/cift_GC.glb` |
| **07** | **Shtylla Antiparalele & Heliksi i Dyfishtë** | $5' \rightarrow 3'$ dhe $3' \rightarrow 5'$ | Ngritje **3.4 Å / bp**, rrotullim **34.3° / bp** (~10.5 bp për rrotullim), hap **34 Å**, kënd asimetrik ~142° që formon **Hullinë e Madhe** (~12 Å) dhe **Hullinë e Vogël** (~6 Å). | `models/adn_helix_only.glb` |
| **08** | **Modeli i Plotë Fizik (22 Çifte Bazash)** | 22 bp (~2.1 rrotullime) + Bazë Druri | Bashkon heliksin e plotë me pllakat stabilizuese akrilike, boshtin e çelikut dhe bazën rrethore prej druri lisi. | `models/adn_full.glb`, `models/baza_druri.glb` |

---

## Detajet Shkencore & Gjeometrike të B-ADN në Modelin 3D

### 1. Parametrat Matematikë të Heliksit
- **Drejtimi:** Heliks djathtas (*right-handed*).
- **Diametri:** $20\text{ Å}$ ($2.0\text{ nm}$).
- **Lartësia midis çifteve (Rise):** $3.4\text{ Å}$ ($0.34\text{ nm}$).
- **Këndi i rrotullimit (Twist):** $34.3^\circ$ për çift bazash ($10.5$ çifte bazash për një rrotullim $360^\circ$).
- **Hapi i heliksit (Pitch):** $34\text{–}35.7\text{ Å}$ për rrotullim të plotë.
- **Asimetria e Hullive:** Lidhjet glikozidike të një çifti bazash nuk dalin në $180^\circ$ kundrejt njëra-tjetrës, por në rreth $142^\circ$. Kjo ndan sipërfaqen e jashtme të cilindrit në:
  - **Hullia e Madhe (Major Groove):** e gjerë (~$12\text{ Å}$), ku proteinat rregullatore lexojnë kodin gjenetik pa e hapur ADN-në.
  - **Hullia e Vogël (Minor Groove):** e ngushtë (~$6\text{ Å}$), e rëndësishme për stabilitetin strukturor dhe hidratimin.

### 2. Kodi i Ngjyrave Atomike CPK (si në foton e referencës)
- **E zezë (`#1B1E23`):** Karbon (C)
- **E kuqe (`#D92626`):** Oksigjen (O)
- **Blu (`#1D70D8`):** Azot (N)
- **E bardhë (`#F4F6F9`):** Hidrogjen (H)
- **Vjollcë (`#7E3AF2`):** Fosfor (P)

---

## Si të Rigjeneroni ose Hapni Projektin
1. **Gjenerimi i skedarëve `.glb`:**
   ```bash
   npm run generate:glb
   ```
2. **Shfaqja në shfletues (`preview.html`):**
   ```bash
   npm run serve
   ```
   Pastaj hapni `http://localhost:8080/preview.html`.
