#Report

##Obiettivo

L'obiettivo del progetto era creare un visualizzatore / configuratore web per un sito di e-commerce per l'immaginaria compagnia ACME.

L'oggetto che ho scelto di presentare è una penna a sfera.

##File

La struttura del progetto è la seguente:

- **productPage.html** è la pagina web contenente il visualizzatore / configuratore
- **boligrafo_ballpoint.obj** è il modello della penna utilizzato nel visualizzatore (versione leggermente modificata del modello originale boligrafo.obj)  
- **generic.vert** vertex shader base
- **generic.frag** fragment shader
- **init.js** file contente le inizializzazioni della scena (camere, shader, materiali). Ccontiene inoltre i comandi per caricare il modello e far partire il loop di rendering
- **auxFunctions.js** file contenente le definizioni delle funzioni di render, update e che gestiscono le operazioni da effettuare in caso di resizing della finestra
- **lib** è la cartella contenente tutte le librerie necessarie a far funzionare il progetto
- **textures** è la cartella contenete tutte le texture (materiali e cube map)

##Fragment shader

Il fragment shader utilizzato prende in input:
- fino a quattro luci puntuali
- luce ambientale (costante)
- metalnessMap (1 per metallo, 0 per materiali dielettrici)
- diffuseMap
- roughnessMap
- normalMap
- aoMap
- surfCdiff (colore diffuso della superficie, serve a cambiare il colore del materiale)
- environment map (cube map per creare le riflessioni sui metalli)

Viene prima di tutto calcolato il **baseColor**, moltiplicando surfCdiff con la diffuse map.
Questo valore rappresenterà cspec per i metalli e cdiff per i non metalli.

Il contributo delle luci puntuali viene calcolato come visto in classe nell'esempio l14-combined-shader.html

Vengono poi calcolate **envLight** e **envLight2**, due mappe per riflessi glossy create blurrando la mipmap, una con la roughness data dalla roughness map l'altra con un roughness massima. Vengono anche calcolato **grayScaleEnvLight2**, la versione in scala di grigi di **envLight2**.

###Dielettrici

**grayScaleEnvLight2** viene sommato alla luce ambientale (costante), combinato con **envLight** e mascherato con la **aoMap** per ottenere **ambLight**, ovvero la luce che illumina i materiali dielettrici.

###Metalli

**envLight** viene invece usata per calcolare **metallicReflection**, la riflessione metallica come visto in classe nell'esempio l17-glossy-reflectionMapping.html

Infine i contributi luminosi vengono sommati: il constributo delle luci puntuali viene sommato ad **ambLight** (pesato con 1-metalness) e **metallicReflection** (pesato con metalness).

Grazie a questa scelta anche i materiali non metallici subiscono un'illuminazione che è influenzata dalla cube map fornita.

##Risultato

Qui di seguito alcuni screen che illustrano la pagina e i possibili risultati del configuratore.

###Vista generale della pagina web

![Sito](https://github.com/Interactive3DGraphicsCourse-UNIUD-2018/product-visualization-bportelli/blob/master/images/productPage.jpg)

La possibilità di fare panning è stata disabilitata all'interno nel visualizzatore e lo zoom con la rotella del mouse è stato sostituito con una barra al di sotto del visualizzatore per evitare interferenze con lo scroll della pagina.

###Vista su schermi a larghezza ridotta

![VistaRidotta](https://github.com/Interactive3DGraphicsCourse-UNIUD-2018/product-visualization-bportelli/blob/master/images/smallScreen.jpg)

###Esempio di configurazioni possibili

![Configurazioni](https://github.com/Interactive3DGraphicsCourse-UNIUD-2018/product-visualization-bportelli/blob/master/images/config.jpg)

##Dettagli sulla scena

Dopo aver posizionato la penna al centro della scena ed aver trovato una cube map adatta sono state posizionate 3 luci puntuali (una sopra all'oggetto e due ai lati per risaltarne la silouette). Le intensità delle luci puntuali e della luce ambientale costante sono state tarate in base all'intensità della luce presente nella cube map per ottenere un effetto uniforme.

##Programmi usati

- **Autodesk Maya 2017** (versione studenti) per la modifica della geometria del modello e la creazione delle uv-map
- **Gimp** per la creazione del banner e delle icone

##Risorse usate

- boligrafo.obj (modello della penna) Nicolas Alex Capdevielle [link](https://sketchfab.com/models/25fb4c1e876e4c869249598a04ba0f48)
- texture dei vari materiali [cc0textures.com](https://cc0textures.com/home)
- cube map salvata in ./textures/musee [link](https://git.framasoft.org/pizaninja/OpenEarthView/tree/master/demo/cubemap_musee)
- template base della pagina [w3css](https://www.w3schools.com/w3css/default.asp)