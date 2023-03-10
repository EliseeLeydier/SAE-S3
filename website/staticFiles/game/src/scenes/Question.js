class Question extends Phaser.Scene {

        init(data) {

                this.nameMap = data.nameMap;
                this.intPerso = data.intPerso;
                this.vitesseEnnemy = data.vitesseEnnemy;
                this.pointDeViePerso = data.pointDeViePerso;

            } // Fin init()

        /** @returns {void} */
        editorCreate() {

                const element = document.getElementById('tableauDonnees');
                const tabQuestion = element.dataset.question.split(",");
                const tabAnswer1 = element.dataset.answer1.split(",");
                const tabAnswer2 = element.dataset.answer2.split(",");
                const tabAnswer3 = element.dataset.answer3.split(",");
                const tabAnswer4 = element.dataset.answer4.split(",");
                var listeReponse = [tabAnswer1, tabAnswer2, tabAnswer3, tabAnswer4];
                var aleatoireQuestion = this.getRandomInt(0, tabAnswer1.length - 1);
                this.tabAnswer1 = tabAnswer1;

                // feuilleQuestion
                const feuilleQuestion = this.add.image(500, 294, "feuille").setScrollFactor(0);

                // txtQuestion
                const txtQuestion = this.add.text(230, 150, tabQuestion[aleatoireQuestion], { font: "32px Helvetica bold", fill: "#66431a", wordWrap: { width:650 } }).setScrollFactor(0);

                const valider = this.scene.scene.add.image(490, 415, "valider").setScrollFactor(0);
                valider.scaleX = 0.07;
                valider.scaleY = 0.07;
                new PushOnClick(valider);


                //Aligner feuille et question
                Phaser.Display.Align.In.Center(txtQuestion, feuilleQuestion, 0, -120);

                // Texte "Right" & "False"
                const Aright = this.scene.scene.add.text(420, 225, "Right", { font: "50px Helvetica bold", fill: "#228B22" }).setScrollFactor(0);
                const Afalse = this.scene.scene.add.text(420, 225, "Wrong", { font: "50px Helvetica bold", fill: "#ff0000" }).setScrollFactor(0);
                Afalse.visible = false;
                Aright.visible = false;

                // Groupe de bouton
                var groupeBoutton = this.add.group([
                    { key: 'qcm', frame: 0, repeat: 1, setXY: { x: 350, y: 300, stepX: 280, scrollFactorX: 0 } },
                    { key: 'qcm', frame: 0, repeat: 1, setXY: { x: 350, y: 350, stepX: 280 } }
                ]);

                var valeurExclus = []
                var bonneReponse;

                // Groupe de texte de bouton
                var aleatoireReponse = this.getRandomInt(0, 3,valeurExclus);
                valeurExclus.push(aleatoireReponse);
                const Txtbutton1 = this.scene.scene.add.text(260, 285, listeReponse[aleatoireReponse][aleatoireQuestion], { font: "30px Helvetica bold", fill: "#66431a" }).setScrollFactor(0);
                if(aleatoireReponse == 0){
                    bonneReponse = 0;
                }

                var aleatoireReponse = this.getRandomInt(0, 3,valeurExclus);
                valeurExclus.push(aleatoireReponse);
                const Txtbutton2 = this.scene.scene.add.text(512, 285, listeReponse[aleatoireReponse][aleatoireQuestion], { font: "30px Helvetica bold", fill: "#66431a" }).setScrollFactor(0); 
                if(aleatoireReponse == 0){
                    bonneReponse = 1;
                }

                var aleatoireReponse = this.getRandomInt(0, 3,valeurExclus);
                valeurExclus.push(aleatoireReponse);
                const Txtbutton3 = this.scene.scene.add.text(235, 335, listeReponse[aleatoireReponse][aleatoireQuestion], { font: "30px Helvetica bold", fill: "#66431a" }).setScrollFactor(0);
                if(aleatoireReponse == 0){
                    bonneReponse = 2;
                }

                var aleatoireReponse = this.getRandomInt(0, 3,valeurExclus);
                valeurExclus.push(aleatoireReponse);
                const Txtbutton4 = this.scene.scene.add.text(552, 335, listeReponse[aleatoireReponse][aleatoireQuestion], { font: "30px Helvetica bold", fill: "#66431a" }).setScrollFactor(0);
                if(aleatoireReponse == 0){
                    bonneReponse = 3;
                }

                this.bonneReponse = bonneReponse;

                var groupeTexte = this.add.group();
                groupeTexte.add(Txtbutton1);
                groupeTexte.add(Txtbutton2);
                groupeTexte.add(Txtbutton3);
                groupeTexte.add(Txtbutton4);

                //Creer les enfant des groupes
                var enfantBoutton = groupeBoutton.getChildren();
                var enfantTxt = groupeTexte.getChildren();

                //Aligner les boutons et le text + push on click sur bouton
                for (var i = 0; i < enfantBoutton.length; i++) {
                    new PushOnClick(enfantBoutton[i]);
                    Phaser.Display.Align.In.Center(enfantTxt[i], enfantBoutton[i]);
                }

                this.Aright = Aright;
                this.Afalse = Afalse;
                this.valider = valider;
                this.enfantBoutton = enfantBoutton;
                this.enfantTxt = enfantTxt;

                this.nmbCliqueSelectionnee = 0;

                this.events.emit("scene-awake");
            } // Fin editorCreate()

        createEvent(){

            var selectionnee;
            this.selectionnee = selectionnee;

            //On regarde si la r??ponse est juste ou fausse
            this.valider.once('pointerup', function(event) {

                //Si c'est la premiere fois que on clique sur s??l??ctionn??
                if (this.nmbCliqueSelectionnee == 0) {

                    this.nmbCliqueSelectionnee = 1; // On ne peut plus changer de r??ponse

                    if (this.bonneReponse == this.selectionnee) { // Si la r??ponse s??l??ctionn?? est la bonne
                        this.Aright.visible = true;
                        this.Afalse.visible = false;
                        if (this.vitesseEnnemy <= 80) {
                            this.vitesseEnnemy = 70;
                        } else {
                            this.vitesseEnnemy -= 10;
                        }
                    } else {
                        this.Aright.visible = false;
                        this.Afalse.visible = true;
                        this.vitesseEnnemy += 50
                    } // Fin if else

                } // Fin if else

                this.valider.once('pointerup', function(event) {

                    this.scene.stop("Question");
                    this.scene.stop('Level');
                    this.scene.start("Level", [2, this.intPerso, this.vitesseEnnemy, this.pointDeViePerso]);



                }, this);
            }, this);

        } // Fin createEvent

        create() {
            this.editorCreate();
            this.createEvent();
        } // Fin create()

        /*getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }*/
        getRandomInt(min, max, excludedValues) {
            min = Math.ceil(min);
            max = Math.floor(max);
            let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
            if (excludedValues && excludedValues.includes(randomInt)) {
              return this.getRandomInt(min, max, excludedValues);
            }
            return randomInt;
          }

        update() {

                // on d??s??l??ctionne l'ancienne r??ponse et s??l??ctionne la nouvelle r??ponse
                this.enfantBoutton[0].once('pointerup', function(event) {
                    if (this.nmbCliqueSelectionnee == 0) { // si la r??ponse n'as pas encore ??t?? s??l??ctionn??
                        this.enfantTxt[0].setStyle({ color: "#228B22" })
                        this.enfantTxt[1].setStyle({ color: "#66431a" })
                        this.enfantTxt[2].setStyle({ color: "#66431a" })
                        this.enfantTxt[3].setStyle({ color: "#66431a" })
                        this.selectionnee = 0;
                    }
                }, this);
                this.enfantBoutton[1].once('pointerup', function(event) {
                    if (this.nmbCliqueSelectionnee == 0) { // si la r??ponse n'as pas encore ??t?? s??l??ctionn??
                        this.enfantTxt[0].setStyle({ color: "#66431a" })
                        this.enfantTxt[1].setStyle({ color: "#228B22" })
                        this.enfantTxt[2].setStyle({ color: "#66431a" })
                        this.enfantTxt[3].setStyle({ color: "#66431a" })
                        this.selectionnee = 1;
                    }
                }, this);
                this.enfantBoutton[2].once('pointerup', function(event) {
                    if (this.nmbCliqueSelectionnee == 0) { // si la r??ponse n'as pas encore ??t?? s??l??ctionn??
                        this.enfantTxt[0].setStyle({ color: "#66431a" })
                        this.enfantTxt[1].setStyle({ color: "#66431a" })
                        this.enfantTxt[2].setStyle({ color: "#228B22" })
                        this.enfantTxt[3].setStyle({ color: "#66431a" })
                        this.selectionnee = 2;
                    }
                }, this);
                this.enfantBoutton[3].once('pointerup', function(event) {
                    if (this.nmbCliqueSelectionnee == 0) { // si la r??ponse n'as pas encore ??t?? s??l??ctionn??
                        this.enfantTxt[0].setStyle({ color: "#66431a" })
                        this.enfantTxt[1].setStyle({ color: "#66431a" })
                        this.enfantTxt[2].setStyle({ color: "#66431a" })
                        this.enfantTxt[3].setStyle({ color: "#228B22" })
                        this.selectionnee = 3;
                    }
                }, this);


            } // Fin update()

    } //Fin class