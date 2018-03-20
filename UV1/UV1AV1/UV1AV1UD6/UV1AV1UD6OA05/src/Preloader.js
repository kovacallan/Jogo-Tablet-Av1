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

		this.caminho = getPathFile(UV1AV1UD6OA05);

		this.load.image('initialText', this.caminho+'initialText.png');
		this.load.image('initialText1', this.caminho+'initialText1.png');
		this.load.image('initialText2', this.caminho+'initialText2.png');
		
		// SCENE
		this.load.image('background', this.caminho+'background.png');

		// GAMEPLAY
		this.load.image('pergunta1', this.caminho+'texto_p1.png');
		this.load.image('pergunta2', this.caminho+'texto_p2.png');
		this.load.image('pergunta3', this.caminho+'texto_p3.png');
		
		this.load.image('imgResumo', this.caminho+'texto_resumo.png');

		//itens
		this.load.image('chave', this.caminho+'chave.png');
		this.load.image('calculadora', this.caminho+'calculadora.png');
		this.load.image('ovo', this.caminho+'ovo.png');
		this.load.image('sacola', this.caminho+'sacola.png');
		this.load.image('funil', this.caminho+'funil.png');
		this.load.image('peteca', this.caminho+'peteca.png');
		this.load.image('telefone', this.caminho+'telefone.png');
		this.load.image('boneca', this.caminho+'boneca.png');
		this.load.image('chave_de_fenda', this.caminho+'chave_de_fenda.png');
		this.load.image('bota', this.caminho+'bota.png');
		this.load.image('bala', this.caminho+'bala.png');
		this.load.image('dente', this.caminho+'dente.png');
		this.load.image('cadeado', this.caminho+'cadeado.png');
		this.load.image('cachimbo', this.caminho+'cachimbo.png');
		this.load.image('caneta', this.caminho+'caneta.png');
		this.load.image('livro', this.caminho+'livro.png');

		this.load.image('retangulo', this.caminho+'retangulo.png');
		this.load.image('quadrado', this.caminho+'quadrado.png');
		this.load.image('losango', this.caminho+'losango.png');
		this.load.image('elipse', this.caminho+'elipse.png');
		this.load.image('pentagono', this.caminho+'pentagono.png');
		this.load.image('triangulo', this.caminho+'triangulo.png');

		this.load.atlas('poly', this.caminho+'anim_poly.png', this.caminho+'anim_poly.json');
		this.load.atlas('fred', this.caminho+'anim_fred.png', this.caminho+'anim_fred.json');
		this.load.atlas('walter', this.caminho+'anim_walter.png', this.caminho+'anim_walter.json');

		this.caminho = getPathFileSound(SOUNDS_UV1AV1UD6OA05);

		this.load.audio('soundP1', [this.caminho+'UV1AV1UD6OA5_P1.mp3']);
		this.load.audio('soundP2', [this.caminho+'UV1AV1UD6OA5_P2.mp3']);
		this.load.audio('soundP3', [this.caminho+'UV1AV1UD6OA5_P3.mp3']);

		this.load.audio('soundDica', [this.caminho+'UV1UD06OA5_DICA1.mp3']);
		this.load.audio('soundFinal', [this.caminho+'UV1AV1UD6OA5_FINAL.mp3']);
		this.load.audio('soundResumo', [this.caminho+'UV1AV1UD6OA5_RESUMO.mp3']);
		this.load.audio('soundIntro', [this.caminho+'UV1AV1UD6OA5_INTRO.mp3']);
	},

	update: function () {

        var decoded = this.cache.isSoundDecoded('soundIntro');
        if (decoded && this.ready == false && this.effectFinished && BasicGame.Pontuacao != null)
        {
            this.initGame();
        }
    }




};
