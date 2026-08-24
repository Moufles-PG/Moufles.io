// =========================================
// ÉLÉMENTS
// =========================================

const cases = document.querySelectorAll(".case");
const touches = document.querySelectorAll(".touche");
const lignes = document.querySelectorAll(".ligne");

const message = document.querySelector("#message");

const musiqueJeu = document.querySelector("#musiqueJeu");
const musiqueVictoire = document.querySelector("#musiqueVictoire");
const musiqueDefaite = document.querySelector("#musiqueDefaite");

const ecranFin = document.querySelector("#ecranFin");
const titreFin = document.querySelector("#titreFin");
const texteFin = document.querySelector("#texteFin");
const motFin = document.querySelector("#motFin");
const boutonRejouer = document.querySelector("#boutonRejouer");

const grille = document.querySelector(".feuille");
const zoneGrille = document.querySelector(".zone-grille");
const chariot = document.querySelector("#chariot");


// =========================================
// VARIABLES
// =========================================

let position = 0;
let ligneActuelle = 0;
let debut = 0;

let mots = [];
let motSecret = "";

let partieTerminee = false;


// =========================================
// SONS
// =========================================

const sonGood = new Audio("Good.mp3");
const sonFalse = new Audio("False.mp3");
const sonChariot = new Audio("Typewirter.mp3");

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;
musiqueDefaite.volume = 0.25;

sonGood.volume = 0.05;
sonFalse.volume = 0.05;
sonChariot.volume = 0.25;


// =========================================
// ENLEVER LES ACCENTS
// =========================================

