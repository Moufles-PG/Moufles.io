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

let grille =
    document.querySelector(".grille");


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
// COULEUR CLAVIER
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

    }

    else {

        sonGood.currentTime = 0;

        sonGood.play()
            .catch(
                function() {}
            );

    }


    // Écriture

    let caseActuelle =
        cases[
            debut + position
        ];


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
// CHOISIR MOT
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


    // Aller

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
                duration: 330,

                easing:
                    "cubic-bezier(0.15, 0.85, 0.25, 1)",

                fill: "forwards"
            }
        );


    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
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
                                    depart + "px"
                            }
                        ],
                        {
                            duration: 430,

                            easing:
                                "cubic-bezier(0.55, 0.05, 0.68, 0.19)",

                            fill: "forwards"
                        }
                    );


                // Feuille

                /*
                   Une ligne = 65 px
                   + 9 px d'espace
                   = 74 px.

                   On monte la feuille de 14 px.
                   C'est volontairement subtil.
                */

                let feuille =
                    grille.animate(
                        [
                            {
                                transform:
                                    "translateY(0)"
                            },

                            {
                                transform:
                                    "translateY(-9px)"
                            },

                            {
                                transform:
                                    "translateY(-14px)"
                            },

                            {
                                transform:
                                    "translateY(-11px)"
                            },

                            {
                                transform:
                                    "translateY(-14px)"
                            }
                        ],
                        {
                            duration: 650,

                            easing:
                                "cubic-bezier(0.22, 0.61, 0.36, 1)",

                            fill: "forwards"
                        }
                    );


                return Promise.all([
                    retour.finished,
                    feuille.finished
                ]);

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
    // VÉRIFICATION
    // =========================================

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
    // LIGNE SUIVANTE
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
    // ANIMATION
    // =========================================

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


        // Grille

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


        grille.getAnimations()
            .forEach(
                function(animation) {

                    animation.cancel();

                }
            );


        grille.style.transform =
            "translateY(0)";


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
