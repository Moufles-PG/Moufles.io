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


    touches.forEach(
        function(element) {

            if (
                element.textContent === lettre
            ) {

                touche = element;
            }
        }
    );


    // Son de touche

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


    // Case

    let caseActuelle =
        cases[
            debut + position
        ];


    caseActuelle.textContent =
        lettre;


    // Animation lettre

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    // Animation clavier

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

                ecrireLettre(
                    lettre
                );
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

            remettreGrilleAuDepart();
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
// LIGNES VISIBLES
// =========================================

function mettreAJourLignesVisibles() {

    lignes.forEach(
        function(uneLigne, index) {

            /*
               Au début :
               seule la ligne 1 est visible.

               Après le premier essai :
               ligne 2 apparaît.

               Puis ligne 3, etc.
            */

            if (
                index <= ligne
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
// CALCUL DE LA POSITION
// =========================================

function calculerPositions() {

    /*
       On récupère les positions réelles
       du clavier et de la zone de grille.
    */

    let zoneRect =
        zoneGrille.getBoundingClientRect();

    let clavierRect =
        clavier.getBoundingClientRect();


    /*
       Première position :

       le bas de la première ligne doit
       être à 10 px au-dessus du clavier.
    */

    let positionDepart =
        clavierRect.top
        - 10
        - zoneRect.top;


    /*
       Dernière position :

       le haut de la sixième ligne doit
       être à 10 px sous la bannière
       des messages.
    */

    let messageRect =
        message.getBoundingClientRect();


    let positionFin =
        messageRect.bottom
        + 10
        - zoneRect.top;


    /*
       Hauteur d'une ligne.
    */

    let hauteurLigne =
        lignes[0].getBoundingClientRect().height;


    /*
       La position de la feuille dépend
       de son bord inférieur.

       On corrige donc avec la hauteur
       de la ligne.
    */

    positionDepart -= hauteurLigne;


    /*
       Distance totale entre les deux
       positions.
    */

    let distance =
        positionDepart
        - positionFin;


    /*
       Il y a 5 déplacements :

       1 → 2
       2 → 3
       3 → 4
       4 → 5
       5 → 6
    */

    let mouvement =
        distance / 5;


    return {
        depart: positionDepart,
        mouvement: mouvement
    };
}


// =========================================
// POSITION DE LA GRILLE
// =========================================

function positionGrille() {

    let positions =
        calculerPositions();


    return (
        positions.depart
        - positions.mouvement * ligne
    );
}


// =========================================
// RETOUR AU DÉPART
// =========================================

function remettreGrilleAuDepart() {

    ligne = 0;

    position = 0;

    debut = 0;


    mettreAJourLignesVisibles();


    /*
       On attend que le navigateur ait
       recalculé les dimensions.
    */

    requestAnimationFrame(
        function() {

            feuille.style.transition =
                "none";


            feuille.style.transform =
                `translateX(-50%) translateY(${positionGrille()}px)`;
        }
    );
}


// =========================================
// MONTER LA GRILLE
// =========================================

function monterGrille() {

    /*
       La nouvelle ligne devient visible.
    */

    mettreAJourLignesVisibles();


    requestAnimationFrame(
        function() {

            let nouvellePosition =
                positionGrille();


            feuille.style.transition =
                "transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)";


            feuille.style.transform =
                `translateX(-50%) translateY(${nouvellePosition}px)`;
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
        - feuilleRect.left
        - 8;


    let arrivee =
        derniereRect.right
        - feuilleRect.left
        + 8;


    let haut =
        premiereRect.top
        - feuilleRect.top
        - 4;


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


                monterGrille();


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


    // Lettres jaunes ou grises

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
    // NOUVELLE LIGNE
    // =====================================

    debut += 5;

    position = 0;


    /*
       Animation du chariot puis montée.
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


        partieTerminee =
            false;

        ligne = 0;

        position = 0;

        debut = 0;


        // Effacer les cases

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


        // Replacer la grille

        remettreGrilleAuDepart();


        // Nouveau mot

        choisirNouveauMot();
    }
);


// =========================================
// RECALCUL SI LA FENÊTRE CHANGE
// =========================================

window.addEventListener(
    "resize",
    function() {

        if (
            !partieTerminee
        ) {

            feuille.style.transition =
                "none";


            feuille.style.transform =
                `translateX(-50%) translateY(${positionGrille()}px)`;
        }
    }
);