function enleverAccents(texte) {

    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


// =========================================
// MESSAGE
// =========================================

function afficherMessage(texte) {

    message.textContent = texte;

    message.style.opacity = "1";

    setTimeout(() => {

        message.style.opacity = "0";

    }, 1500);

}


// =========================================
// ANIMATION D'UNE TOUCHE
// =========================================

function animerTouche(lettre) {

    touches.forEach(touche => {

        if (touche.textContent === lettre) {

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
// COULEUR DU CLAVIER
// =========================================

function mettreAJourClavier(lettre, couleur) {

    touches.forEach(touche => {

        if (touche.textContent !== lettre) {
            return;
        }


        if (couleur === "vert") {

            touche.classList.remove(
                "jaune",
                "gris"
            );

            touche.classList.add(
                "vert"
            );

        }


        else if (couleur === "jaune") {

            if (!touche.classList.contains("vert")) {

                touche.classList.remove(
                    "gris"
                );

                touche.classList.add(
                    "jaune"
                );

            }

        }


        else if (couleur === "gris") {

            if (
                !touche.classList.contains("vert") &&
                !touche.classList.contains("jaune")
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


    const index =
        debut + position;


    const caseActuelle =
        cases[index];


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


    sonGood.currentTime = 0;

    sonGood.play().catch(() => {});


    if (musiqueJeu.paused) {

        musiqueJeu.play().catch(() => {});

    }


    position++;

}


// =========================================
// CLAVIER PHYSIQUE
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (partieTerminee) {
            return;
        }


        /*
            LETTRE
        */

        if (event.key.length === 1) {

            const lettre =
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


        /*
            RETOUR ARRIÈRE
        */

        if (
            event.key === "Backspace"
        ) {

            if (position > 0) {

                position--;

                const caseActuelle =
                    cases[
                        debut + position
                    ];


                caseActuelle.textContent =
                    "";


                caseActuelle.classList.remove(
                    "letter-animation"
                );

            }


            return;

        }


        /*
            ENTRÉE
        */

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
    touche => {

        touche.addEventListener(
            "click",
            () => {

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
        response =>
            response.text()
    )

    .then(
        texte => {

            mots =
                texte
                    .split(/\r?\n/)
                    .map(
                        mot =>
                            enleverAccents(
                                mot
                                    .trim()
                                    .toUpperCase()
                            )
                    )
                    .filter(
                        mot =>
                            mot.length === 5
                    );


            choisirNouveauMot();

            initialiserGrille();

        }
    )

    .catch(
        erreur => {

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
// DISTANCE ENTRE DEUX LIGNES
// =========================================

function obtenirPas() {

    const hauteur =
        lignes[0]
            .getBoundingClientRect()
            .height;


    const style =
        getComputedStyle(
            grille
        );


    const gap =
        parseFloat(
            style.gap
        ) || 0;


    return hauteur + gap;

}


// =========================================
// POSITION DE LA GRILLE
// =========================================

function positionnerGrille(
    animation = false
) {

    /*
        Hauteur totale des 6 lignes.
    */

    const hauteurFeuille =
        grille.offsetHeight;


    /*
        Hauteur d'une ligne.
    */

    const hauteurLigne =
        lignes[0]
            .getBoundingClientRect()
            .height;


    /*
        Distance exacte entre
        deux lignes.
    */

    const pas =
        obtenirPas();


    /*
        POSITION DE DÉPART

        La première ligne est placée
        près du clavier.

        Le +20 permet de remonter
        légèrement la position de départ.
    */

    const positionDepart =
        hauteurFeuille -
        hauteurLigne +
        20;


    /*
        UNE SEULE LIGNE DE PLUS
        À CHAQUE TOUR.

        ligneActuelle vaut :

        0 → essai 1
        1 → essai 2
        2 → essai 3
        etc.
    */

    const position =
        positionDepart +
        (
            ligneActuelle * pas
        );


    /*
        Animation.
    */

    if (animation) {

        grille.style.transition =
            "transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";

    }

    else {

        grille.style.transition =
            "none";

    }


    /*
        La feuille monte quand
        position augmente.
    */

    grille.style.transform =
        `translateX(-50%) translateY(-${position}px)`;

}


// =========================================
// INITIALISATION
// =========================================

function initialiserGrille() {

    position = 0;

    ligneActuelle = 0;

    debut = 0;


    requestAnimationFrame(
        () => {

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

    if (!chariot) {

        positionnerGrille(
            true
        );

        return;

    }


    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            () => {}
        );


    /*
        La ligne que l'on vient
        de valider.
    */

    const indexLigne =
        ligneActuelle - 1;


    const ligneValidee =
        lignes[indexLigne];


    if (!ligneValidee) {

        positionnerGrille(
            true
        );

        return;

    }


    const casesLigne =
        ligneValidee.querySelectorAll(
            ".case"
        );


    const premiere =
        casesLigne[0];


    const derniere =
        casesLigne[4];


    const grilleRect =
        grille.getBoundingClientRect();


    const premiereRect =
        premiere.getBoundingClientRect();


    const derniereRect =
        derniere.getBoundingClientRect();


    const depart =
        premiereRect.left -
        grilleRect.left -
        8;


    const arrivee =
        derniereRect.right -
        grilleRect.left +
        8;


    const haut =
        premiereRect.top -
        grilleRect.top -
        4;


    chariot.style.left =
        `${depart}px`;

    chariot.style.top =
        `${haut}px`;

    chariot.style.opacity =
        "1";


    /*
        Aller.
    */

    const aller =
        chariot.animate(
            [
                {
                    left:
                        `${depart}px`
                },

                {
                    left:
                        `${arrivee}px`
                }
            ],
            {
                duration: 400,
                easing: "ease-out",
                fill: "forwards"
            }
        );


    aller.finished.then(
        () => {

            /*
                Retour.
            */

            const retour =
                chariot.animate(
                    [
                        {
                            left:
                                `${arrivee}px`
                        },

                        {
                            left:
                                `${depart}px`
                        }
                    ],
                    {
                        duration: 300,
                        easing: "ease-in-out",
                        fill: "forwards"
                    }
                );


            retour.finished.then(
                () => {

                    /*
                        MAINTENANT,
                        on fait monter
                        la feuille d'UNE ligne.
                    */

                    positionnerGrille(
                        true
                    );


                    setTimeout(
                        () => {

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

    if (partieTerminee) {
        return;
    }


    if (position < 5) {

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


    /*
        MOT INEXISTANT
    */

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        sonFalse.currentTime =
            0;

        sonFalse.play()
            .catch(
                () => {}
            );

        return;

    }


    /*
        VICTOIRE
    */

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
                () => {}
            );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const caseActuelle =
                cases[
                    debut + i
                ];


            caseActuelle.classList.add(
                "vert"
            );


            mettreAJourClavier(
                mot[i],
                "vert"
            );


            setTimeout(
                () => {

                    caseActuelle.classList.add(
                        "victoire"
                    );

                },
                i * 100
            );

        }


        setTimeout(
            () => {

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


    /*
        LETTRES DISPONIBLES
    */

    const disponibles =
        motSecret.split("");


    /*
        VERT
    */

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


            disponibles[i] =
                null;

        }

    }


    /*
        JAUNE / GRIS
    */

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


        const index =
            disponibles.indexOf(
                mot[i]
            );


        if (
            index !== -1
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


            disponibles[index] =
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


    /*
        ON PASSE À LA LIGNE SUIVANTE
    */

    ligneActuelle++;

    debut += 5;

    position = 0;


    /*
        DERNIER ESSAI
    */

    if (
        ligneActuelle >= 6
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
                () => {}
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


    /*
        CHARIOT,
        PUIS MONTÉE D'UNE LIGNE.
    */

    animerChariot();

}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    () => {

        ecranFin.style.display =
            "none";


        partieTerminee =
            false;


        position =
            0;


        ligneActuelle =
            0;


        debut =
            0;


        /*
            Vider les cases.
        */

        cases.forEach(
            caseJeu => {

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


        /*
            Réinitialiser le clavier.
        */

        touches.forEach(
            touche => {

                touche.classList.remove(
                    "vert",
                    "jaune",
                    "gris",
                    "touche-appuyee"
                );

            }
        );


        /*
            Réinitialiser les musiques.
        */

        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime =
            0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime =
            0;


        /*
            Réinitialiser le chariot.
        */

        if (chariot) {

            chariot.style.opacity =
                "0";

        }


        /*
            Nouveau mot.
        */

        choisirNouveauMot();


        /*
            Retour immédiat
            à la position de départ.
        */

        initialiserGrille();

    }
);


// =========================================
// REDIMENSIONNEMENT
// =========================================

window.addEventListener(
    "resize",
    () => {

        if (!partieTerminee) {

            positionnerGrille(
                false
            );

        }

    }
);
