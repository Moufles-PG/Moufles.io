// =========================================
// ÉLÉMENTS
// =========================================

let cases =
    document.querySelectorAll(".case");

let touches =
    document.querySelectorAll(".touche");

let lignes =
    document.querySelectorAll(".ligne");

let message =
    document.querySelector("#message");

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

let grille =
    document.querySelector(".feuille");

let zoneGrille =
    document.querySelector(".zone-grille");

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


// =========================================
// VOLUME
// =========================================

musiqueJeu.volume = 0.15;

musiqueVictoire.volume = 0.25;

musiqueDefaite.volume = 0.25;


// =========================================
// SONS
// =========================================

let sonGood =
    new Audio("Good.mp3");

let sonFalse =
    new Audio("False.mp3");

let sonChariot =
    new Audio("Typewirter.mp3");


sonGood.volume = 0.05;

sonFalse.volume = 0.05;

sonChariot.volume = 0.25;


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

    message.textContent =
        texte;

    message.style.opacity =
        "1";


    setTimeout(
        function() {

            message.style.opacity =
                "0";

        },
        1500
    );
}


// =========================================
// ANIMATION TOUCHE
// =========================================

function animerTouche(lettre) {

    touches.forEach(
        function(touche) {

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

        }
    );
}


// =========================================
// COULEUR DU CLAVIER
// =========================================

