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

		this.caminho = getPathFile(UV1AV1UD6OA01);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		this.load.atlas('bumbaFixo', 		this.caminho+'bumba-fixo.png', 	this.caminho+'bumba-fixo.json');

		//QUESTIONS
		this.load.image('pergunta1', this.caminho+'pergunta1.png');
		this.load.image('pergunta2', this.caminho+'pergunta2.png');
		this.load.image('pergunta3', this.caminho+'pergunta3.png');

		this.load.image('exemploIntro', this.caminho+'baterias-intro.png');
		
		//BOTÕES
		this.load.spritesheet('energia2', this.caminho+'qtd-energia-2.png', 131,224);
		this.load.spritesheet('energia4', this.caminho+'qtd-energia-4.png', 131,224);
		this.load.spritesheet('energia7', this.caminho+'qtd-energia-7.png', 131,224);
		this.load.spritesheet('energia9', this.caminho+'qtd-energia-9.png', 131,224);
		this.load.spritesheet('energia10', this.caminho+'qtd-energia-10.png', 131,224);

		this.load.image('imgResumo', this.caminho+'resumoImg.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA01);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD6OA1_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD6OA1_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD6OA1_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD6OA1_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA1_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA1_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA1_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};