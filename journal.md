# Journal

14/07/2018
- Scelto l'oggetto da vendere: penna biro.
- Cercato e trovato modello su Sketchfab: boligrafo.obj 9.0k vertici, 2 materiali
(Boligrafo by Nicolas Alex Capdevielle, [link](https://sketchfab.com/models/25fb4c1e876e4c869249598a04ba0f48)).
- Caricato il modello e testato gli shader predefiniti di Three.js.
- Modificato esempio l17-shadingWithAO.html visto a lezione per testare il modello e osservare la resa delle texture sul modello. Ho scoperto che il modello non era UV-mappato (contrariamente a quanto indicato sul sito). Ho quindi proceduto a UV-mappare il modello in Maya 2017.

15/07/2018
- Modificato shader in modo da accettare fino a quattro fonti di luce (oltre alla luce ambientale).

17/07/2018
- Modificato shader aggiungendo riflessioni per metalli

20/07/2018
- Modificato shader aggiungendo metalness e deciso equazione per i materiali

cdiff = ( [1,1,1]-metalness ) * baseColor
cspec = metalness * baseColor + ( [1,1,1]-metalness ) * 0.04

cdiff è [0,0,0] per i metalli, il colore di base per i materiali dielettrici
cspec è circa [0.04,0.04,0.04] per i materiali dielettrici, il colore di base per i metalli

outRadiance = BRDF + luce ambientale per i materiali dielettrici + riflesso speculare per i metalli

20-25/07/2018
- Refactoring (il codice era illeggibile)
- Modificato geometria oggetto (mi sono resa conto che la punta della penna era troppo piccola per essere realistica)

25/07/2018
- Creato template base della pagina con [w3css](https://www.w3schools.com/w3css/default.asp)
- Problemi nel tentativo di ridimensionare dinamicamente il canvas
- Risolto aggiungendo qualche riga nel metodo OnResize(), chiamando Element.getBoundingClientRect() su un altro div della pagina per determinare la larghezza che dovrebbe avere il canvas in relazione al resto degli elementi

29/07/2018
- Aggiunto un sistema di 4 telecamere per poter visualizzare dettagli del prodotto nel sito
  - camera1 controllara dall'utente
  - camera2 punta della penna
  - camera3 corpo
  - camera4 clip e retro
- Tolto zoom controllato da rotella (per non interferire con lo scroll della pagina), aggiunti pulsanti per regolare lo zoom (camera.zoom)

30/07/2018
- Modificato meccanismo di zoom (slider). Mantenere lo zoom anche nelle visualizzazioni statiche (camera2-camera4)?