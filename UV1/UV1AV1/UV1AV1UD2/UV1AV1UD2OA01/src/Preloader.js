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
		this.caminho = getPathFile(UV1AV1UD2OA01);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');


		// BUTTONS
		this.load.spritesheet('smtCebola3', this.caminho+'semente_cebola01.png', 117,94);
		this.load.spritesheet('smtCebola5', this.caminho+'semente_cebola02.png', 154,104);
		this.load.spritesheet('smtCebola7', this.caminho+'semente_cebola03.png', 150,135);
		this.load.spritesheet('smtBolinha3', this.caminho+'semente_bolinha01.png', 90,78);
		this.load.spritesheet('smtBolinha5', this.caminho+'semente_bolinha02.png', 124,84);
		this.load.spritesheet('smtBolinha7', this.caminho+'semente_bolinha03.png', 147,90);
		this.load.spritesheet('bolRegErro1', this.caminho+'sem_reg_erro1.png', 125,118);
		this.load.spritesheet('bolRegErro2', this.caminho+'sem_reg_erro2.png', 154,123);
		this.load.spritesheet('bolRegCorreto', this.caminho+'sem_reg_correto.png', 122,111);


		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');



		this.load.image('florCebola', this.caminho+'flor_cebola.png');
		this.load.image('florAzul', this.caminho+'flor_azul.png');
		this.load.image('florCinza', this.caminho+'flor_cinza.png');
		this.load.image('txtResumo', this.caminho+'texto_resumo.png');
		this.load.image('buqueG', this.caminho+'buque_grande.png');
		this.load.image('buqueP', this.caminho+'buque_pequeno.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA01);


		this.load.audio('soundP1', [this.caminho+'JC-UV1AV1UD2OA1-Mat-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'JC-UV1AV1UD2OA1-Mat-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'JC-UV1AV1UD2OA1-Mat-P3.mp3']);


		this.load.audio('soundDica', [this.caminho+'JC-UV1AV1UD2OA1-Mat-DICA.mp3']);
		this.load.audio('soundFinal', [this.caminho+'JC-UV1AV1UD2OA1-Mat-FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'JC-UV1AV1UD2OA1-Mat-RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'JC-UV1AV1UD2OA1-Mat-INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
