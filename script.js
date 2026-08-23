// =========================
// ÉLÉMENTS
// =========================

let cases = document.querySelectorAll(".case");
let touches = document.querySelectorAll(".touche");

let message = document.querySelector("#message");

let musiqueJeu = document.querySelector("#musiqueJeu");
let musiqueVictoire = document.querySelector("#musiqueVictoire");
let musiqueDefaite = document.querySelector("#musiqueDefaite");

let ecranDefaite = document.querySelector("#ecranDefaite");
let motPerdu = document.querySelector("#motPerdu");
let boutonRejouer = document.querySelector("#boutonRejouer");


// =========================
// VARIABLES
// =========================

let position = 0;
let ligne = 0;
let debut = 0;

let mots = [];
let motSecret = "";

let partieTerminee = false;


// =========================
// VOLUME
// =========================

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;
musiqueDefaite.volume = 0.25;


// =========================
// SONS
// =========================

let sonGood = new Audio("Good.mp3");
let sonFalse = new Audio("False.mp3");

sonGood.volume = 0.08;
sonFalse.volume = 0.08;


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
// ANIMATION DU CLAVIER
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
// COULEUR DU CLAVIER
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
// ÉCRIRE UNE LETTRE
// =========================

function ecrireLettre(lettre) {

    if (partieTerminee) {
        return;
    }


    if (position >= 5) {
        return;
    }


    // Chercher la touche

    let touche = null;

    touches.forEach(function(element) {

        if (element.textContent === lettre) {
            touche = element;
        }

    });


    // Son

    if (
        touche &&
        touche.classList.contains("gris")
    ) {

        sonFalse.currentTime = 0;

        sonFalse.play().catch(function() {});

    }

    else {

        sonGood.currentTime = 0;

        sonGood.play().catch(function() {});

    }


    // Écrire

    cases[
        debut + position
    ].textContent = lettre;


    // Animation

    cases[
        debut + position
    ].classList.remove("letter-animation");

    void cases[
        debut + position
    ].offsetWidth;

    cases[
        debut + position
    ].classList.add("letter-animation");


    // Animation clavier

    animerTouche(lettre);


    // Musique

    if (musiqueJeu.paused) {

        musiqueJeu.play().catch(function() {});

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


    // Entrée

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


        choisirNouveauMot();

    })

    .catch(function(erreur) {

        console.error(
            "Erreur avec mots.txt :",
            erreur
        );

    });


// =========================
// NOUVEAU MOT
// =========================

function choisirNouveauMot() {

    motSecret =
        mots[
            Math.floor(
                Math.random() * mots.length
            )
        ];


    console.log(
        "Mot secret :",
        motSecret
    );

}


// =========================
// VALIDER
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

        mot += cases[
            debut + i
        ].textContent;

    }


    console.log(
        "Mot proposé :",
        mot
    );


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


        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play().catch(function() {});


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
    // MAUVAISE RÉPONSE
    // =========================

    let lettresDisponibles =
        motSecret.split("");


    // Vert

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
    // FIN DES 6 ESSAIS
    // =========================

    ligne++;


    if (ligne === 6) {

        partieTerminee = true;


        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueDefaite.currentTime = 0;

        musiqueDefaite.play().catch(function() {});


        motPerdu.textContent = motSecret;


        ecranDefaite.style.display = "flex";


        return;

    }


    // Ligne suivante

    debut += 5;

    position = 0;

}


// =========================
// REJOUER
// =========================

boutonRejouer.addEventListener("click", function() {


    // Fermer l'écran

    ecranDefaite.style.display = "none";


    // Réinitialiser les variables

    position = 0;

    ligne = 0;

    debut = 0;

    partieTerminee = false;


    // Réinitialiser les cases

    cases.forEach(function(caseJeu) {

        caseJeu.textContent = "";

        caseJeu.classList.remove(
            "vert",
            "jaune",
            "gris",
            "victoire",
            "letter-animation"
        );

    });


    // Réinitialiser le clavier

    touches.forEach(function(touche) {

        touche.classList.remove(
            "vert",
            "jaune",
            "gris",
            "touche-appuyee"
        );

    });


    // Arrêter les musiques

    musiqueDefaite.pause();

    musiqueDefaite.currentTime = 0;


    musiqueVictoire.pause();

    musiqueVictoire.currentTime = 0;


    musiqueJeu.pause();

    musiqueJeu.currentTime = 0;


    // Nouveau mot

    choisirNouveauMot();

});
