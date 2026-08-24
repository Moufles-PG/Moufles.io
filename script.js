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

let feuille =
    document.querySelector("#feuille");

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

let animationEnCours = false;


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


            // VERT

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


            // JAUNE

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


            // GRIS

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
        partieTerminee ||
        animationEnCours
    ) {

        return;

    }


    if (
        position >= 5
    ) {

        return;

    }


    // Trouver la touche

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


    // Son de touche

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


    // Écrire dans la case

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


    // Animation du clavier

    animerTouche(
        lettre
    );


    // =====================================
    // MUSIQUE DU JEU
    // =====================================

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
            partieTerminee ||
            animationEnCours
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

                            return (
                                mot.length === 5
                            );

                        }
                    );


            console.log(
                "Mots chargés :",
                mots.length
            );


            choisirNouveauMot();

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
// CALCULER LA POSITION DE LA GRILLE
// =========================================

function calculerPositionsGrille() {

    let zone =
        zoneGrille.getBoundingClientRect();


    let feuilleHauteur =
        feuille.offsetHeight;


    /*
       POSITION BASSE

       Le +35 permet de faire commencer
       la grille encore plus bas.
    */

    let positionBasse =
        zone.height -
        feuilleHauteur +
        35;


    /*
       POSITION HAUTE

       Le -35 permet de faire monter
       la grille davantage au sixième essai.
    */

    let positionHaute =
        -35;


    /*
       Progression :

       ligne 0 → position basse
       ligne 1 → 20 %
       ligne 2 → 40 %
       ligne 3 → 60 %
       ligne 4 → 80 %
       ligne 5 → position haute
    */

    let progression =
        ligne / 5;


    let position =
        positionBasse +
        (
            positionHaute -
            positionBasse
        ) *
        progression;


    return position;

}


// =========================================
// POSITION INITIALE
// =========================================

function positionInitiale() {

    let position =
        calculerPositionsGrille();


    feuille.style.transform =
        `translate(
            -50%,
            ${position}px
        )`;

}


// =========================================
// POSITION ACTUELLE
// =========================================

function calculerPositionActuelle() {

    let style =
        getComputedStyle(
            feuille
        );


    if (
        style.transform === "none"
    ) {

        return 0;

    }


    let matrice =
        new DOMMatrix(
            style.transform
        );


    return matrice.m42;

}


// =========================================
// ANIMATION DE LA GRILLE
// =========================================

