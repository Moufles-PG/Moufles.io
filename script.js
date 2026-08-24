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


    // La musique commence à la première lettre

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
// CALCULER LE DÉPLACEMENT
// =========================================
//
// IMPORTANT :
//
// On travaille maintenant uniquement
// dans la zone-grille.
//
// La grille est une feuille qui passe
// derrière cette zone.
//
// Au départ :
// le bas de la ligne 1 = bas de la zone.
//
// À la fin :
// le haut de la ligne 6 = haut de la zone.
//
// =========================================

function calculerPositions() {

    let zoneRect =
        zoneGrille.getBoundingClientRect();


    let ligneRect =
        lignes[0].getBoundingClientRect();


    let hauteurLigne =
        ligneRect.height;


    /*
       Espace entre deux lignes.
    */

    let styleGrille =
        getComputedStyle(grille);


    let espace =
        parseFloat(
            styleGrille.rowGap
        ) || 0;


    /*
       Hauteur d'une ligne
       + espace avant la suivante.
    */

    let pas =
        hauteurLigne + espace;


    /*
       Position de départ.

       La grille est positionnée avec son
       haut comme référence.

       Pour que le BAS de la ligne 1
       arrive au BAS de la zone :

       position = hauteur zone - hauteur ligne
    */

    let depart =
        zoneRect.height
        -
        hauteurLigne;


    /*
       Position finale.

       Pour que le HAUT de la ligne 6
       arrive au HAUT de la zone :

       on remonte de 5 pas.
    */

    let finale =
        0
        -
        (
            5 * pas
        );


    /*
       On veut que le déplacement soit
       réparti sur les 5 passages.

       Exemple :

       essai 1 = départ
       essai 2 = + 1/5
       essai 3 = + 2/5
       ...
       essai 6 = finale
    */

    let deplacementParTour =
        (
            finale - depart
        ) / 5;


    return {

        depart:
            depart,

        deplacementParTour:
            deplacementParTour,

        pas:
            pas
    };
}


// =========================================
// POSITIONNER LA FEUILLE
// =========================================

function positionnerGrille(
    animation
) {

    let positions =
        calculerPositions();


    /*
       La grille part de la position
       correcte pour l'essai 1.

       Puis elle monte d'un cinquième
       de la distance disponible à chaque
       nouvel essai.
    */

    let positionVerticale =
        positions.depart
        +
        (
            ligne *
            positions.deplacementParTour
        );


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
// Au début :
// ligne 1 uniquement.
//
// Après le premier essai :
// lignes 1 + 2.
//
// Après le deuxième :
// lignes 1 + 2 + 3.
//
// etc.
//
// Les anciennes lignes ne disparaissent
// JAMAIS.
// =========================================

function mettreAJourLignesVisibles() {

    lignes.forEach(
        function(uneLigne, index) {

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
       Seulement la ligne 1 est visible.
    */

    mettreAJourLignesVisibles();


    /*
       On attend que le navigateur ait
       calculé les dimensions.
    */

    requestAnimationFrame(
        function() {

            positionnerGrille(false);

        }
    );
}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

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


    /*
       Son de machine à écrire.
    */

    sonChariot.currentTime = 0;

    sonChariot.play()
        .catch(function() {});


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
                duration: 400,

                easing: "ease-out",

                fill: "forwards"
            }
        );


    mouvement.finished.then(
        function() {

            /*
               Retour du chariot.
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
                    duration: 300,

                    easing: "ease-in-out",

                    fill: "forwards"
                }
            );


            /*
               La nouvelle ligne apparaît
               puis la feuille monte.
            */

            mettreAJourLignesVisibles();


            requestAnimationFrame(
                function() {

                    positionnerGrille(true);

                }
            );


            setTimeout(
                function() {

                    chariot.style.opacity =
                        "0";

                },
                350
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


    // Faire sortir la nouvelle ligne

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


        // Remettre la feuille
        // dans sa position de départ

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
