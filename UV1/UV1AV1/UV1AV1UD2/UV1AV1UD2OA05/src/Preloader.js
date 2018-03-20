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
		
		this.caminho = getPathFile(UV1AV1UD2OA05);


		this.load.atlas('introExemplo', this.caminho+'intro_exemplo.png', this.caminho+'intro_exemplo.json');
		this.load.atlas('resumoExemplo', this.caminho+'resumo_imgs.png', this.caminho+'resumo_imgs.json');
		this.load.atlas('spriteNumeros', this.caminho+'sprites-numeros.png', this.caminho+'sprites-numeros.json');
		
		// BOTÕES
		this.load.atlas('roboG2', this.caminho+'robo_grande_2.png', this.caminho+'robo_grande_2.json');
		this.load.atlas('roboG1', this.caminho+'robo_grande_1.png', this.caminho+'robo_grande_1.json');
		this.load.atlas('roboM2', this.caminho+'robo_medio_2.png', this.caminho+'robo_medio_2.json');
		this.load.atlas('roboM1', this.caminho+'robo_medio_1.png', this.caminho+'robo_medio_1.json');
		this.load.atlas('roboP1', this.caminho+'robo_pequeno.png', this.caminho+'robo_pequeno.json');
		this.load.atlas('detetiveP1', this.caminho+'detetive_pequeno.png', this.caminho+'detetive_pequeno.json');
		this.load.atlas('detetiveM1', this.caminho+'detetive_medio_1.png', this.caminho+'detetive_medio_1.json');
		this.load.atlas('detetiveM2', this.caminho+'detetive_medio_2.png', this.caminho+'detetive_medio_2.json');
		this.load.atlas('detetiveG1', this.caminho+'detetive_grande_1.png', this.caminho+'detetive_grande_1.json');
		this.load.atlas('detetiveG2', this.caminho+'detetive_grande_2.png', this.caminho+'detetive_grande_2.json');
		

		// IMAGENS
		this.load.image('base', this.caminho+'base.png');


		this.load.image('base1', this.caminho+'base_bichinhos1.png');
		this.load.image('base2', this.caminho+'base_bichinhos2.png');
		this.load.image('base3', this.caminho+'base_bichinhos3.png');

		//INITIAL
		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		// SCENE
		this.load.image('background', this.caminho+'background.png');
		//RESUMO
		this.load.image('resumoAlto', this.caminho+'resumo_maisAlto.png');
		this.load.image('resumoBaixo', this.caminho+'resumo_maisBaixo.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		this.load.image('pergunta4', this.caminho+'texto_p4.png');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD2OA05);

		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD2OA5-FINAL.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD2OA5-INTRO.mp3']);
		this.load.audio('soundDica', [this.caminho+'UV1AV1UD2OA5-DICA.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD2OA5-RESUMO.mp3']);
		this.load.audio('soundP1', [this.caminho+'UV1AV1UD2OA5-P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD2OA5-P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD2OA5-P3.mp3']);
		this.load.audio('soundP4', [this.caminho+'UV1AV1UD2OA5-P4.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }

};
