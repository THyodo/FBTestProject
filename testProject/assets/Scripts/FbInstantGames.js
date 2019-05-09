
//
//      各関数のimage要素を指定した画像にしたい場合、あらかじめBase64に変換した文字列型を入力してください。ただ、すごく長いです。
//      画像が小さすぎると最低ラインまで引き伸ばして表示されるので注意。200px未満は若干ぼやけるようです。
//      48:25の画像だとスマホでジャストのサイズになります。(PC版だとフルで表示されます)720x375が理想サイズ。
//      スクショでいいならgetImgBase64()を読んだだけで大丈夫です。
//

cc.Class({
    extends: cc.Component,

    properties: {
        testText: cc.Label,
        shareUrl: String,
        tSprite: cc.Node,
    },

    // onLoad () {},

    start() {
    },

    //シェア機能。現状はタイムライン投稿しようとするとtextメッセージが消えてしまう。
    shareGame() {

        this.tSprite.active = true;

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.shareAsync({
            intent: 'SHARE',    //何をするのか
            image: this.getImgBase64(),
            text: 'Great!',
            data: { myReplayData: '...' },
        }).then(() => {
            // continue with the game.
            this.testText.string = '共有完了';
            console.log('共有完了');
        });
        this.tSprite.active = false;

    },

    //アプリへの招待
    sendRequest() {

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.shareAsync({
            intent: 'CUSTOM',
            image: this.getImgBase64(),
            text: '',
            data: { myReplayData: '...' },
        }).then(function () {
            this.testText.string = 'Message was sent successfully';
            console.log('Message was sent successfully');
        }).catch(function () {
            this.testText.string = '';
            console.log('failed!');
        });

    },

    //友達とのチャット画面でゲームを始めた時にだけ呼ばれる。「〇〇さんが今プレイしました。次はあなたの番です」←これ
    playMessage() {

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            // image: this.getImgBase64(),
            image: this.getImgBase64(),

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm

            text:
            {
                default: FBInstant.player.getName() + "just played. It's your turn!",
                localizations: {
                    //派生言語は別に追加する必要あり。
                    en_US: '',                                                                  //英語(アメリカ)
                    pt_BR: '',                                                                  //ポルトガル語(ブラジル)
                    id_ID: '',                                                                  //インドネシア語(インドネシア)
                    fr_CA: '',                                                                  //フランス語(フランス)
                    vi_VN: '',                                                                  //ベトナム語(ベトナム)
                    th_TH: '',                                                                  //タイ語(タイ)
                    tr_TR: '',                                                                  //トルコ語(トルコ)
                    de_DE: '',                                                                  //ドイツ語(ドイツ)
                    es_ES: '',                                                                  //スペイン語(スペイン)
                    ar_AE: '',                                                                  //アラビア語(アメリカ)

                    ja_JP: FBInstant.player.getName() + 'さんが今プレイしました。あなたの番です！',     //日本語(日本)
                }
            },
            template: 'WORD_PLAYED',
            data: { myReplayData: '...' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            console.log('Message was sent successfully');
            this.testText.string = 'Message was sent successfully';
        }).catch(function () {
            console.log('failed!');
            this.testText.string = 'failed';
        });

    },

    //ショートカット作成(Androidのみ対応)
    createShortCut() {
        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.canCreateShortcutAsync()
            .then(function (canCreateShortcut) {
                if (canCreateShortcut) {
                    FBInstant.createShortcutAsync()
                        .then(function () {
                            // Shortcut created
                            this.testText.string = 'ショートカット作成';
                        })
                        .catch(function () {
                            // Shortcut not created
                            this.testText.string = 'ショートカット作成失敗';
                        });
                }
            });
    },

    //友達を選択して一緒に遊ぶ。ゲームを終了しないで処理が行える。
    PlayWithFriends() {

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.context.chooseAsync().then(function (e) {

            this.testText.string = "FBInstant.context.chooseAsync complete";
            console.log("FBInstant.context.chooseAsync complete");
            console.log(e);
        });
    },

    //Botサイト登録。
    onBuyBot() {
        FBInstant.player.subscribeBotAsync().then({
            // Player is subscribed to the bot
        }).then(function (e) {
            console.log('Bot購読済み');
            this.testText.string = 'Bot購読済み';
        }).catch(function (e) {
            // Handle subscription failure
            this.testText.string = 'Bot未購読';
        });
    },

    //呼ばれたタイミングでスクショを撮る。シェアなどのimageにはここの戻り値を入れればいいかも
    getImgBase64() {
        let target = cc.find('Canvas');
        let width = 720, height = 375;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        let canvas = document.createElement('canvas');      //HTML要素生成。
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;                             //縦横幅設定
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, width / 2, height / 2);
        }
        //基本的にWebGLらしい。ビルド設定からWebGL優先に設定しているため。
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();                                                        //フレームバッファ生成
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);                                                 //フレームバッファをWebGLにバインド
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);   //フレームバッファへのテクスチャの紐付け
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);                        //←第1,2引数を弄るとオフセットがずれるが、ずれた分は表示されない(真っ白)
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);                                                   //フレームバッファをWebGLにバインド
            let rowBytes = width * 4;
            //プリンタみたいに1行(px)ずつデータ書き込み。
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;            //描画する高さ設定。上から順に。
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);     //ピクセルデータ設定。
                ctx.putImageData(imageData, 0, row);            //Canvasに指定のImageDataオブジェクトのデータを描画。
            }
        }
        return canvas.toDataURL('image/png');
    },

    // update (dt) {},
});
