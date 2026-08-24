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
// COULEUR DU CLAVIER
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


    // Chercher la touche correspondante

    let touche = null;


    touches.forEach(function(element) {

        if (
            element.textContent === lettre
        ) {

            touche = element;
        }

    });


    // Son de touche

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


    // Animation du clavier

    animerTouche(lettre);


    // Musique du jeu

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
// POSITION DE LA GRILLE
// =========================================
//
// C'est ici que tout se joue.
//
// La grille est déplacée entre deux
// positions fixes.
//
// POSITION 1 :
// Le haut de la grille est à 10 px
// au-dessus du clavier.
//
// POSITION 6 :
// Le haut de la grille est à 10 px
// sous la zone des messages.
//
// Il y a 5 déplacements entre
// l'essai 1 et l'essai 6.
// =========================================

function calculerPositionsGrille() {

    let clavierRect =
        clavier.getBoundingClientRect();


    let messageRect =
        message.getBoundingClientRect();


    // -----------------------------------------
    // POSITION DE DÉPART
    // -----------------------------------------
    //
    // Le bas de la première ligne doit être
    // à 10 px au-dessus du clavier.
    //
    // Comme la grille commence avec la ligne 1,
    // on utilise la hauteur d'une ligne.

    let hauteurLigne =
        lignes[0].getBoundingClientRect().height;


    let positionDepart =
        clavierRect.top
        -
        10
        -
        hauteurLigne;


    // -----------------------------------------
    // POSITION FINALE
    // -----------------------------------------
    //
    // Le haut de la grille doit arriver
    // à 10 px sous les messages.

    let positionFinale =
        messageRect.bottom
        +
        10;


    // -----------------------------------------
    // DISTANCE TOTALE
    // -----------------------------------------

    let distanceTotale =
        positionFinale
        -
        positionDepart;


    // -----------------------------------------
    // DISTANCE PAR TOUR
    // -----------------------------------------
    //
    // 5 déplacements :
    //
    // 1 → 2
    // 2 → 3
    // 3 → 4
    // 4 → 5
    // 5 → 6

    let distanceParTour =
        distanceTotale / 5;


    return {

        depart:
            positionDepart,

        finale:
            positionFinale,

        parTour:
            distanceParTour
    };
}


// =========================================
// POSITIONNER LA GRILLE
// =========================================

function positionnerGrille(
    animation = false
) {

    let positions =
        calculerPositionsGrille();


    // Position correspondant à l'essai actuel

    let positionVerticale =
        positions.depart
        +
        (
            positions.parTour
            *
            ligne
        );


    // Animation

    if (
        animation
    ) {

        grille.style.transition =
            "transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)";

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
// LIGNES VISIBLES
// =========================================
//
// Au début : lignes 1, 2 et 3.
//
// Après le premier essai : ligne 4.
//
// Après le deuxième : ligne 5.
//
// Après le troisième : ligne 6.
//
// Ensuite tout reste visible.
// =========================================

function mettreAJourLignesVisibles() {

    lignes.forEach(
        function(uneLigne, index) {

            if (
                index <= ligne + 2
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

    ligne = 0;

    position = 0;

    debut = 0;


    mettreAJourLignesVisibles();


    /*
       On attend que le navigateur ait
       terminé de calculer les dimensions.
    */

    requestAnimationFrame(function() {

        positionnerGrille(false);

    });
}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

    let lignePrecedente =
        lignes[
            ligne - 1
        ];


    if (
        !lignePrecedente
    ) {

        return;
    }


    let casesLigne =
        lignePrecedente.querySelectorAll(
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


    // Son de machine à écrire

    sonChariot.currentTime = 0;

    sonChariot.play()
        .catch(function() {});


    // Aller vers la droite

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
                duration: 450,

                easing: "ease-out",

                fill: "forwards"
            }
        );


    mouvement.finished.then(function() {

        // Petit retour du chariot

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
                    duration: 300,

                    easing: "ease-in-out",

                    fill: "forwards"
                }
            );


        /*
           Pendant que le chariot revient,
           la feuille monte.
        */

        monterGrille();


        retour.finished.then(function() {

            chariot.style.opacity =
                "0";

        });

    });
}


// =========================================
// FAIRE MONTER LA GRILLE
// =========================================

function monterGrille() {

    // Faire apparaître la nouvelle ligne

    mettreAJourLignesVisibles();


    /*
       On laisse le navigateur afficher
       la nouvelle ligne avant de déplacer
       la grille.
    */

    requestAnimationFrame(function() {

        positionnerGrille(true);

    });
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


    // -----------------------------------------
    // PAS ASSEZ DE LETTRES
    // -----------------------------------------

    if (
        position < 5
    ) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;
    }


    // -----------------------------------------
    // CONSTRUIRE LE MOT
    // -----------------------------------------

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


    // -----------------------------------------
    // MOT INEXISTANT
    // -----------------------------------------

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


    // -----------------------------------------
    // LETTRES VERTES
    // -----------------------------------------

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


    // -----------------------------------------
    // LETTRES JAUNES / GRISES
    // -----------------------------------------

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
    // PASSER À LA LIGNE SUIVANTE
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


    // Animation machine à écrire + montée

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


        // Effacer les cases

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

        musiqueJeu.currentTime = 0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime = 0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime = 0;


        // Cacher le chariot

        chariot.style.opacity =
            "0";


        // Revenir à la position initiale

        initialiserGrille();


        // Nouveau mot

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
