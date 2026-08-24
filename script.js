// =========================================
// ÉLÉMENTS
// =========================================

let cases = document.querySelectorAll(".case");

let touches = document.querySelectorAll(".touche");

let message = document.querySelector("#message");

let musiqueJeu =
    document.querySelector("#musiqueJeu");

let musiqueVictoire =
    document.querySelector("#musiqueVictoire");

let musiqueDefaite =
    document.querySelector("#musiqueDefaite");

let ecranFin =
    document.querySelector("#ecranFin");

let titreFin =
    document.querySelector("#titreFin");

let texteFin =
    document.querySelector("#texteFin");

let motFin =
    document.querySelector("#motFin");

let boutonRejouer =
    document.querySelector("#boutonRejouer");

let chariot =
    document.querySelector("#chariot");


// =========================================
// VARIABLES
// =========================================

let position = 0;

let ligne = 0;

let debut = 0;

let mots = [];

let motSecret = "";

let partieTerminee = false;

// La musique du jeu n'a pas encore commencé
let musiqueLancee = false;


// =========================================
// VOLUME
// =========================================

musiqueJeu.volume = 0.15;

musiqueVictoire.volume = 0.25;

musiqueDefaite.volume = 0.25;


// =========================================
// SONS DES TOUCHES
// =========================================

let sonGood =
    new Audio("Good.mp3");

let sonFalse =
    new Audio("False.mp3");


// Volume léger

sonGood.volume = 0.05;

sonFalse.volume = 0.05;


// =========================================
// ENLEVER LES ACCENTS
// =========================================

