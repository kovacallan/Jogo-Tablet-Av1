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

        this.posicaoXvideo = 740; // muda posicionamento x do icone de video clipe;
        this.posicaoYvideo = 550; // muda posicionamento y do icone de video clipe;

        this.add.sprite(-45,-110,"background");

        this.createAnimation(847,326,"fred",1,1);
        this.createAnimation(896,396,"bumba",1,1);
        this.createAnimation(779,372,"poly",1,1);
        this.createAnimation(826,404,"junior",1,1);

        this.createButton(425, 420,0.6,0.6, this.clickButton1, "icone1", BasicGame.OfflineAPI.isLevelOpen(1), BasicGame.OfflineAPI.isLevelFinished(1));
        this.createButton(180, 305,0.4,0.4, this.clickButton2, "icone2", BasicGame.OfflineAPI.isLevelOpen(2), BasicGame.OfflineAPI.isLevelFinished(2));
        this.createButton( 40, 260,0.3,0.3, this.clickButton3, "icone3", BasicGame.OfflineAPI.isLevelOpen(3), BasicGame.OfflineAPI.isLevelFinished(3));
        this.createButton(285, 180,0.2,0.2, this.clickButton4, "icone4", BasicGame.OfflineAPI.isLevelOpen(4), BasicGame.OfflineAPI.isLevelFinished(4));
        this.createButton(560, 260,0.4,0.4, this.clickButton5, "icone5", BasicGame.OfflineAPI.isLevelOpen(5), BasicGame.OfflineAPI.isLevelFinished(5));
        this.createButton(775, 220,0.3,0.3, this.clickButton6, "icone6", BasicGame.OfflineAPI.isLevelOpen(6), BasicGame.OfflineAPI.isLevelFinished(6));

    }

};

