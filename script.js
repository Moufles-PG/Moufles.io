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

let grille =
    document.querySelector(".feuille");

let zoneGrille =
    document.querySelector(".zone-grille");

let clavier =
    document.querySelector("#clavier");

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
// SONS
// =========================================

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;
musiqueDefaite.volume = 0.25;

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
// COULEUR CLAVIER
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


    if (
        position >= 5
    ) {

        return;
    }


    let touche = null;


    touches.forEach(function(element) {

        if (
            element.textContent === lettre
        ) {

            touche = element;
        }

    });


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


    animerTouche(lettre);


    // La musique démarre uniquement
    // quand la première lettre est écrite.

    if (
        musiqueJeu.paused
    ) {

        musiqueJeu.play()
            .catch(function() {});
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

                cases[
                    debut + position
                ].classList.remove(
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

        mots =
            texte
                .split(/\r?\n/)
                .map(function(mot) {

                    return enleverAccents(
                        mot
                            .trim()
                            .toUpperCase()
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

        initialiserGrille();

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
// CALCUL DE LA FEUILLE
// =========================================
//
// On cherche deux positions.
//
// 1. Position de départ :
//    ligne 1 juste au-dessus du clavier.
//
// 2. Position finale :
//    ligne 6 juste sous les messages.
//
// Ensuite on répartit le déplacement
// sur les 5 passages.
// =========================================

function calculerMouvement() {

    let clavierRect =
        clavier.getBoundingClientRect();


    let messageRect =
        message.getBoundingClientRect();


    let ligneRect =
        lignes[0].getBoundingClientRect();


    let hauteurLigne =
        ligneRect.height;


    let espaceEntreLignes =
        parseFloat(
            getComputedStyle(grille).rowGap
        );


    /*
       La première ligne commence
       10 px au-dessus du clavier.
    */

    let depart =
        clavierRect.top
        -
        10
        -
        hauteurLigne;


    /*
       La sixième ligne doit terminer
       10 px sous les messages.
    */

    let finale =
        messageRect.bottom
        +
        10;


    /*
       Distance que doit parcourir
       la ligne actuelle entre l'essai 1
       et l'essai 6.
    */

    let monteeTotale =
        depart - finale;


    /*
       5 déplacements :
       1 → 2
       2 → 3
       3 → 4
       4 → 5
       5 → 6
    */

    let monteeParTour =
        monteeTotale / 5;


    /*
       Distance physique entre deux lignes.
    */

    let hauteurPas =
        hauteurLigne
        +
        espaceEntreLignes;


    return {
        depart,
        monteeParTour,
        hauteurPas
    };
}


// =========================================
// POSITIONNER LA FEUILLE
// =========================================

function positionnerGrille(animation) {

    let mouvement =
        calculerMouvement();


    /*
       La ligne actuelle doit se trouver
       à une hauteur de plus en plus élevée.

       Pour cela, on déplace la feuille
       de :

       déplacement naturel des lignes
       +
       montée supplémentaire.
    */

    let deplacement =
        (
            ligne
            *
            mouvement.hauteurPas
        )
        +
        (
            ligne
            *
            mouvement.monteeParTour
        );


    let positionFinale =
        mouvement.depart
        -
        deplacement;


    if (
        animation
    ) {

        grille.style.transition =
            "transform 0.85s cubic-bezier(0.22, 0.61, 0.36, 1)";

    }

    else {

        grille.style.transition =
            "none";
    }


    grille.style.transform =
        `
        translateX(-50%)
        translateY(${positionFinale}px)
        `;
}


// =========================================
// LIGNES VISIBLES
// =========================================
//
// On ne fait apparaître une ligne
// que lorsqu'elle sort réellement
// de la machine.
// =========================================

function mettreAJourLignesVisibles() {

    lignes.forEach(
        function(uneLigne, index) {

            /*
               Au début :
               index 0 uniquement.

               Après essai 1 :
               lignes 0 et 1.

               Après essai 2 :
               lignes 0, 1 et 2.

               etc.
            */

            if (
                index <= ligne
            ) {

                uneLigne.classList.add(
                    "ligne-visible"
                );

            }

            else {

                uneLigne.classList.remove(
                    "ligne-visible"
                );
            }

        }
    );
}


// =========================================
// INITIALISATION
// =========================================

function initialiserGrille() {

    position = 0;
    ligne = 0;
    debut = 0;


    /*
       Au tout début :
       seule la première ligne existe
       visuellement.
    */

    mettreAJourLignesVisibles();


    requestAnimationFrame(
        function() {

            positionnerGrille(false);

        }
    );
}


// =========================================
// CHARIOT
// =========================================

function animerChariot() {

    /*
       On fait bouger le chariot
       pendant que la feuille avance.
    */

    let ancienneLigne =
        lignes[
            ligne - 1
        ];


    if (
        !ancienneLigne
    ) {

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
        premiereRect.left
        -
        grilleRect.left
        -
        8;


    let arrivee =
        derniereRect.right
        -
        grilleRect.left
        +
        8;


    let haut =
        premiereRect.top
        -
        grilleRect.top
        -
        4;


    chariot.style.left =
        depart + "px";

    chariot.style.top =
        haut + "px";

    chariot.style.opacity =
        "1";


    sonChariot.currentTime = 0;

    sonChariot.play()
        .catch(function() {});


    /*
       Aller vers la droite.
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
                duration: 400,

                easing: "ease-out",

                fill: "forwards"
            }
        );


    mouvement.finished.then(
        function() {

            /*
               Petit retour du chariot.
            */

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
                    duration: 280,

                    easing: "ease-in-out",

                    fill: "forwards"
                }
            );


            /*
               La feuille avance
               juste après le mouvement
               du chariot.
            */

            requestAnimationFrame(
                function() {

                    mettreAJourLignesVisibles();

                    requestAnimationFrame(
                        function() {

                            positionnerGrille(true);

                        }
                    );

                }
            );


            setTimeout(
                function() {

                    chariot.style.opacity =
                        "0";

                },
                300
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

        partieTerminee = true;


        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play()
            .catch(function() {});


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


    // =========================================
    // PASSAGE À LA LIGNE SUIVANTE
    // =========================================

    ligne++;


    // =========================================
    // DÉFAITE
    // =========================================

    if (
        ligne === 6
    ) {

        partieTerminee = true;


        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        musiqueDefaite.currentTime = 0;

        musiqueDefaite.play()
            .catch(function() {});


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


    // Nouvelle ligne

    debut += 5;

    position = 0;


    /*
       Maintenant la nouvelle ligne
       sort de la machine.
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


        partieTerminee = false;

        position = 0;

        ligne = 0;

        debut = 0;


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


        musiqueJeu.pause();
        musiqueJeu.currentTime = 0;

        musiqueVictoire.pause();
        musiqueVictoire.currentTime = 0;

        musiqueDefaite.pause();
        musiqueDefaite.currentTime = 0;


        chariot.style.opacity =
            "0";


        initialiserGrille();

        choisirNouveauMot();

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

            positionnerGrille(false);

        }

    }
);
