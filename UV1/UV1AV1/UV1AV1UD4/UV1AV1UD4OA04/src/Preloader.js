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

        this.caminho = getPathFile(UV1AV1UD4OA04);

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// CHARACTER ANIMATION
		this.load.atlas('poly1', this.caminho+'poly_std.png', this.caminho+'poly_std.json');
		this.load.atlas('poly2', this.caminho+'poly.png', this.caminho+'poly.json');
		this.load.atlas('red', this.caminho+'red.png', this.caminho+'red.json');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');

		this.load.spritesheet('piece1', this.caminho+'piece1.png', 105, 114);
		this.load.spritesheet('piece2', this.caminho+'piece2.png', 105, 114);
		this.load.spritesheet('piece3', this.caminho+'piece3.png', 116, 125);
		this.load.spritesheet('piece4', this.caminho+'piece4.png', 123, 131);
		this.load.spritesheet('piece5', this.caminho+'piece5.png', 122, 124);

		this.load.image('hole1', this.caminho+'hole1.png');
		this.load.image('hole2', this.caminho+'hole2.png');
		this.load.image('hole3', this.caminho+'hole3.png');
		this.load.image('hole4', this.caminho+'hole4.png');
		this.load.image('hole5', this.caminho+'hole5.png');

		this.load.image('imgResumo', this.caminho+'resumo_img.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD4OA04);


		this.load.audio('soundP1', [this.caminho+'UV1AV1UD4OA04_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD4OA04_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD4OA04_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1AV1UD4OA04_DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD4OA04_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD4OA04_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD4OA04_INTRO.mp3']);

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
