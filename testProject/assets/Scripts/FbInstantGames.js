
//
//      各関数のimage要素を指定した画像にしたい場合、あらかじめBase64に変換した文字列型を入力してください。ただ、すごく長いです。
//      画像が小さすぎると最低ラインまで引き伸ばして表示されるので注意。200px未満は若干ぼやけるようです。
//      48:25の画像だとスマホでジャストのサイズになります。(PC版だとフルで表示されます)720x375が理想サイズ？　
//      スクショでいいならgetImgBase64()を読んだだけで大丈夫です。
//

cc.Class({
    extends: cc.Component,

    properties: {
        spriteUrl: String,
        tSprite: cc.Node,

        gameTitle: 'TEST',
    },

    onLoad() {
    },

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
            console.log('Sharing complete');
        });
        this.tSprite.active = false;

    },

    //アプリへの招待
    sendRequest() {

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.context.chooseAsync().then(function (e) {
            this.inviteMessage();
        });

    },

    //友達とのチャット画面でゲームを始めた時にだけ呼ばれる。「〇〇さんが今プレイしました。次はあなたの番です」←これ
    //何も書いていないとデフォルトの文章を自動翻訳で送る。この時の言語は端末に設定されている言語に依存する。
    //場合によって文章を変えたい場合は言語コードを記述して文章を書けば良い。

    playMessage() {
        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: this.getImgBase64(),

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm
            //国名指定のコードでないと反応しない。

            text:
            {
                default: FBInstant.player.getName() + "just played. It's your turn!",
                localizations: {
                    ja_JP: FBInstant.player.getName() + "さんがプレイしました。次はあなたの番です！"
                }
            },
            template: 'WORD_PLAYED',
            data: { myReplayData: '...' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            console.log('Message was sent successfully');
        }).catch(function () {
            console.log('failed!');
        });
    },

    //招待の時のメッセージ
    inviteMessage() {

        this.tSprite.active = true;

        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            image: this.getImgBase64(),

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm
            //国名指定のコードでないと反応しない。

            text:
            {
                default: FBInstant.player.getName() + "just played. It's your turn!",
                localizations: {
                    /*必須言語*/
                    //英語(アメリカ)
                    en_US: "An invitation letter for " + this.gameTitle + " has arrived from " + FBInstant.player.getName() + "!",
                    //ポルトガル語(ブラジル)
                    pt_BR: "Uma carta de convite para " + this.gameTitle + " chegou de " + FBInstant.player.getName() + "!",
                    //インドネシア語)(インドネシア)
                    id_ID: "Surat undangan untuk " + this.gameTitle + " telah tiba dari " + FBInstant.player.getName() + "!",
                    //フランス語(フランス)
                    fr_FR: "Une lettre d'invitation pour " + this.gameTitle + " est arrivée de " + FBInstant.player.getName() + "!",
                    //ベトナム語(ベトナム)
                    vi_VN: "Một lá thư mời cho " + this.gameTitle + " đã đến từ " + FBInstant.player.getName() + "!",
                    //タイ語(タイ)
                    th_TH: "จดหมายเชิญสำหรับ " + this.gameTitle + " มาถึงแล้วจาก " + FBInstant.player.getName() + "!",
                    //トルコ語(トルコ)
                    tr_TR: "Ben " + FBInstant.player.getName() + " bir " + this.gameTitle + " davet aldı!",
                    //ドイツ語(ドイツ)
                    de_DE: "Ein Einladungsschreiben für " + this.gameTitle + " ist von " + FBInstant.player.getName() + " eingetroffen!",
                    //スペイン語(スペイン)
                    es_ES: "¡Una carta de invitación para " + this.gameTitle + " ha llegado de " + FBInstant.player.getName() + "!",
                    //アラビア語(アメリカ)
                    ar_AE: "تم إرسال خطاب دعوة لـ " + this.gameTitle + " من " + FBInstant.player.getName() + "!",

                    /*推奨言語*/
                    //日本語(日本)
                    ja_JP: FBInstant.player.getName() + "さんから" + this.gameTitle + "の招待状が届きました!",
                    //イタリア語(イタリア)
                    it_IT: "Una lettera di invito per " + this.gameTitle + " è arrivata da " + FBInstant.player.getName() + "!",
                    //中国語(簡体)
                    zh_Hans: "我们收到了" + FBInstant.player.getName() + "的" + this.gameTitle + "邀请！",
                    //中国語(繁体)
                    zh_Hant: "我們收到了" + FBInstant.player.getName() + "的" + this.gameTitle + "邀請！",
                    //ロシア語(ロシア)
                    ru_RU: this.gameTitle + " приглашения прибыл из " + FBInstant.player.getName() + "!",
                    //ポーランド語(ポーランド)
                    pl_PL: this.gameTitle + " zaproszenia przybył z " + FBInstant.player.getName() + "!",
                    //オランダ語(オランダ)
                    nl_NL: "Een uitnodigingsbrief voor " + this.gameTitle + " is aangekomen van " + FBInstant.player.getName() + "!",
                    //スウェーデン語(スウェーデン)
                    sv_SE: "Vi fick en " + this.gameTitle + " inbjudan från " + FBInstant.player.getName() + "!",
                    //フィンランド語(フィンランド)
                    sv_FI: FBInstant.player.getName() + ": lta on saapunut " + this.gameTitle + "-kutsu!",
                    //ハンガリー語(ハンガリー)
                    hu_HU: "Meghívás az " + this.gameTitle + "-ra megérkezett a " + FBInstant.player.getName() + "-ból!",
                    //ギリシャ語(ギリシャ)
                    el_GR: "Λάβαμε μια πρόσκληση από την " + this.gameTitle + " από " + FBInstant.player.getName() + "!",
                    //チェコ語(チェコ)
                    cs_CZ: "Dostali jsme pozvání od firmy " + this.gameTitle + " od společnosti " + FBInstant.player.getName() + "!",
                }
            },
            template: 'WORD_PLAYED',
            data: { myReplayData: '...' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            console.log('Message was sent successfully');
        }).catch(function () {
            console.log('failed!');
        });

        this.tSprite.active = false;

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
                        })
                        .catch(function () {
                            // Shortcut not created
                        });
                }
            });
    },

    //友達を選択して一緒に遊ぶ。ゲームを終了しないで処理が行える。
    PlayWithFriends() {

        if (typeof FBInstant == 'undefined')
            return;

        FBInstant.context.chooseAsync().then(function (e) {

            console.log("FBInstant.context.chooseAsync complete");
            console.log(e);
        });
    },

    //Canvasの左下から指定したサイズ分のスクショを撮る。画像データはbase64に変換される。
    getImgBase64(w, h) {
        let target = cc.find('Canvas');

        let width = 720, height = 375;      //デフォ値。
        if (w != null && h != null)
            width = w, height = h;

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
