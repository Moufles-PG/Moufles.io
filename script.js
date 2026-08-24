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

    message.textContent = texte;

    message.style.opacity = "1";


    setTimeout(
        function() {

            message.style.opacity = "0";

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


    // Trouver la touche

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


    // Animation de la touche

    animerTouche(lettre);


    // =====================================
    // MUSIQUE DU JEU
    // =====================================

    /*
       La musique commence dès la première
       lettre tapée.
    */

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

               lignes 1, 2, 3 = visibles

               lignes 4, 5, 6 = cachées
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
// POSITION DE LA GRILLE
// =========================================

function positionGrille() {

    /*
       Ces valeurs déterminent simplement
       la montée de la grille.

       0 :
       position de départ.

       Puis la grille monte progressivement.
    */

    let positions = [
    80,
    35,
    -10,
    -55,
    -100,
    -145
];


    return positions[ligne];
}


// =========================================
// REMETTRE LA GRILLE AU DÉPART
// =========================================

function remettreGrilleAuDepart() {

    ligne = 0;

    position = 0;

    debut = 0;


    mettreAJourLignesVisibles();


    /*
       Pas d'animation au chargement.
    */

    feuille.style.transition =
        "none";


    feuille.style.transform =
    "translateX(-50%) translateY(80px)";
}


// =========================================
// MONTER LA GRILLE
// =========================================

function monterGrille() {

    /*
       On affiche d'abord la nouvelle ligne.
    */

    mettreAJourLignesVisibles();


    /*
       Petite attente pour que le navigateur
       prenne en compte la nouvelle hauteur
       de la feuille.
    */

    requestAnimationFrame(
        function() {

            let nouvellePosition =
                positionGrille();


            feuille.style.transition =
                "transform 0.85s cubic-bezier(0.22, 0.61, 0.36, 1)";


            feuille.style.transform =
                `translateX(-50%) translateY(${nouvellePosition}px)`;

        }
    );
}


// =========================================
// ANIMATION DU CHARIOT
// =========================================

function animerChariot() {

    /*
       La ligne qui vient d'être validée
       est ligne - 1.
    */

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


    /*
       Départ du chariot.
    */

    let depart =
        premiereRect.left -
        feuilleRect.left -
        8;


    /*
       Arrivée du chariot.
    */

    let arrivee =
        derniereRect.right -
        feuilleRect.left +
        8;


    /*
       Hauteur.
    */

    let haut =
        premiereRect.top -
        feuilleRect.top -
        4;


    chariot.style.left =
        depart + "px";

    chariot.style.top =
        haut + "px";

    chariot.style.opacity =
        "1";


    // Son de machine à écrire

    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


    /*
       Le chariot traverse la ligne.
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
                duration: 450,

                easing: "ease-out",

                fill: "forwards"
            }
        );


    aller.finished
        .then(
            function() {

                /*
                   Retour rapide du chariot.
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
                                    depart + "px"
                            }
                        ],

                        {
                            duration: 320,

                            easing: "ease-in",

                            fill: "forwards"
                        }
                    );


                /*
                   La feuille monte pendant
                   le retour du chariot.
                */

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


    // =====================================
    // PAS ASSEZ DE LETTRES
    // =====================================

    if (
        position < 5
    ) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;
    }


    // =====================================
    // CONSTRUIRE LE MOT
    // =====================================

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


    // =====================================
    // MOT INEXISTANT
    // =====================================

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


        // Cases vertes

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


        // Écran de victoire

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
    // LETTRES DISPONIBLES
    // =====================================

    let lettresDisponibles =
        motSecret.split("");


    // =====================================
    // LETTRES VERTES
    // =====================================

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
    // JAUNES / GRISES
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
    // ESSAI SUIVANT
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
    // CHARIOT
    // =====================================

    animerChariot();


    // =====================================
    // NOUVELLE LIGNE
    // =====================================

    debut += 5;

    position = 0;
}


// =========================================
// REJOUER
// =========================================

boutonRejouer.addEventListener(
    "click",
    function() {

        // Cacher écran

        ecranFin.style.display =
            "none";


        // Variables

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


        // Arrêter les musiques

        musiqueJeu.pause();

        musiqueJeu.currentTime =
            0;


        musiqueVictoire.pause();

        musiqueVictoire.currentTime =
            0;


        musiqueDefaite.pause();

        musiqueDefaite.currentTime =
            0;


        // Cacher le chariot

        chariot.style.opacity =
            "0";


        /*
           Retour immédiat à la position
           de départ.
        */

        feuille.style.transition =
            "none";

        feuille.style.transform =
            "translateX(-50%) translateY(0px)";


        // Seulement 3 lignes

        mettreAJourLignesVisibles();


        // Nouveau mot

        choisirNouveauMot();
    }
);
