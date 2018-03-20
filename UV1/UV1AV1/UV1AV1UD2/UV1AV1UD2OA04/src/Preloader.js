BasicGame.Preloader = function (game) {

    this.initExtends();

    BasicGame.PreloaderBase.call(game);
};

BasicGame.Preloader.prototype = Object.create(BasicGame.PreloaderBase.prototype);
BasicGame.Preloader.prototype.constructor = BasicGame.Preloader;

BasicGame.Preloader.prototype.initExtends = function() {
    for(var name in this.extends) {
        BasicGame.Preloader.prototype[name] = this.extends[name];
    }
};

BasicGame.Preloader.prototype.extends = {

	preload: function () {

		this.initPreloaderBase();

        //this.load.image('arrow', '../../../../GLOBAL/images/arrow.png');
        //this.load.atlas('clickAnimation', '../../../../GLOBAL/images/click_animation.png', '../../../../GLOBAL/images/click_animation.json');
			
		//INITIAL
		this.caminho = getPathFile(UV1AV1UD2OA04);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		

		// SCENE
		this.load.image('background', this.caminho+'background.png');



		// CHARACTER ANIMATION
		this.load.atlas('walter', this.caminho+'walter.png', this.caminho+'walter.json');
		this.load.atlas('fred', this.caminho+'fred.png', this.caminho+'fred.json');
		this.load.atlas('poly', this.caminho+'poly.png', this.caminho+'poly.json');

		this.load.atlas('sprites', this.caminho+'sprites.png', this.caminho+'sprites.json');


		this.load.image('balao', this.caminho+'balao_letra.png');
		this.load.image('ball', this.caminho+'ball.png');

		this.load.spritesheet('letra_a', this.caminho+'tutorial1.png', 90, 95);
		this.load.spritesheet('letra_e', this.caminho+'tutorial2.png', 90, 95);
		this.load.spritesheet('letra_i', this.caminho+'tutorial3.png', 90, 95);
		this.load.spritesheet('letra_o', this.caminho+'tutorial4.png', 90, 95);
		this.load.spritesheet('letra_u', this.caminho+'tutorial5.png', 90, 95);


		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA04);

		this.load.audio('soundP11', [this.caminho+'UV1AV1UD2OA4-P1_1.mp3']);
		this.load.audio('soundP12', [this.caminho+'UV1AV1UD2OA4-P1_2.mp3']);
		this.load.audio('soundP21', [this.caminho+'UV1AV1UD2OA4-P2_1.mp3']);
		this.load.audio('soundP22', [this.caminho+'UV1AV1UD2OA4-P2_2.mp3']);
		this.load.audio('soundP31', [this.caminho+'UV1AV1UD2OA4-P3_1.mp3']);
		this.load.audio('soundP32', [this.caminho+'UV1AV1UD2OA4-P3_2.mp3']);


		this.load.audio('soundDica', [this.caminho+'UV1AV1UD2OA4-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD2OA4-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD2OA4-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD2OA4-INTRO.mp3']);

		this.load.audiosprite("soundItens", this.caminho+"output.mp3", this.caminho+"output.json"); 
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
