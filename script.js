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


    // Animation

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    animerTouche(lettre);


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
            partieTerminee
        ) {

            return;
        }


        // Lettres

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
               Début :
               ligne 1 seulement.

               Après essai 1 :
               lignes 1 + 2.

               Après essai 2 :
               lignes 1 + 2 + 3.

               etc.
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
// POSITION DE LA GRILLE
// =========================================

function positionGrille() {

    /*
       La grille monte progressivement.

       La ligne active reste visible.
    */

    let positions = [

        0,      // ligne 1

        -90,    // ligne 2

        -180,   // ligne 3

        -270,   // ligne 4

        -360,   // ligne 5

        -450    // ligne 6

    ];


    return positions[ligne];
}


// =========================================
// RETOUR AU DÉPART
// =========================================

function remettreGrilleAuDepart() {

    ligne = 0;

    position = 0;

    debut = 0;


    mettreAJourLignesVisibles();


    feuille.style.transition =
        "none";


    feuille.style.transform =
        "translateX(-50%) translateY(0px)";
}


// =========================================
// MONTER LA GRILLE
// =========================================

function monterGrille() {

    /*
       La nouvelle ligne apparaît.
    */

    mettreAJourLignesVisibles();


    /*
       On laisse le navigateur prendre
       en compte son apparition.
    */

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

    /*
       Ligne venant d'être validée.
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


    let depart =
        premiereRect.left -
        feuilleRect.left -
        8;


    let arrivee =
        derniereRect.right -
        feuilleRect.left +
        8;


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


    // Son machine à écrire

    sonChariot.currentTime =
        0;

    sonChariot.play()
        .catch(
            function() {}
        );


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

                /*
                   Retour du chariot.
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

                            easing:
                                "ease-in",

                            fill:
                                "forwards"
                        }
                    );


                /*
                   Et la feuille monte.
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
    // LETTRES DISPONIBLES
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
    // CHARIOT + MONTÉE
    // =====================================

    animerChariot();


    // Nouvelle ligne

    debut += 5;

    position = 0;
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


        // Retour au départ

        remettreGrilleAuDepart();


        // Nouveau mot

        choisirNouveauMot();
    }
);
