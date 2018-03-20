BasicGame.Game = function (game) {

    this.initExtends();

    BasicGame.GameBase.call(game);
};

BasicGame.Game.prototype = Object.create(BasicGame.GameBase.prototype);
BasicGame.Game.prototype.constructor = BasicGame.Game;

BasicGame.Game.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Game.prototype[name] = this.extends[name];
    }
};

BasicGame.Game.prototype.extends = {
    create: function () {
        console.log("create map");

        this.createMap();
        console.log("***> create map" + this.verificaVideo());
        if(!this.verificaVideo()) {
            this.initGameMap();
            this.gameStarted = true;
        }

    },

    createScene: function() {

        //this.sound.play('backgroundMusic', 0.75, true);

        this.posicaoXvideo = 230; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 545; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-570,-150,"background");

        this.createAnimation(110,230,"fred",1,1);
        this.createAnimation(30,305,"bumba",1,1);
        this.createAnimation(180,275,"poly",1,1);
        this.createAnimation(125,310,"junior",1,1);


        this.createAnimation(475,420,"pi1",1,1);

        this.createAnimation(665,495,"pi2",1,1);
        this.createAnimation(695,235,"pi5",1,1);
        this.createAnimation(658,250,"pi4",1,1);

        this.createAnimation(935,300,"pi3",1,1);

        this.createAnimation(315,460,"red1",1,1);
        this.createAnimation(910,380,"red1",-0.6,0.6);

        this.createButton(640,432,0.6,0.6,  this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1),true,677.9,445);
        this.createButton(345,380,0.5,0.5,  this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton(280,300,0.35,0.35,this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(455,327,0.4,0.4,  this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(545,285,0.4,0.4,  this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(775,329,0.5,0.5,  this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));

    }

};



