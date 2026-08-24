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

let chariot =
    document.querySelector("#chariot");

let feuille =
    document.querySelector(".feuille");

let zoneGrille =
    document.querySelector(".zone-grille");


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
// ACCENTS
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


    if (
        touche &&
        touche.classList.contains("gris")
    ) {

        sonFalse.currentTime = 0;

        sonFalse.play()
            .catch(
                function() {}
            );

    }

    else {

        sonGood.currentTime = 0;

        sonGood.play()
            .catch(
                function() {}
            );

    }


    let caseActuelle =
        cases[
            debut + position
        ];


    caseActuelle.textContent =
        lettre;


    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    animerTouche(
        lettre
    );


    // Musique après première lettre

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
// POSITIONNER LA FEUILLE
// =========================================

function positionnerLigneActuelle() {

    if (
        !lignes[ligne]
    ) {

        return;

    }


    let zoneRect =
        zoneGrille.getBoundingClientRect();


    let ligneRect =
        lignes[ligne].getBoundingClientRect();


    let centreZone =
        zoneRect.top +
        zoneRect.height / 2;


    let centreLigne =
        ligneRect.top +
        ligneRect.height / 2;


    let difference =
        centreZone -
        centreLigne;


    let transformation =
        feuille.getBoundingClientRect();


    /*
       On récupère la transformation
       actuelle et on ajoute uniquement
       la distance nécessaire.
    */

    return difference;

}


// =========================================
// ANIMATION DE LA FEUILLE
// =========================================

function faireMonterLaFeuille() {

    let difference =
        positionnerLigneActuelle();


    if (
        difference === undefined
    ) {

        return Promise.resolve();

    }


    let matrice =
        new DOMMatrix(
            getComputedStyle(
                feuille
            ).transform
        );


    let departY =
        matrice.m42;


    let arriveeY =
        departY + difference;


    /*
       Mouvement de papier :

       départ
       ↓
       accélération
       ↓
       montée
       ↓
       petit dépassement
       ↓
       retour
    */

    let animation =
        feuille.animate(

            [

                {
                    transform:
                        `translate(-50%, calc(-50% + ${departY}px))`
                },

                {
                    transform:
                        `translate(-50%, calc(-50% + ${arriveeY * 0.72}px))`
                },

                {
                    transform:
                        `translate(-50%, calc(-50% + ${arriveeY * 1.04}px))`
                },

                {
                    transform:
                        `translate(-50%, calc(-50% + ${arriveeY}px))`
                }

            ],

            {

                duration: 800,

                easing:
                    "cubic-bezier(0.22, 0.61, 0.36, 1)",

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
                        calc(-50% + ${arriveeY}px)
                    )`;

            }
        );

}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

    let ligneActuelle =
        lignes[ligne - 1];


    if (
        !ligneActuelle
    ) {

        return Promise.resolve();

    }


    let premiereCase =
        ligneActuelle.querySelector(
            ".case"
        );


    let derniereCase =
        ligneActuelle.querySelectorAll(
            ".case"
        )[4];


    let grilleRect =
        feuille.getBoundingClientRect();


    let premiereRect =
        premiereCase.getBoundingClientRect();


    let derniereRect =
        derniereCase.getBoundingClientRect();


    let depart =
        premiereRect.left
        - grilleRect.left
        - 10;


    let arrivee =
        derniereRect.right
        - grilleRect.left
        + 10;


    let haut =
        premiereRect.top
        - grilleRect.top
        - 5;


    chariot.style.left =
        depart + "px";

    chariot.style.top =
        haut + "px";

    chariot.style.opacity =
        "1";


    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


    /*
       CHARIOT → DROITE
    */

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

                duration: 400,

                easing:
                    "cubic-bezier(0.12, 0.8, 0.25, 1)",

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
                            100
                        );

                    }
                );

            }
        )

        .then(
            function() {

                /*
                   CHARIOT ← RETOUR
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
                                    arrivee - 8 + "px"
                            },

                            {
                                left:
                                    depart + "px"
                            }

                        ],

                        {

                            duration: 360,

                            easing:
                                "cubic-bezier(0.55, 0.05, 0.68, 0.19)",

                            fill:
                                "forwards"

                        }

                    );


                /*
                   LE PAPIER MONTE EN MÊME TEMPS
                */

                let feuilleMonte =
                    faireMonterLaFeuille();


                return Promise.all(
                    [
                        retour.finished,
                        feuilleMonte
                    ]
                );

            }
        )

        .then(
            function() {

                chariot.style.opacity =
                    "0";

            }
        )

        .catch(
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


    if (
        position < 5
    ) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;

    }


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


    // =====================================
    // LETTRES VERTES
    // =====================================

    let lettresDisponibles =
        motSecret.split("");


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


    // =====================================
    // JAUNE / GRIS
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
    // LIGNE SUIVANTE
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


        ecranFin.style.display =
            "none";


        position = 0;

        ligne = 0;

        debut = 0;

        partieTerminee =
            false;

        animationEnCours =
            false;


        // Effacer grille

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


        // Revenir à la position initiale

        feuille
            .getAnimations()
            .forEach(
                function(animation) {

                    animation.cancel();

                }
            );


        feuille.style.transform =
            "translate(-50%, -50%)";


        // Clavier

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

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime =
            0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime =
            0;


        // Chariot

        chariot.style.opacity =
            "0";


        // Nouveau mot

        choisirNouveauMot();

    }
);
