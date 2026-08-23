// =========================
// ÉLÉMENTS HTML
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

// Laisse vide pour un mot aléatoire
let motChoisi = "";


// =========================
// VOLUME
// =========================

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;


// =========================
// ENLEVER LES ACCENTS
// =========================

function enleverAccents(texte) {

    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =========================
// AFFICHER UN MESSAGE
// =========================

function afficherMessage(texte) {

    message.textContent = texte;
    message.style.opacity = "1";

    setTimeout(function() {

        message.style.opacity = "0";

    }, 1500);

}


// =========================
// METTRE LE CLAVIER À JOUR
// =========================

function mettreAJourClavier(lettre, couleur) {

    touches.forEach(function(touche) {

        if (touche.textContent !== lettre) {
            return;
        }


        // VERT

        if (couleur === "vert") {

            touche.classList.remove("jaune");
            touche.classList.remove("gris");

            touche.classList.add("vert");

        }


        // JAUNE

        else if (couleur === "jaune") {

            if (!touche.classList.contains("vert")) {

                touche.classList.remove("gris");
                touche.classList.add("jaune");

            }

        }


        // GRIS

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
// MUSIQUE DU JEU
// =========================

function lancerMusiqueJeu() {

    // Ne rien faire si elle joue déjà

    if (!musiqueJeu.paused) {
        return;
    }

    musiqueJeu.play().catch(function(erreur) {

        console.log(
            "Wordle1 ne peut pas démarrer :",
            erreur
        );

    });

}


// =========================
// CHARGER LE DICTIONNAIRE
// =========================

fetch("mots.txt")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Impossible de charger mots.txt"
            );

        }

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
            "Nombre de mots :",
            mots.length
        );


        // =========================
        // CHOISIR LE MOT SECRET
        // =========================

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
// CLAVIER PHYSIQUE
// =========================

document.addEventListener(
    "keydown",
    function(event) {


        // Partie terminée

        if (partieTerminee) {
            return;
        }


        // =========================
        // ÉCRIRE UNE LETTRE
        // =========================

        if (
            event.key.length === 1 &&
            position < 5
        ) {

            let lettre =
                enleverAccents(
                    event.key.toUpperCase()
                );


            // Vérifier que c'est une lettre

            if (!/^[A-Z]$/.test(lettre)) {
                return;
            }


            // =========================
            // MUSIQUE
            // =========================

            lancerMusiqueJeu();


            // =========================
            // ÉCRIRE LA LETTRE
            // =========================

            let caseActuelle =
                cases[debut + position];


            caseActuelle.textContent = lettre;


            // Animation

            caseActuelle.classList.remove(
                "letter-animation"
            );

            void caseActuelle.offsetWidth;

            caseActuelle.classList.add(
                "letter-animation"
            );


            position++;

            return;

        }


        // =========================
        // EFFACER
        // =========================

        if (
            event.key === "Backspace"
        ) {

            if (position > 0) {

                position--;

                cases[
                    debut + position
                ].textContent = "";

            }

            return;

        }


        // =========================
        // VALIDER
        // =========================

        if (
            event.key === "Enter"
        ) {

            validerMot();

            return;

        }

    }
);


// =========================
// VALIDER LE MOT
// =========================

function validerMot() {


    if (partieTerminee) {
        return;
    }


    // =========================
    // PAS ASSEZ DE LETTRES
    // =========================

    if (position < 5) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;

    }


    // =========================
    // CONSTRUIRE LE MOT
    // =========================

    let mot = "";

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        mot +=
            cases[
                debut + i
            ].textContent;

    }


    // =========================
    // MOT INEXISTANT
    // =========================

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


        console.log("VICTOIRE !");


        partieTerminee = true;


        // =========================
        // ARRÊTER WORDLE1
        // =========================

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        // =========================
        // LANCER VICTORY
        // =========================

        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play().catch(function(erreur) {

            console.error(
                "Impossible de lancer Victory :",
                erreur
            );

        });


        // =========================
        // ANIMATION VICTOIRE
        // =========================

        for (
            let i = 0;
            i < 5;
            i++
        ) {


            cases[
                debut + i
            ].classList.add("vert");


            mettreAJourClavier(
                mot[i],
                "vert"
            );


            setTimeout(
                function() {

                    cases[
                        debut + i
                    ].classList.add(
                        "victoire"
                    );

                },
                i * 100
            );

        }


        return;

    }


    // =========================
    // MAUVAIS MOT
    // =========================

    let lettresDisponibles =
        motSecret.split("");


    // =========================
    // PREMIÈRE PASSE : VERT
    // =========================

    for (
        let i = 0;
        i < 5;
        i++
    ) {

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


    // =========================
    // DEUXIÈME PASSE : JAUNE / GRIS
    // =========================

    for (
        let i = 0;
        i < 5;
        i++
    ) {


        // Déjà vert

        if (
            mot[i] === motSecret[i]
        ) {

            continue;

        }


        let positionLettre =
            lettresDisponibles.indexOf(
                mot[i]
            );


        // JAUNE

        if (
            positionLettre !== -1
        ) {

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


        // GRIS

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


    // =========================
    // LIGNE SUIVANTE
    // =========================

    ligne++;


    if (ligne === 6) {

        window.location = "perdu.html";

    }

    else {

        debut += 5;

        position = 0;

    }

}
