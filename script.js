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
// DÉPLACEMENT DE LA GRILLE
// =========================================

let decalageGrille = 0;


function monterGrille() {

    /*
        Une ligne =
        hauteur de la ligne
        + espace entre deux lignes
    */

    const hauteurLigne =
        lignes[0].getBoundingClientRect().height;


    const style =
        getComputedStyle(grille);


    const gap =
        parseFloat(style.rowGap || style.gap) || 0;


    const pas =
        hauteurLigne + gap;


    /*
        On ajoute TOUJOURS exactement
        un seul pas.
    */

    decalageGrille += pas;


    /*
        Animation douce.
    */

    grille.style.transition =
        "transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)";


    /*
        On conserve le centrage horizontal.
    */

    grille.style.transform =
        `translateX(-50%) translateY(-${decalageGrille}px)`;

}


// =========================================
// REMETTRE LA GRILLE À SA POSITION INITIALE
// =========================================

function remettreGrilleEnPlace() {

    decalageGrille = 0;


    grille.style.transition =
        "none";


    grille.style.transform =
        "translateX(-50%)";

}


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

    message.textContent =
        texte;


    message.style.opacity =
        "1";


    setTimeout(() => {

        message.style.opacity =
            "0";

    }, 1500);

}


// =========================================
// ANIMATION TOUCHE
// =========================================

function animerTouche(lettre) {

    touches.forEach(touche => {

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
// COULEUR DU CLAVIER
// =========================================

function mettreAJourClavier(
    lettre,
    couleur
) {

    touches.forEach(touche => {

        if (
            touche.textContent !== lettre
        ) {
            return;
        }


        /*
            VERT
        */

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


        /*
            JAUNE
        */

        else if (
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


        /*
            GRIS
        */

        else if (
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

    });

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


    /*
        Une ligne contient 5 lettres.
    */

    if (
        position >= 5
    ) {
        return;
    }


    const index =
        debut + position;


    const caseActuelle =
        cases[index];


    caseActuelle.textContent =
        lettre;


    /*
        Animation de la lettre.
    */

    caseActuelle.classList.remove(
        "letter-animation"
    );


    void caseActuelle.offsetWidth;


    caseActuelle.classList.add(
        "letter-animation"
    );


    /*
        Animation de la touche.
    */

    animerTouche(
        lettre
    );


    /*
        Son de frappe.
    */

    sonGood.currentTime =
        0;


    sonGood.play().catch(
        () => {}
    );


    /*
        Musique de fond.
    */

    if (
        musiqueJeu.paused
    ) {

        musiqueJeu.play().catch(
            () => {}
        );

    }


    position++;

}


// =========================================
// SONS DE FRAPPE
// =========================================

const sonGood =
    new Audio("Good.mp3");


const sonFalse =
    new Audio("False.mp3");


sonGood.volume =
    0.05;


sonFalse.volume =
    0.05;


musiqueJeu.volume =
    0.15;


musiqueVictoire.volume =
    0.25;


musiqueDefaite.volume =
    0.25;


// =========================================
// CLAVIER PHYSIQUE
// =========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            partieTerminee
        ) {
            return;
        }


        /*
            LETTRE
        */

        if (
            event.key.length === 1
        ) {

            const lettre =
                enleverAccents(
                    event.key.toUpperCase()
                );


            if (
                /^[A-Z]$/.test(
                    lettre
                )
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

            if (
                position > 0
            ) {

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
// CHARGEMENT DU DICTIONNAIRE
// =========================================

fetch("mots.txt")

    .then(
        response => {

            if (
                !response.ok
            ) {

                throw new Error(
                    "Impossible de charger mots.txt"
                );

            }


            return response.text();

        }
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
// CHOISIR LE MOT SECRET
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
// VALIDER LE MOT
// =========================================

function validerMot() {

    if (
        partieTerminee
    ) {
        return;
    }


    /*
        Pas assez de lettres.
    */

    if (
        position < 5
    ) {

        afficherMessage(
            "Pas assez de lettres."
        );


        return;

    }


    /*
        Construire le mot.
    */

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
        Mot inexistant.
    */

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );


        sonFalse.currentTime =
            0;


        sonFalse.play().catch(
            () => {}
        );


        return;

    }


    /*
        =====================================
        VICTOIRE
        =====================================
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


        musiqueVictoire.play().catch(
            () => {}
        );


        /*
            Colorer les cases.
        */

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


        /*
            Écran de victoire.
        */

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
        =====================================
        ANALYSE DES LETTRES
        =====================================
    */

    const disponibles =
        motSecret.split("");


    /*
        LETTRES VERTES
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
        LETTRES JAUNES / GRISES
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
        =====================================
        PASSER À LA LIGNE SUIVANTE
        =====================================
    */

    ligneActuelle++;

    debut += 5;

    position = 0;


    /*
        On fait monter la grille
        d'UNE SEULE ligne.
    */

    if (
        ligneActuelle < 6
    ) {

        monterGrille();

    }


    /*
        =====================================
        DERNIER ESSAI
        =====================================
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


        musiqueDefaite.play().catch(
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

    }

}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    () => {

        /*
            Écran de fin.
        */

        ecranFin.style.display =
            "none";


        /*
            Variables.
        */

        partieTerminee =
            false;


        position =
            0;


        ligneActuelle =
            0;


        debut =
            0;


        /*
            Remettre la grille
            à sa position initiale.
        */

        remettreGrilleEnPlace();


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
            Musiques.
        */

        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueVictoire.pause();
        musiqueVictoire.currentTime = 0;

        musiqueDefaite.pause();
        musiqueDefaite.currentTime = 0;


        /*
            Nouveau mot.
        */

        choisirNouveauMot();

    }
);
