```javascript
// =========================
// ÉLÉMENTS
// =========================

let cases = document.querySelectorAll(".case");
let touches = document.querySelectorAll(".touche");

let message = document.querySelector("#message");

let musiqueJeu = document.querySelector("#musiqueJeu");
let musiqueVictoire = document.querySelector("#musiqueVictoire");


// =========================
// VARIABLES
// =========================

let position = 0;
let ligne = 0;
let debut = 0;

let mots = [];
let motSecret = "";

let partieTerminee = false;

let motChoisi = "";


// =========================
// MUSIQUE
// =========================

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;


// =========================
// ACCENTS
// =========================

function enleverAccents(texte) {
    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// =========================
// MESSAGE
// =========================

function afficherMessage(texte) {

    message.textContent = texte;
    message.style.opacity = "1";

    setTimeout(function() {
        message.style.opacity = "0";
    }, 1500);
}


// =========================
// CLAVIER
// =========================

function mettreAJourClavier(lettre, couleur) {

    touches.forEach(function(touche) {

        if (touche.textContent !== lettre) {
            return;
        }

        if (couleur === "vert") {
            touche.classList.remove("jaune", "gris");
            touche.classList.add("vert");
        }

        if (couleur === "jaune") {
            if (!touche.classList.contains("vert")) {
                touche.classList.remove("gris");
                touche.classList.add("jaune");
            }
        }

        if (couleur === "gris") {
            if (
                !touche.classList.contains("vert") &&
                !touche.classList.contains("jaune")
            ) {
                touche.classList.add("gris");
            }
        }
    });
}


// =========================
// SON DE TOUCHE
// =========================

function sonTouche() {

    let son = new Audio("touche.mp3");

    son.volume = 0.15;
    son.play();
}


// =========================
// ÉCRIRE
// =========================

function ecrireLettre(lettre) {

    if (partieTerminee || position >= 5) {
        return;
    }

    // Écrire la lettre

    cases[debut + position].textContent = lettre;

    // Animation de la case

    cases[debut + position].classList.remove(
        "letter-animation"
    );

    void cases[debut + position].offsetWidth;

    cases[debut + position].classList.add(
        "letter-animation"
    );

    // Animation du clavier

    touches.forEach(function(touche) {

        if (touche.textContent === lettre) {

            touche.classList.remove("touche-appuyee");

            void touche.offsetWidth;

            touche.classList.add("touche-appuyee");
        }
    });

    // Petit son

    sonTouche();

    // Musique

    if (musiqueJeu.paused) {
        musiqueJeu.play();
    }

    position++;
}


// =========================
// CLAVIER PHYSIQUE
// =========================

document.addEventListener("keydown", function(event) {

    if (partieTerminee) {
        return;
    }

    // Lettre

    if (event.key.length === 1) {

        let lettre = enleverAccents(
            event.key.toUpperCase()
        );

        if (/^[A-Z]$/.test(lettre)) {
            ecrireLettre(lettre);
        }

        return;
    }

    // Effacer

    if (event.key === "Backspace") {

        if (position > 0) {
            position--;
            cases[debut + position].textContent = "";
        }

        return;
    }

    // Valider

    if (event.key === "Enter") {
        validerMot();
    }
});


// =========================
// CLAVIER VIRTUEL
// =========================

touches.forEach(function(touche) {

    touche.addEventListener("click", function() {

        ecrireLettre(touche.textContent);

    });
});


// =========================
// CHARGER LES MOTS
// =========================

fetch("mots.txt")

    .then(function(response) {
        return response.text();
    })

    .then(function(texte) {

        mots = texte
            .split(/\r?\n/)
            .map(function(mot) {
                return enleverAccents(
                    mot.trim().toUpperCase()
                );
            })
            .filter(function(mot) {
                return mot.length === 5;
            });

        console.log("Mots chargés :", mots.length);

        if (motChoisi === "") {

            motSecret = mots[
                Math.floor(Math.random() * mots.length)
            ];

        } else {

            motSecret = enleverAccents(
                motChoisi.toUpperCase()
            );
        }

        console.log("Mot secret :", motSecret);
    });


// =========================
// VALIDER LE MOT
// =========================

function validerMot() {

    if (partieTerminee) {
        return;
    }

    if (position < 5) {
        afficherMessage("Pas assez de lettres.");
        return;
    }

    let mot = "";

    for (let i = 0; i < 5; i++) {
        mot += cases[debut + i].textContent;
    }


    // Mot inexistant

    if (!mots.includes(mot)) {
        afficherMessage("Ce mot n'existe pas");
        return;
    }


    // =========================
    // VICTOIRE
    // =========================

    if (mot === motSecret) {

        partieTerminee = true;

        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueVictoire.currentTime = 0;
        musiqueVictoire.play();


        for (let i = 0; i < 5; i++) {

            cases[debut + i].classList.add("vert");

            mettreAJourClavier(
                mot[i],
                "vert"
            );

            setTimeout(function() {

                cases[debut + i].classList.add(
                    "victoire"
                );

            }, i * 100);
        }

        return;
    }


    // =========================
    // MAUVAISE RÉPONSE
    // =========================

    let lettresDisponibles = motSecret.split("");


    // Vert

    for (let i = 0; i < 5; i++) {

        if (mot[i] === motSecret[i]) {

            cases[debut + i].classList.add("vert");

            mettreAJourClavier(
                mot[i],
                "vert"
            );

            lettresDisponibles[i] = null;
        }
    }


    // Jaune / gris

    for (let i = 0; i < 5; i++) {

        if (mot[i] === motSecret[i]) {
            continue;
        }

        let index = lettresDisponibles.indexOf(
            mot[i]
        );

        if (index !== -1) {

            cases[debut + i].classList.add("jaune");

            mettreAJourClavier(
                mot[i],
                "jaune"
            );

            lettresDisponibles[index] = null;

        } else {

            cases[debut + i].classList.add("gris");

            mettreAJourClavier(
                mot[i],
                "gris"
            );
        }
    }


    // Ligne suivante

    ligne++;

    if (ligne === 6) {

        window.location = "perdu.html";

    } else {

        debut += 5;
        position = 0;
    }
}
```

### Et il faut juste ajouter `touche.mp3`

Mets **`touche.mp3` à côté de `Wordle1.mp3` et `Victory.mp3`** dans GitHub.

Donc ton dossier doit être :

```text
Index.html
Script.js
style.css
mots.txt
Wordle1.mp3
Victory.mp3
touche.mp3
perdu.html
```

Et dans le CSS, seulement ça :

```css
.touche-appuyee {
    animation: touche 0.1s;
}

@keyframes touche {

    50% {
        transform: translateY(3px);
    }

}
```

**C'est tout.**

Et surtout, avec cette version, **on ne bloque aucune lettre**. Même une touche grise peut être tapée normalement. On ajoutera l'enrayement après, une fois qu'on sait que l'écriture fonctionne.
