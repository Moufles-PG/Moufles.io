```javascript
// =========================
// ÉLÉMENTS HTML
// =========================

let cases = document.querySelectorAll(".case");
let touches = document.querySelectorAll(".touche");

let message = document.querySelector("#message");

let musiqueJeu = document.querySelector("#musiqueJeu");
let musiqueVictoire = document.querySelector("#musiqueVictoire");


// =========================
// VARIABLES
// =========================

let position = 0;
let ligne = 0;
let debut = 0;

let mots = [];
let motSecret = "";

let partieTerminee = false;

// Laisse vide pour un mot aléatoire
let motChoisi = "";


// =========================
// VOLUME DES MUSIQUES
// =========================

musiqueJeu.volume = 0.15;
musiqueVictoire.volume = 0.25;


// =========================
// SON MACHINE À ÉCRIRE
// =========================

let contexteAudio = null;


// Crée le contexte audio uniquement
// quand le joueur commence à interagir

function obtenirContexteAudio() {

    if (!contexteAudio) {

        contexteAudio =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (contexteAudio.state === "suspended") {

        contexteAudio.resume();

    }

    return contexteAudio;

}


// =========================
// PETIT "CLAC"
// =========================

function sonTouche() {

    let audio = obtenirContexteAudio();

    let oscillateur =
        audio.createOscillator();

    let gain =
        audio.createGain();

    oscillateur.type = "square";

    oscillateur.frequency.setValueAtTime(
        170,
        audio.currentTime
    );

    oscillateur.frequency.exponentialRampToValueAtTime(
        75,
        audio.currentTime + 0.035
    );

    gain.gain.setValueAtTime(
        0.035,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.045
    );

    oscillateur.connect(gain);
    gain.connect(audio.destination);

    oscillateur.start();

    oscillateur.stop(
        audio.currentTime + 0.05
    );

}


// =========================
// SON D'ENRAYEMENT
// =========================

function sonEnrayement() {

    let audio = obtenirContexteAudio();

    let oscillateur =
        audio.createOscillator();

    let gain =
        audio.createGain();

    oscillateur.type = "sawtooth";

    oscillateur.frequency.setValueAtTime(
        120,
        audio.currentTime
    );

    oscillateur.frequency.setValueAtTime(
        65,
        audio.currentTime + 0.025
    );

    oscillateur.frequency.setValueAtTime(
        105,
        audio.currentTime + 0.05
    );

    oscillateur.frequency.setValueAtTime(
        55,
        audio.currentTime + 0.075
    );

    gain.gain.setValueAtTime(
        0.025,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.1
    );

    oscillateur.connect(gain);
    gain.connect(audio.destination);

    oscillateur.start();

    oscillateur.stop(
        audio.currentTime + 0.11
    );

}


// =========================
// ANIMATION TOUCHE
// =========================

function animerTouche(touche) {

    touche.classList.remove(
        "touche-appuyee"
    );

    void touche.offsetWidth;

    touche.classList.add(
        "touche-appuyee"
    );

    setTimeout(function() {

        touche.classList.remove(
            "touche-appuyee"
        );

    }, 120);

}


// =========================
// ACCENTS
// =========================

function enleverAccents(texte) {

    return texte
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


// =========================
// MESSAGE
// =========================

function afficherMessage(texte) {

    message.textContent = texte;

    message.style.opacity = "1";

    setTimeout(function() {

        message.style.opacity = "0";

    }, 1500);

}


// =========================
// CLAVIER
// =========================

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


        // =========================
        // VERT
        // =========================

        if (couleur === "vert") {

            touche.classList.remove(
                "jaune"
            );

            touche.classList.remove(
                "gris"
            );

            touche.classList.add(
                "vert"
            );

        }


        // =========================
        // JAUNE
        // =========================

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


        // =========================
        // GRIS
        // =========================

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


// =========================
// TROUVER UNE TOUCHE
// =========================

function trouverTouche(lettre) {

    for (
        let i = 0;
        i < touches.length;
        i++
    ) {

        if (
            touches[i].textContent === lettre
        ) {

            return touches[i];

        }

    }

    return null;

}


// =========================
// MUSIQUE DU JEU
// =========================

function lancerMusiqueJeu() {

    if (
        musiqueJeu.paused
    ) {

        musiqueJeu.play().catch(
            function(erreur) {

                console.log(
                    "Wordle1 ne peut pas démarrer :",
                    erreur
                );

            }
        );

    }

}


// =========================
// ÉCRIRE UNE LETTRE
// =========================

function ecrireLettre(lettre) {

    if (partieTerminee) {

        return;

    }


    if (position >= 5) {

        return;

    }


    // =========================
    // LETTRE DÉJÀ BLOQUÉE
    // =========================

    let touche =
        trouverTouche(lettre);


    if (
        touche &&
        touche.classList.contains("gris")
    ) {

        animerTouche(touche);

        sonEnrayement();

        return;

    }


    // =========================
    // MUSIQUE
    // =========================

    lancerMusiqueJeu();


    // =========================
    // SON DE TOUCHE
    // =========================

    sonTouche();


    // =========================
    // ANIMATION CLAVIER
    // =========================

    if (touche) {

        animerTouche(touche);

    }


    // =========================
    // ÉCRIRE
    // =========================

    let caseActuelle =
        cases[
            debut + position
        ];


    caseActuelle.textContent =
        lettre;


    // =========================
    // ANIMATION LETTRE
    // =========================

    caseActuelle.classList.remove(
        "letter-animation"
    );

    void caseActuelle.offsetWidth;

    caseActuelle.classList.add(
        "letter-animation"
    );


    position++;

}


// =========================
// EFFACER
// =========================

function effacerLettre() {

    if (partieTerminee) {

        return;

    }


    if (position > 0) {

        position--;

        cases[
            debut + position
        ].textContent = "";

    }

}


// =========================
// CHARGER LES MOTS
// =========================

fetch("mots.txt")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Impossible de charger mots.txt"
            );

        }

        return response.text();

    })

    .then(function(texte) {

        mots = texte

            .split(/\r?\n/)

            .map(function(mot) {

                return enleverAccents(
                    mot.trim().toUpperCase()
                );

            })

            .filter(function(mot) {

                return mot.length === 5;

            });


        console.log(
            "Mots chargés :",
            mots.length
        );


        // =========================
        // MOT SECRET
        // =========================

        if (motChoisi === "") {

            motSecret =
                mots[
                    Math.floor(
                        Math.random() *
                        mots.length
                    )
                ];

        }

        else {

            motSecret =
                enleverAccents(
                    motChoisi.toUpperCase()
                );

        }


        console.log(
            "Mot secret :",
            motSecret
        );

    })

    .catch(function(erreur) {

        console.error(
            "Erreur mots.txt :",
            erreur
        );

    });


// =========================
// CLAVIER PHYSIQUE
// =========================

document.addEventListener(
    "keydown",
    function(event) {

        if (partieTerminee) {

            return;

        }


        // =========================
        // LETTRE
        // =========================

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

                return;

            }

        }


        // =========================
        // EFFACER
        // =========================

        if (
            event.key === "Backspace"
        ) {

            effacerLettre();

            return;

        }


        // =========================
        // VALIDER
        // =========================

        if (
            event.key === "Enter"
        ) {

            validerMot();

            return;

        }

    }
);


// =========================
// CLAVIER VIRTUEL
// =========================

touches.forEach(function(touche) {

    touche.addEventListener(
        "click",
        function() {

            if (partieTerminee) {

                return;

            }


            let lettre =
                touche.textContent;


            // Lettre bloquée

            if (
                touche.classList.contains(
                    "gris"
                )
            ) {

                animerTouche(touche);

                sonEnrayement();

                return;

            }


            ecrireLettre(lettre);

        }
    );

});


// =========================
// VALIDER LE MOT
// =========================

function validerMot() {

    if (partieTerminee) {

        return;

    }


    // =========================
    // PAS ASSEZ DE LETTRES
    // =========================

    if (position < 5) {

        afficherMessage(
            "Pas assez de lettres."
        );

        return;

    }


    // =========================
    // CONSTRUIRE LE MOT
    // =========================

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


    // =========================
    // MOT INEXISTANT
    // =========================

    if (
        !mots.includes(mot)
    ) {

        afficherMessage(
            "Ce mot n'existe pas"
        );

        return;

    }


    // =========================
    // VICTOIRE
    // =========================

    if (
        mot === motSecret
    ) {

        console.log(
            "VICTOIRE !"
        );


        partieTerminee = true;


        // =========================
        // WORDLE1
        // =========================

        musiqueJeu.pause();

        musiqueJeu.currentTime = 0;


        // =========================
        // VICTORY
        // =========================

        musiqueVictoire.currentTime = 0;

        musiqueVictoire.play().catch(
            function(erreur) {

                console.error(
                    "Victory ne peut pas démarrer :",
                    erreur
                );

            }
        );


        // =========================
        // CASES VERTES
        // =========================

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


        return;

    }


    // =========================
    // MAUVAIS MOT
    // =========================

    let lettresDisponibles =
        motSecret.split("");


    // =========================
    // VERT
    // =========================

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


    // =========================
    // JAUNE / GRIS
    // =========================

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


        // =========================
        // JAUNE
        // =========================

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


        // =========================
        // GRIS
        // =========================

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


    // =========================
    // LIGNE SUIVANTE
    // =========================

    ligne++;


    if (
        ligne === 6
    ) {

        window.location =
            "perdu.html";

    }

    else {

        debut += 5;

        position = 0;

    }

}
```
