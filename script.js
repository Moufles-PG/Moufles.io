// =========================================
// ÉLÉMENTS
// =========================================

let cases = document.querySelectorAll(".case");
let touches = document.querySelectorAll(".touche");
let lignes = document.querySelectorAll(".ligne");

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

    message.textContent = texte;

    message.style.opacity = "1";

    setTimeout(
        function() {

            message.style.opacity = "0";

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

    if (partieTerminee) {
        return;
    }


    if (position >= 5) {
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

        sonFalse.currentTime = 0;

        sonFalse.play()
            .catch(
                function() {}
            );

    } else {

        sonGood.currentTime = 0;

        sonGood.play()
            .catch(
                function() {}
            );
    }


    // Écrire la lettre

    let caseActuelle =
        cases[debut + position];


    caseActuelle.textContent =
        lettre;


    // Animation

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    // Clavier

    animerTouche(lettre);


    // Musique du jeu

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

        if (partieTerminee) {
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

                ecrireLettre(lettre);
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

            positionInitiale();
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
// AFFICHER LES BONNES LIGNES
// =========================================

function mettreAJourLignesVisibles() {

    /*
       Au départ :
       lignes 1, 2 et 3 visibles.

       Après essai 1 :
       ligne 4 apparaît.

       Après essai 2 :
       ligne 5 apparaît.

       Après essai 3 :
       ligne 6 apparaît.
    */

    lignes.forEach(
        function(uneLigne, index) {

            if (
                index <= ligne + 2
            ) {

                uneLigne.classList.add(
                    "ligne-visible"
                );

            } else {

                uneLigne.classList.remove(
                    "ligne-visible"
                );
            }
        }
    );
}


// =========================================
// POSITION DE LA GRILLE
// =========================================

function calculerPositionGrille() {

    let zone =
        zoneGrille.getBoundingClientRect();


    let feuilleHauteur =
        feuille.offsetHeight;


    /*
       Départ très bas.

       La grille commence près du clavier.
    */

    let positionBasse =
        zone.height -
        feuilleHauteur +
        80;


    /*
       Position finale.

       Au sixième essai, le haut de la
       grille arrive près du titre/message.
    */

    let positionHaute =
        -80;


    /*
       ligne = 0
       ligne = 1
       ligne = 2
       ...
       ligne = 5
    */

    let progression =
        ligne / 5;


    return (
        positionBasse +
        (
            positionHaute -
            positionBasse
        ) *
        progression
    );
}


// =========================================
// POSITION INITIALE
// =========================================

function positionInitiale() {

    mettreAJourLignesVisibles();


    let position =
        calculerPositionGrille();


    feuille.style.transform =
        `translate(-50%, ${position}px)`;
}


// =========================================
// POSITION ACTUELLE
// =========================================

function positionActuelle() {

    let matrice =
        new DOMMatrix(
            getComputedStyle(
                feuille
            ).transform
        );


    if (
        !matrice
    ) {

        return 0;
    }


    return matrice.m42;
}


// =========================================
// ANIMATION DE LA GRILLE
// =========================================

function animerGrille() {

    let anciennePosition =
        positionActuelle();


    /*
       On affiche d'abord la nouvelle ligne.
    */

    mettreAJourLignesVisibles();


    let nouvellePosition =
        calculerPositionGrille();


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
                                ) * 0.45
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

                duration: 800,

                easing:
                    "cubic-bezier(
                        0.22,
                        0.61,
                        0.36,
                        1
                    )",

                fill: "forwards"
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


    let casesLigne =
        ligneActuelle.querySelectorAll(
            ".case"
        );


    let premiereCase =
        casesLigne[0];

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


    // Son du chariot

    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


    // Déplacement vers la droite

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

                fill: "forwards"
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

                            fill: "forwards"
                        }
                    );


                /*
                   La grille monte en même temps
                   que le retour du chariot.
                */

                let mouvement =
                    animerGrille();


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


        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.currentTime =
            0;

        musiqueVictoire.play()
            .catch(
                function() {}
            );


        // Cases vertes

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


        // Écran final

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


    // Jaune / gris

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
            ] = null;

        } else {

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

        // Cacher écran final

        ecranFin.style.display =
            "none";


        // Variables

        position = 0;
        ligne = 0;
        debut = 0;

        partieTerminee =
            false;

        animationEnCours =
            false;


        // Effacer cases

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


        // Musiques

        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueVictoire.pause();
        musiqueVictoire.currentTime = 0;

        musiqueDefaite.pause();
        musiqueDefaite.currentTime = 0;


        // Chariot

        chariot.style.opacity =
            "0";


        chariot.getAnimations().forEach(
            function(animation) {

                animation.cancel();
            }
        );


        feuille.getAnimations().forEach(
            function(animation) {

                animation.cancel();
            }
        );


        // =====================================
        // RETOUR À LA POSITION DE DÉPART
        // =====================================

        /*
           On remet explicitement les trois
           premières lignes visibles.
        */

        mettreAJourLignesVisibles();


        /*
           On supprime l'ancienne transformation.
        */

        feuille.style.transform =
            "none";


        /*
           Force le navigateur à recalculer
           la hauteur maintenant que seules
           les trois premières lignes sont
           visibles.
        */

        void feuille.offsetHeight;


        /*
           Recalcul de la position de départ.
        */

        let position =
            calculerPositionGrille();


        feuille.style.transform =
            `translate(
                -50%,
                ${position}px
            )`;


        // Nouveau mot

        choisirNouveauMot();
    }
);
