// =========================================
// ÉLÉMENTS
// =========================================

const cases = document.querySelectorAll(".case");
const touches = document.querySelectorAll(".touche");
const lignes = document.querySelectorAll(".ligne");

const grille = document.querySelector(".feuille");
const clavier = document.querySelector("#clavier");

const message = document.querySelector("#message");

const musiqueJeu =
    document.querySelector("#musiqueJeu");

const musiqueVictoire =
    document.querySelector("#musiqueVictoire");

const musiqueDefaite =
    document.querySelector("#musiqueDefaite");

const ecranFin =
    document.querySelector("#ecranFin");

const titreFin =
    document.querySelector("#titreFin");

const texteFin =
    document.querySelector("#texteFin");

const motFin =
    document.querySelector("#motFin");

const boutonRejouer =
    document.querySelector("#boutonRejouer");


// =========================================
// SONS
// =========================================

const sonGood =
    new Audio("Good.mp3");

const sonFalse =
    new Audio("False.mp3");

sonGood.volume = 0.05;
sonFalse.volume = 0.05;

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;
musiqueDefaite.volume = 0.25;


// =========================================
// VARIABLES
// =========================================

let position = 0;
let ligneActuelle = 0;
let debut = 0;

let mots = [];
let motSecret = "";

let partieTerminee = false;

let positionGrille = 0;


// =========================================
// POSITION INITIALE
// =========================================

function positionInitialeGrille() {

    const rectClavier =
        clavier.getBoundingClientRect();

    const hauteurLigne =
        lignes[0].getBoundingClientRect().height;

    const styleGrille =
        getComputedStyle(grille);

    const gap =
        parseFloat(
            styleGrille.rowGap ||
            styleGrille.gap
        ) || 0;


    /*
        On place le bas de la ligne 1
        au milieu du gap.

        Puis on remonte encore légèrement
        la grille de 20 px.
    */

    const margeSupplementaire = +70;

    const basLigne =
        rectClavier.top -
        (gap / 2) -
        margeSupplementaire;


    const hautLigne =
        basLigne -
        hauteurLigne;


    positionGrille =
        hautLigne;


    grille.style.transition =
        "none";


    grille.style.transform =
        `translateX(-50%) translateY(${positionGrille}px)`;
}


// =========================================
// MONTER D'UNE LIGNE
// =========================================

function monterGrille() {

    const hauteurLigne =
        lignes[0].getBoundingClientRect().height;

    const styleGrille =
        getComputedStyle(grille);

    const gap =
        parseFloat(
            styleGrille.rowGap ||
            styleGrille.gap
        ) || 0;


    /*
        Une montée = exactement :
        hauteur d'une ligne + gap.
    */

    const pas =
        hauteurLigne +
        gap;


    positionGrille -=
        pas;


    grille.style.transition =
        "transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)";


    grille.style.transform =
        `translateX(-50%) translateY(${positionGrille}px)`;
}


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
        partieTerminee ||
        position >= 5
    ) {
        return;
    }


    const index =
        debut +
        position;


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

    sonGood.play().catch(
        () => {}
    );


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


        if (
            event.key === "Backspace"
        ) {

            if (
                position > 0
            ) {

                position--;


                const caseActuelle =
                    cases[
                        debut +
                        position
                    ];


                caseActuelle.textContent =
                    "";


                caseActuelle.classList.remove(
                    "letter-animation"
                );
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

    .then(response => {

        if (
            !response.ok
        ) {

            throw new Error(
                "Impossible de charger mots.txt"
            );

        }


        return response.text();

    })

    .then(texte => {

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


        requestAnimationFrame(() => {

            positionInitialeGrille();

        });

    })

    .catch(erreur => {

        console.error(
            "Erreur avec mots.txt :",
            erreur
        );

    });


// =========================================
// CHOISIR UN NOUVEAU MOT
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
                debut +
                i
            ].textContent;

    }


    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );


        sonFalse.currentTime = 0;

        sonFalse.play().catch(
            () => {}
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
        musiqueJeu.currentTime = 0;

        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play().catch(
            () => {}
        );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const caseActuelle =
                cases[
                    debut +
                    i
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


    // =====================================
    // ANALYSE
    // =====================================

    const disponibles =
        motSecret.split("");


    // LETTRES VERTES

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        if (
            mot[i] === motSecret[i]
        ) {

            cases[
                debut +
                i
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


    // LETTRES JAUNES / GRISES

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
                debut +
                i
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
                debut +
                i
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

    ligneActuelle++;

    debut += 5;

    position = 0;


    if (
        ligneActuelle < 6
    ) {

        monterGrille();

    }


    // =====================================
    // DÉFAITE
    // =====================================

    if (
        ligneActuelle >= 6
    ) {

        partieTerminee =
            true;


        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueDefaite.currentTime = 0;

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


        positionInitialeGrille();


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


        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueVictoire.pause();
        musiqueVictoire.currentTime = 0;

        musiqueDefaite.pause();
        musiqueDefaite.currentTime = 0;


        choisirNouveauMot();

    }
);


// =========================================
// REDIMENSIONNEMENT
// =========================================

window.addEventListener(
    "resize",
    () => {

        if (
            ligneActuelle === 0
        ) {

            positionInitialeGrille();

        }

    }
);
