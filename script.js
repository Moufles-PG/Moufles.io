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
// PETIT SON DE MACHINE
// =========================

let audioContext = null;

function sonTouche() {

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    let oscillateur = audioContext.createOscillator();
    let volume = audioContext.createGain();

    oscillateur.type = "square";
    oscillateur.frequency.value = 150;

    volume.gain.value = 0.02;

    oscillateur.connect(volume);
    volume.connect(audioContext.destination);

    oscillateur.start();
    oscillateur.stop(audioContext.currentTime + 0.04);
}


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

            touche.classList.remove("jaune");
            touche.classList.remove("gris");

            touche.classList.add("vert");

        }

        else if (couleur === "jaune") {

            if (!touche.classList.contains("vert")) {

                touche.classList.remove("gris");
                touche.classList.add("jaune");

            }

        }

        else if (couleur === "gris") {

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
// ANIMATION TOUCHE
// =========================

function animerTouche(lettre) {

    touches.forEach(function(touche) {

        if (touche.textContent === lettre) {

            touche.classList.remove("touche-appuyee");

            void touche.offsetWidth;

            touche.classList.add("touche-appuyee");

        }

    });

}


// =========================
// ÉCRIRE UNE LETTRE
// =========================

function ecrireLettre(lettre) {

    if (partieTerminee) {
        return;
    }

    if (position >= 5) {
        return;
    }


    // Écrire

    cases[debut + position].textContent = lettre;


    // Animation de la lettre

    cases[debut + position].classList.remove(
        "letter-animation"
    );

    void cases[debut + position].offsetWidth;

    cases[debut + position].classList.add(
        "letter-animation"
    );


    // Animation du clavier

    animerTouche(lettre);


    // Petit son

    sonTouche();


    // Musique

    if (musiqueJeu.paused) {

        musiqueJeu.play().catch(function(erreur) {

            console.log(erreur);

        });

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

            cases[
                debut + position
            ].textContent = "";

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

        ecrireLettre(
            touche.textContent
        );

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


        console.log(
            "Mots chargés :",
            mots.length
        );


        // Choisir le mot

        if (motChoisi === "") {

            motSecret =
                mots[
                    Math.floor(
                        Math.random() * mots.length
                    )
                ];

        }

        else {

            motSecret =
                enleverAccents(
                    motChoisi.toUpperCase()
                );

        }


        console.log(
            "Mot secret :",
            motSecret
        );

    })

    .catch(function(erreur) {

        console.error(
            "Erreur avec mots.txt :",
            erreur
        );

    });


// =========================
// VALIDER LE MOT
// =========================

function validerMot() {

    if (partieTerminee) {
        return;
    }


    // Pas assez de lettres

    if (position < 5) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;
    }


    // Construire le mot

    let mot = "";

    for (let i = 0; i < 5; i++) {

        mot +=
            cases[
                debut + i
            ].textContent;

    }


    // Mot inexistant

    if (!mots.includes(mot)) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        return;
    }


    // =========================
    // VICTOIRE
    // =========================

    if (mot === motSecret) {

        partieTerminee = true;


        // Arrêter Wordle1

        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;


        // Lancer Victory

        musiqueVictoire.currentTime = 0;
        musiqueVictoire.play();


        // Animation

        for (let i = 0; i < 5; i++) {

            cases[
                debut + i
            ].classList.add("vert");


            mettreAJourClavier(
                mot[i],
                "vert"
            );


            setTimeout(function() {

                cases[
                    debut + i
                ].classList.add("victoire");

            }, i * 100);

        }


        return;
    }


    // =========================
    // MAUVAIS MOT
    // =========================

    let lettresDisponibles =
        motSecret.split("");


    // Lettres vertes

    for (let i = 0; i < 5; i++) {

        if (
            mot[i] === motSecret[i]
        ) {

            cases[
                debut + i
            ].classList.add("vert");


            mettreAJourClavier(
                mot[i],
                "vert"
            );


            lettresDisponibles[i] = null;

        }

    }


    // Jaune / gris

    for (let i = 0; i < 5; i++) {

        if (
            mot[i] === motSecret[i]
        ) {

            continue;

        }


        let positionLettre =
            lettresDisponibles.indexOf(
                mot[i]
            );


        // Jaune

        if (positionLettre !== -1) {

            cases[
                debut + i
            ].classList.add("jaune");


            mettreAJourClavier(
                mot[i],
                "jaune"
            );


            lettresDisponibles[
                positionLettre
            ] = null;

        }


        // Gris

        else {

            cases[
                debut + i
            ].classList.add("gris");


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

    }

    else {

        debut += 5;
        position = 0;

    }

}
```
