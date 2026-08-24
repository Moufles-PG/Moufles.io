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


// =========================================
// VARIABLES
// =========================================

let position = 0;

let ligne = 0;

let debut = 0;

let mots = [];

let motSecret = "";

let partieTerminee = false;

// La musique n'a pas encore commencé
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
// ÉCRIRE UNE LETTRE
// =========================================

function ecrireLettre(lettre) {

    if (partieTerminee) {

        return;

    }


    if (position >= 5) {

        return;

    }


    // Trouver la touche

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


    // Animation de la case

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    // Animation du clavier

    animerTouche(lettre);


    // Passer à la position suivante

    position++;

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


        // Lettre

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


        // Retour arrière

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


        // Entrée

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


        // Arrêter musique jeu

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        // Jouer victoire

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


        // Jouer Fail

        musiqueDefaite.currentTime = 0;

        musiqueDefaite.play()
            .catch(function() {});


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
    // LIGNE SUIVANTE
    // =====================================

    debut += 5;

    position = 0;

}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    function() {


        // Cacher écran

        ecranFin.style.display =
            "none";


        // Réinitialiser variables

        position = 0;

        ligne = 0;

        debut = 0;

        partieTerminee = false;

        musiqueLancee = false;


        // Effacer grille

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


        // Réinitialiser clavier

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


        // Arrêter les musiques

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime = 0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime = 0;


        // Nouveau mot

        choisirNouveauMot();

    }
);