function animerFeuille() {

    let anciennePosition =
        calculerPositionActuelle();


    let nouvellePosition =
        calculerPositionsGrille();


    let animation =
        feuille.animate(

            [

                {
                    transform:
                        `translate(
                            -50%,
                            ${anciennePosition}px
                        )`
                },

                {
                    transform:
                        `translate(
                            -50%,
                            ${
                                anciennePosition +
                                (
                                    nouvellePosition -
                                    anciennePosition
                                ) * 0.82
                            }px
                        )`
                },

                {
                    transform:
                        `translate(
                            -50%,
                            ${nouvellePosition}px
                        )`
                }

            ],

            {

                duration: 750,

                easing:
                    "cubic-bezier(
                        0.22,
                        0.61,
                        0.36,
                        1
                    )",

                fill:
                    "forwards"

            }

        );


    return animation.finished

        .then(
            function() {

                feuille.style.transform =
                    `translate(
                        -50%,
                        ${nouvellePosition}px
                    )`;

            }
        );

}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

    let ligneActuelle =
        lignes[
            ligne - 1
        ];


    if (
        !ligneActuelle
    ) {

        return Promise.resolve();

    }


    let premiereCase =
        ligneActuelle.querySelector(
            ".case"
        );


    let casesLigne =
        ligneActuelle.querySelectorAll(
            ".case"
        );


    let derniereCase =
        casesLigne[4];


    let feuilleRect =
        feuille.getBoundingClientRect();


    let premiereRect =
        premiereCase.getBoundingClientRect();


    let derniereRect =
        derniereCase.getBoundingClientRect();


    let depart =
        premiereRect.left -
        feuilleRect.left -
        10;


    let arrivee =
        derniereRect.right -
        feuilleRect.left +
        10;


    let haut =
        premiereRect.top -
        feuilleRect.top -
        5;


    chariot.style.left =
        depart + "px";


    chariot.style.top =
        haut + "px";


    chariot.style.opacity =
        "1";


    // Son de machine à écrire

    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


    // Aller vers la droite

    let aller =
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

                duration: 420,

                easing:
                    "cubic-bezier(
                        0.12,
                        0.8,
                        0.25,
                        1
                    )",

                fill:
                    "forwards"

            }

        );


    return aller.finished

        .then(
            function() {

                return new Promise(
                    function(resolve) {

                        setTimeout(
                            resolve,
                            80
                        );

                    }
                );

            }
        )

        .then(
            function() {

                // Retour du chariot

                let retour =
                    chariot.animate(

                        [

                            {
                                left:
                                    arrivee + "px"
                            },

                            {
                                left:
                                    arrivee - 8 + "px"
                            },

                            {
                                left:
                                    depart + "px"
                            }

                        ],

                        {

                            duration: 340,

                            easing:
                                "cubic-bezier(
                                    0.55,
                                    0.05,
                                    0.68,
                                    0.19
                                )",

                            fill:
                                "forwards"

                        }

                    );


                // En même temps,
                // la grille monte.

                let mouvement =
                    animerFeuille();


                return Promise.all(
                    [
                        retour.finished,
                        mouvement
                    ]
                );

            }
        )

        .then(
            function() {

                chariot.style.opacity =
                    "0";

            }
        );

}


// =========================================
// VALIDER LE MOT
// =========================================

function validerMot() {

    if (
        partieTerminee ||
        animationEnCours
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


    // Mot inexistant

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        return;

    }


    // =====================================
    // VICTOIRE
    // =====================================

    if (
        mot === motSecret
    ) {

        partieTerminee =
            true;


        // Arrêter musique du jeu

        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        // Jouer victoire

        musiqueVictoire.currentTime =
            0;

        musiqueVictoire.play()
            .catch(
                function() {}
            );


        // Colorer les cases

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


    // Lettres jaunes ou grises

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


    // =====================================
    // ANIMATION
    // =====================================

    animationEnCours =
        true;


    animerChariot()

        .then(
            function() {

                debut += 5;

                position = 0;

                animationEnCours =
                    false;

            }
        );

}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    function() {

        // Cacher l'écran de fin

        ecranFin.style.display =
            "none";


        // =====================================
        // RÉINITIALISER LES VARIABLES
        // =====================================

        position = 0;

        ligne = 0;

        debut = 0;

        partieTerminee =
            false;

        animationEnCours =
            false;


        // =====================================
        // EFFACER LA GRILLE
        // =====================================

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


        // =====================================
        // RÉINITIALISER LE CLAVIER
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

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime =
            0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime =
            0;


        // =====================================
        // CACHER LE CHARIOT
        // =====================================

        chariot.style.opacity =
            "0";


        // =====================================
        // ANNULER LES ANIMATIONS
        // =====================================

        feuille.getAnimations().forEach(
            function(animation) {

                animation.cancel();

            }
        );


        chariot.getAnimations().forEach(
            function(animation) {

                animation.cancel();

            }
        );


        // =====================================
        // FORCER LE RETOUR À LA POSITION
        // DE DÉPART
        // =====================================

        /*
           On enlève momentanément la
           transformation précédente.
        */

        feuille.style.transform =
            "none";


        /*
           On force le navigateur à
           recalculer la grille.
        */

        void feuille.offsetHeight;


        /*
           Maintenant ligne = 0,
           donc calculerPositionsGrille()
           renvoie bien la position basse.
        */

        let position =
            calculerPositionsGrille();


        feuille.style.transform =
            `translate(
                -50%,
                ${position}px
            )`;


        // =====================================
        // NOUVEAU MOT
        // =====================================

        choisirNouveauMot();

    }
);