function enleverAccents(texte) {

    return texte
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// =========================================
// MESSAGE
// =========================================

function afficherMessage(texte) {

    message.textContent = texte;

    message.style.opacity = "1";


    setTimeout(function() {

        message.style.opacity = "0";

    }, 1500);

}


// =========================================
// ANIMATION TOUCHE
// =========================================

function animerTouche(lettre) {

    touches.forEach(function(touche) {

        if (
            touche.textContent === lettre
        ) {

            touche.classList.remove(
                "touche-appuyee"
            );

            void touche.offsetWidth;

            touche.classList.add(
                "touche-appuyee"
            );

        }

    });

}


// =========================================
// COULEUR TOUCHE
// =========================================

function mettreAJourClavier(
    lettre,
    couleur
) {

    touches.forEach(function(touche) {

        if (
            touche.textContent !== lettre
        ) {

            return;

        }


        // VERT

        if (couleur === "vert") {

            touche.classList.remove(
                "jaune"
            );

            touche.classList.remove(
                "gris"
            );

            touche.classList.add(
                "vert"
            );

        }


        // JAUNE

        if (couleur === "jaune") {

            if (
                !touche.classList.contains(
                    "vert"
                )
            ) {

                touche.classList.remove(
                    "gris"
                );

                touche.classList.add(
                    "jaune"
                );

            }

        }


        // GRIS

        if (couleur === "gris") {

            if (
                !touche.classList.contains(
                    "vert"
                ) &&
                !touche.classList.contains(
                    "jaune"
                )
            ) {

                touche.classList.add(
                    "gris"
                );

            }

        }

    });

}


// =========================================
// POSITION DU CHARIOT
// =========================================

function positionnerChariot() {

    if (position >= 5) {

        return;

    }


    let caseActuelle =
        cases[debut + position];


    if (!caseActuelle) {

        return;

    }


    let positionCase =
        caseActuelle.offsetLeft;


    let positionHaut =
        caseActuelle.offsetTop;


    chariot.style.left =
        (
            positionCase +
            caseActuelle.offsetWidth -
            3
        ) + "px";


    chariot.style.top =
        (
            positionHaut
        ) + "px";


    chariot.classList.add(
        "visible"
    );

}


// =========================================
// RETOUR DE CHARIOT
// =========================================

function animerRetourChariot() {

    chariot.classList.remove(
        "retour"
    );


    // Force le navigateur à
    // recommencer l'animation

    void chariot.offsetWidth;


    chariot.classList.add(
        "retour"
    );


    setTimeout(
        function() {

            chariot.classList.remove(
                "retour"
            );

        },
        450
    );

}


// =========================================
// ÉCRIRE UNE LETTRE
// =========================================

function ecrireLettre(lettre) {

    if (partieTerminee) {

        return;

    }


    if (position >= 5) {

        return;

    }


    // =====================================
    // TROUVER LA TOUCHE
    // =====================================

    let touche = null;


    touches.forEach(function(element) {

        if (
            element.textContent === lettre
        ) {

            touche = element;

        }

    });


    // =====================================
    // SON DE LA TOUCHE
    // =====================================

    if (
        touche &&
        touche.classList.contains("gris")
    ) {

        sonFalse.currentTime = 0;

        sonFalse.play()
            .catch(function() {});

    }

    else {

        sonGood.currentTime = 0;

        sonGood.play()
            .catch(function() {});

    }


    // =====================================
    // ÉCRIRE LA LETTRE
    // =====================================

    let caseActuelle =
        cases[debut + position];


    caseActuelle.textContent =
        lettre;


    // =====================================
    // ANIMATION DE LA LETTRE
    // =====================================

    caseActuelle.classList.remove(
        "letter-animation"
    );


    void caseActuelle.offsetWidth;


    caseActuelle.classList.add(
        "letter-animation"
    );


    // =====================================
    // ANIMATION DU CLAVIER
    // =====================================

    animerTouche(lettre);


    // =====================================
    // PASSER À LA POSITION SUIVANTE
    // =====================================

    position++;


    // =====================================
    // DÉPLACER LE CHARIOT
    // =====================================

    if (position < 5) {

        positionnerChariot();

    }

}


// =========================================
// CLAVIER PHYSIQUE
// =========================================

document.addEventListener(
    "keydown",
    function(event) {


        if (partieTerminee) {

            return;

        }


        // =====================================
        // LETTRE
        // =====================================

        if (event.key.length === 1) {

            let lettre =
                enleverAccents(
                    event.key.toUpperCase()
                );


            if (
                /^[A-Z]$/.test(lettre)
            ) {

                ecrireLettre(lettre);

            }


            return;

        }


        // =====================================
        // RETOUR ARRIÈRE
        // =====================================

        if (
            event.key === "Backspace"
        ) {

            if (position > 0) {

                position--;


                cases[
                    debut + position
                ].textContent = "";


                positionnerChariot();

            }


            return;

        }


        // =====================================
        // ENTRÉE
        // =====================================

        if (
            event.key === "Enter"
        ) {

            validerMot();

        }

    }
);


// =========================================
// CLAVIER VIRTUEL
// =========================================

touches.forEach(function(touche) {

    touche.addEventListener(
        "click",
        function() {

            ecrireLettre(
                touche.textContent
            );

        }
    );

});


// =========================================
// CHARGER LES MOTS
// =========================================

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


// =========================================
// CHOISIR UN MOT
// =========================================

function choisirNouveauMot() {

    if (mots.length === 0) {

        return;

    }


    motSecret =
        mots[
            Math.floor(
                Math.random() *
                mots.length
            )
        ];


    console.log(
        "Mot secret :",
        motSecret
    );

}


// =========================================
// VALIDER LE MOT
// =========================================

function validerMot() {

    if (partieTerminee) {

        return;

    }


    // =====================================
    // PAS ASSEZ DE LETTRES
    // =====================================

    if (position < 5) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;

    }


    // =====================================
    // CONSTRUIRE LE MOT
    // =====================================

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


    // =====================================
    // MOT INEXISTANT
    // =====================================

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        return;

    }


    // =====================================
    // PREMIER MOT VALIDÉ
    // =====================================

    if (!musiqueLancee) {

        musiqueLancee = true;

        musiqueJeu.play()
            .catch(function() {});

    }


    // =====================================
    // VICTOIRE
    // =====================================

    if (
        mot === motSecret
    ) {

        partieTerminee = true;


        // Arrêter musique du jeu

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        // Musique victoire

        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play()
            .catch(function() {});


        // Colorer les cases

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


        // Cacher le chariot

        chariot.classList.remove(
            "visible"
        );


        // Écran de victoire

        setTimeout(
            function() {

                titreFin.textContent =
                    "GAGNÉ";


                texteFin.textContent =
                    "Le mot était :";


                motFin.textContent =
                    motSecret;


                ecranFin.style.display =
                    "flex";

            },
            700
        );


        return;

    }


    // =====================================
    // VÉRIFICATION DES LETTRES
    // =====================================

    let lettresDisponibles =
        motSecret.split("");


    // =====================================
    // LETTRES VERTES
    // =====================================

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


            lettresDisponibles[i] =
                null;

        }

    }


    // =====================================
    // LETTRES JAUNES OU GRISES
    // =====================================

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        if (
            mot[i] === motSecret[i]
        ) {

            continue;

        }


        let positionLettre =
            lettresDisponibles.indexOf(
                mot[i]
            );


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


    // =====================================
    // RETOUR DE CHARIOT
    // =====================================

    animerRetourChariot();


    // =====================================
    // PASSER À LA LIGNE SUIVANTE
    // =====================================

    ligne++;


    // =====================================
    // DÉFAITE
    // =====================================

    if (
        ligne === 6
    ) {

        partieTerminee = true;


        // Arrêter musique jeu

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        // Musique de défaite

        musiqueDefaite.currentTime = 0;

        musiqueDefaite.play()
            .catch(function() {});


        // Cacher le chariot

        chariot.classList.remove(
            "visible"
        );


        // Afficher le mot

        titreFin.textContent =
            "PERDU";


        texteFin.textContent =
            "Le mot était :";


        motFin.textContent =
            motSecret;


        // Afficher écran

        ecranFin.style.display =
            "flex";


        return;

    }


    // =====================================
    // NOUVELLE LIGNE
    // =====================================

    setTimeout(
        function() {

            debut += 5;

            position = 0;

            positionnerChariot();

        },
        450
    );

}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    function() {


        // =====================================
        // CACHER ÉCRAN DE FIN
        // =====================================

        ecranFin.style.display =
            "none";


        // =====================================
        // RÉINITIALISER VARIABLES
        // =====================================

        position = 0;

        ligne = 0;

        debut = 0;

        partieTerminee = false;

        musiqueLancee = false;


        // =====================================
        // EFFACER GRILLE
        // =====================================

        cases.forEach(
            function(caseJeu) {

                caseJeu.textContent = "";

                caseJeu.classList.remove(
                    "vert",
                    "jaune",
                    "gris",
                    "victoire",
                    "letter-animation"
                );

            }
        );


        // =====================================
        // RÉINITIALISER CLAVIER
        // =====================================

        touches.forEach(
            function(touche) {

                touche.classList.remove(
                    "vert",
                    "jaune",
                    "gris",
                    "touche-appuyee"
                );

            }
        );


        // =====================================
        // ARRÊTER LES MUSIQUES
        // =====================================

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime = 0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime = 0;


        // =====================================
        // RÉINITIALISER CHARIOT
        // =====================================

        chariot.classList.remove(
            "visible",
            "retour"
        );


        // =====================================
        // NOUVEAU MOT
        // =====================================

        choisirNouveauMot();


        // =====================================
        // POSITIONNER CHARIOT
        // =====================================

        positionnerChariot();

    }
);


// =========================================
// PREMIÈRE POSITION DU CHARIOT
// =========================================

positionnerChariot();