function mettreAJourClavier(
    lettre,
    couleur
) {

    touches.forEach(
        function(touche) {

            if (
                touche.textContent !== lettre
            ) {

                return;
            }


            if (
                couleur === "vert"
            ) {

                touche.classList.remove(
                    "jaune",
                    "gris"
                );

                touche.classList.add(
                    "vert"
                );
            }


            if (
                couleur === "jaune"
            ) {

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


            if (
                couleur === "gris"
            ) {

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

        }
    );
}


// =========================================
// ÉCRIRE UNE LETTRE
// =========================================

function ecrireLettre(lettre) {

    if (
        partieTerminee
    ) {

        return;
    }


    if (
        position >= 5
    ) {

        return;
    }


    let touche = null;


    touches.forEach(
        function(element) {

            if (
                element.textContent === lettre
            ) {

                touche = element;
            }

        }
    );


    // Son

    if (
        touche &&
        touche.classList.contains("gris")
    ) {

        sonFalse.currentTime =
            0;

        sonFalse.play()
            .catch(
                function() {}
            );

    }

    else {

        sonGood.currentTime =
            0;

        sonGood.play()
            .catch(
                function() {}
            );
    }


    // Case actuelle

    let caseActuelle =
        cases[
            debut + position
        ];


    caseActuelle.textContent =
        lettre;


    // Animation de la lettre

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    // Animation clavier

    animerTouche(
        lettre
    );


    // Musique

    if (
        musiqueJeu.paused
    ) {

        musiqueJeu.play()
            .catch(
                function() {}
            );
    }


    position++;
}


// =========================================
// CLAVIER PHYSIQUE
// =========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            partieTerminee
        ) {

            return;
        }


        // Lettre

        if (
            event.key.length === 1
        ) {

            let lettre =
                enleverAccents(
                    event.key.toUpperCase()
                );


            if (
                /^[A-Z]$/.test(lettre)
            ) {

                ecrireLettre(
                    lettre
                );
            }


            return;
        }


        // Retour arrière

        if (
            event.key === "Backspace"
        ) {

            if (
                position > 0
            ) {

                position--;

                cases[
                    debut + position
                ].textContent =
                    "";

                cases[
                    debut + position
                ].classList.remove(
                    "letter-animation"
                );
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

touches.forEach(
    function(touche) {

        touche.addEventListener(
            "click",
            function() {

                ecrireLettre(
                    touche.textContent
                );

            }
        );

    }
);


// =========================================
// CHARGER LES MOTS
// =========================================

fetch("mots.txt")

    .then(
        function(response) {

            return response.text();

        }
    )

    .then(
        function(texte) {

            mots =
                texte
                    .split(/\r?\n/)

                    .map(
                        function(mot) {

                            return enleverAccents(
                                mot
                                    .trim()
                                    .toUpperCase()
                            );

                        }
                    )

                    .filter(
                        function(mot) {

                            return mot.length === 5;

                        }
                    );


            console.log(
                "Mots chargés :",
                mots.length
            );


            choisirNouveauMot();

            initialiserGrille();

        }
    )

    .catch(
        function(erreur) {

            console.error(
                "Erreur avec mots.txt :",
                erreur
            );

        }
    );


// =========================================
// CHOISIR UN MOT
// =========================================

function choisirNouveauMot() {

    if (
        mots.length === 0
    ) {

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
// CALCULER LE PAS
// =========================================
//
// Une montée = exactement la distance
// entre deux lignes.
//

function obtenirPas() {

    let ligneRect =
        lignes[0].getBoundingClientRect();


    let hauteur =
        ligneRect.height;


    let style =
        getComputedStyle(
            grille
        );


    let gap =
        parseFloat(
            style.gap
        ) || 0;


    return hauteur + gap;
}


// =========================================
// POSITION DE LA GRILLE
// =========================================
//
// La grille est une vraie feuille
// contenant les 6 lignes.
//
// Au départ :
//
//        ligne 1
//        ligne 2
//        ligne 3
//        ligne 4
//        ligne 5
//        ligne 6
//
// Les lignes du dessous sont simplement
// cachées par .zone-grille.
//
// À chaque essai, toute la feuille
// monte d'un seul pas.
//

function positionnerGrille(animation) {

    let zoneRect =
        zoneGrille.getBoundingClientRect();


    let ligneRect =
        lignes[0].getBoundingClientRect();


    let hauteurLigne =
        ligneRect.height;


    let pas =
        obtenirPas();


    /*
       Position de départ.

       Le bas de la ligne 1 arrive
       exactement au bas de la zone.
    */

    let depart =
        zoneRect.height -
        hauteurLigne -
        30;


    /*
       Une ligne montée par essai.
    */

    let positionVerticale =
        depart -
        (
            ligne * pas
        );


    if (
        animation
    ) {

        grille.style.transition =
            "transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";

    }

    else {

        grille.style.transition =
            "none";
    }


    grille.style.transform =
        `
        translateX(-50%)
        translateY(${positionVerticale}px)
        `;
}


// =========================================
// INITIALISATION
// =========================================

function initialiserGrille() {

    position =
        0;

    ligne =
        0;

    debut =
        0;


    /*
       IMPORTANT :

       On ne cache aucune ligne avec
       JavaScript.

       Les 6 lignes existent dès le départ.

       C'est .zone-grille avec
       overflow: hidden qui décide
       lesquelles sont visibles.
    */


    requestAnimationFrame(
        function() {

            positionnerGrille(
                false
            );

        }
    );
}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

    /*
       Si aucun chariot n'existe,
       on monte directement.
    */

    if (
        !chariot
    ) {

        positionnerGrille(
            true
        );

        return;
    }


    /*
       Son de machine à écrire.
    */

    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


    /*
       Ligne actuellement terminée.
    */

    let ancienneLigne =
        lignes[
            ligne - 1
        ];


    if (
        !ancienneLigne
    ) {

        positionnerGrille(
            true
        );

        return;
    }


    let casesLigne =
        ancienneLigne.querySelectorAll(
            ".case"
        );


    let premiereCase =
        casesLigne[0];

    let derniereCase =
        casesLigne[4];


    let grilleRect =
        grille.getBoundingClientRect();


    let premiereRect =
        premiereCase.getBoundingClientRect();


    let derniereRect =
        derniereCase.getBoundingClientRect();


    let depart =
        premiereRect.left -
        grilleRect.left -
        8;


    let arrivee =
        derniereRect.right -
        grilleRect.left +
        8;


    let haut =
        premiereRect.top -
        grilleRect.top -
        4;


    chariot.style.left =
        depart + "px";


    chariot.style.top =
        haut + "px";


    chariot.style.opacity =
        "1";


    /*
       Chariot vers la droite.
    */

    let mouvement =
        chariot.animate(
            [
                {
                    left:
                        depart + "px"
                },

                {
                    left:
                        arrivee + "px"
                }
            ],
            {
                duration:
                    400,

                easing:
                    "ease-out",

                fill:
                    "forwards"
            }
        );


    mouvement.finished.then(
        function() {

            /*
               Retour du chariot.
            */

            let retour =
                chariot.animate(
                    [
                        {
                            left:
                                arrivee + "px"
                        },

                        {
                            left:
                                depart + "px"
                        }
                    ],
                    {
                        duration:
                            300,

                        easing:
                            "ease-in-out",

                        fill:
                            "forwards"
                    }
                );


            retour.finished.then(
                function() {

                    /*
                       MAINTENANT seulement,
                       la feuille monte.

                       Elle monte d'UNE SEULE
                       hauteur de ligne.
                    */

                    positionnerGrille(
                        true
                    );


                    setTimeout(
                        function() {

                            chariot.style.opacity =
                                "0";

                        },
                        400
                    );

                }
            );

        }
    );
}


// =========================================
// VALIDER LE MOT
// =========================================

function validerMot() {

    if (
        partieTerminee
    ) {

        return;
    }


    // Pas assez de lettres

    if (
        position < 5
    ) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;
    }


    // Construire le mot

    let mot =
        "";


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


    // Mot inexistant

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        return;
    }


    // =========================================
    // VICTOIRE
    // =========================================

    if (
        mot === motSecret
    ) {

        partieTerminee =
            true;


        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.currentTime =
            0;

        musiqueVictoire.play()
            .catch(
                function() {}
            );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            cases[
                debut + i
            ].classList.add(
                "vert"
            );


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


    // =========================================
    // VÉRIFICATION DES LETTRES
    // =========================================

    let lettresDisponibles =
        motSecret.split("");


    // Lettres vertes

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
            ].classList.add(
                "vert"
            );


            mettreAJourClavier(
                mot[i],
                "vert"
            );


            lettresDisponibles[i] =
                null;
        }
    }


    // Lettres jaunes / grises

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
            ].classList.add(
                "jaune"
            );


            mettreAJourClavier(
                mot[i],
                "jaune"
            );


            lettresDisponibles[
                positionLettre
            ] =
                null;

        }

        else {

            cases[
                debut + i
            ].classList.add(
                "gris"
            );


            mettreAJourClavier(
                mot[i],
                "gris"
            );
        }
    }


    // =========================================
    // PASSER À LA LIGNE SUIVANTE
    // =========================================

    ligne++;


    // =========================================
    // DÉFAITE
    // =========================================

    if (
        ligne === 6
    ) {

        partieTerminee =
            true;


        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        musiqueDefaite.currentTime =
            0;

        musiqueDefaite.play()
            .catch(
                function() {}
            );


        titreFin.textContent =
            "PERDU";


        texteFin.textContent =
            "Le mot était :";


        motFin.textContent =
            motSecret;


        ecranFin.style.display =
            "flex";


        return;
    }


    // =========================================
    // NOUVELLE LIGNE
    // =========================================

    debut +=
        5;

    position =
        0;


    /*
       La feuille monte d'une seule ligne.
    */

    animerChariot();
}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    function() {

        ecranFin.style.display =
            "none";


        partieTerminee =
            false;

        position =
            0;

        ligne =
            0;

        debut =
            0;


        // Effacer les cases

        cases.forEach(
            function(caseJeu) {

                caseJeu.textContent =
                    "";

                caseJeu.classList.remove(
                    "vert",
                    "jaune",
                    "gris",
                    "victoire",
                    "letter-animation"
                );

            }
        );


        // Réinitialiser le clavier

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

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime =
            0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime =
            0;


        // Cacher le chariot

        if (
            chariot
        ) {

            chariot.style.opacity =
                "0";
        }


        // Nouveau mot

        choisirNouveauMot();


        // Revenir au début

        initialiserGrille();

    }
);


// =========================================
// REDIMENSIONNEMENT
// =========================================

window.addEventListener(
    "resize",
    function() {

        if (
            !partieTerminee
        ) {

            positionnerGrille(
                false
            );
        }

    }
);
