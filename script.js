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

    } else {

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


    animerTouche(lettre);


    // Musique à partir de la première lettre

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

                            return mot.length === 5;
                        }
                    );


            console.log(
                "Mots chargés :",
                mots.length
            );


            choisirNouveauMot();

            initialiserGrille();
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
// VISIBILITÉ DES LIGNES
// =========================================

function mettreAJourLignesVisibles() {

    lignes.forEach(
        function(uneLigne, index) {

            /*
               Au départ :
               3 lignes visibles.

               Essai 2 :
               4 lignes.

               Essai 3 :
               5 lignes.

               Essai 4 :
               6 lignes.

               Ensuite elles restent toutes visibles.
            */

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
// CALCUL DE LA TRAJECTOIRE
// =========================================

function calculerTrajectoire() {

    /*
       IMPORTANT :

       On ne prend PAS la dernière ligne
       comme référence.

       C'est TOUJOURS LA LIGNE 1.
    */

    let ligne1 =
        lignes[0].getBoundingClientRect();


    let clavierRect =
        clavier.getBoundingClientRect();


    let messageRect =
        message.getBoundingClientRect();


    // =====================================
    // POSITION DE DÉPART
    // =====================================

    /*
       Le BAS de la ligne 1 doit être
       10 px au-dessus du clavier.
    */

    let cibleDepart =
        clavierRect.top - 10;


    let positionDepart =
        cibleDepart - ligne1.bottom;


    // =====================================
    // POSITION FINALE
    // =====================================

    /*
       Le BAS de la ligne 1 doit terminer
       10 px sous la zone des messages.

       On utilise le bas de la ligne 1
       comme repère dans les deux cas.
    */

    let cibleFinale =
        messageRect.bottom + 10;


    let positionFinale =
        cibleFinale - ligne1.bottom;


    // =====================================
    // DISTANCE TOTALE
    // =====================================

    let distanceTotale =
        positionFinale -
        positionDepart;


    /*
       Il y a exactement 5 déplacements
       entre les 6 essais.
    */

    let mouvement =
        distanceTotale / 5;


    return {

        depart:
            positionDepart,

        mouvement:
            mouvement
    };
}


// =========================================
// POSITION ACTUELLE
// =========================================

function positionActuelle() {

    let trajectoire =
        calculerTrajectoire();


    return (
        trajectoire.depart
        +
        trajectoire.mouvement * ligne
    );
}


// =========================================
// POSITIONNER LA GRILLE
// =========================================

function positionnerGrille(
    animation
) {

    let position =
        positionActuelle();


    if (
        animation
    ) {

        feuille.style.transition =
            "transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)";

    } else {

        feuille.style.transition =
            "none";
    }


    feuille.style.transform =
        `translateX(-50%) translateY(${position}px)`;
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
       On attend que les dimensions soient
       correctement calculées.
    */

    requestAnimationFrame(
        function() {

            positionnerGrille(false);
        }
    );
}


// =========================================
// MONTER LA FEUILLE
// =========================================

function monterFeuille() {

    /*
       La nouvelle ligne devient visible
       AVANT que la feuille ne commence
       son déplacement.
    */

    mettreAJourLignesVisibles();


    requestAnimationFrame(
        function() {

            positionnerGrille(true);
        }
    );
}


// =========================================
// CHARIOT
// =========================================

function animerChariot() {

    let ligneValidee =
        lignes[
            ligne - 1
        ];


    if (
        !ligneValidee
    ) {

        return;
    }


    let casesLigne =
        ligneValidee.querySelectorAll(
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
        premiereRect.left
        -
        feuilleRect.left
        -
        8;


    let arrivee =
        derniereRect.right
        -
        feuilleRect.left
        +
        8;


    let haut =
        premiereRect.top
        -
        feuilleRect.top
        -
        4;


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
                duration: 450,

                easing:
                    "ease-out",

                fill:
                    "forwards"
            }
        );


    aller.finished
        .then(
            function() {

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
                            duration: 320,

                            easing:
                                "ease-in",

                            fill:
                                "forwards"
                        }
                    );


                /*
                   Le chariot repart et la feuille
                   commence à monter.
                */

                monterFeuille();


                return retour.finished;
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
    // VÉRIFICATION DES LETTRES
    // =====================================

    let lettresDisponibles =
        motSecret.split("");


    // Vert

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
    // PASSAGE À L'ESSAI SUIVANT
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


    // Nouvelle ligne

    debut += 5;

    position = 0;


    // Chariot + montée

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


        partieTerminee =
            false;

        ligne = 0;

        position = 0;

        debut = 0;


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


        // Retour au départ

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
