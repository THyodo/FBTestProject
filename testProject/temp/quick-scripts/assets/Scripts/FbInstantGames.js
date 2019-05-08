(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/FbInstantGames.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df65flxV5BIf7nZCQKp8RMQ', 'FbInstantGames', __filename);
// Scripts/FbInstantGames.js

'use strict';

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
        shareUrl: String
    },

    // onLoad () {},

    start: function start() {
        this.shareUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wUHByotJsjynQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAALiSURBVFjD7Zg7aCpREIaPl9tY2AYEK4sUFiliYyMEwWKxCaSxU4SkTGsn2IhgYROIVqIgixKDBBNiIxgUBWVBTLZYiAYDiahY+Ejwsc6tcrkX58THriZFBk5zzgz/tz/rcWYVAADkG8cv8s3jB/DLAWOxGFEoFOg6PDwk0+lUmgBIiOFwCPv7+0AIoa5SqSRFAiQ5mMvlCMdxn+ZEIpGvcXAymYDFYvnUvY8lCML2HSyXy+T6+nqp3MvLy+06OJvN4Pj4GHXr4OAA3X99fV3LwbUAHx4eUAir1Qocx6FnoVBoe4AulwuFyGQyMJ1O4ejoaO5Mq9VCr9fbPODT0xMKt7e3B29vbwAAkE6n0ZxUKrV5wLOzM1Q8Go3+zen1eqDRaOZyTCYTjEajzQF2Oh1QqVQoYLPZ/C83GAyiefl8fnOALMuioh6PZy63Xq+juQ6HA2azmfyAg8EAdDodKsrzPFpzenqK5t/f38sPeHNzg4rZ7XaqI4VCAa1xuVzyAo7HY2AYBhW7u7uj1o1GIzAajWhdo9GQDzCfz6MiBoMB3t/fP629uLhAa8/Pz+UBFEURHA4HKhKPxxcKtNtttHZnZwe63a50wGq1Su1SOp3OUi54vV60PpFILKz9vaiZYFkW3ddoNMTj8SzVkNTrdXTf5/MRhmGIUqlcr5uh3WVyrkwms34/eHV1tfGhKBAIEFEUV3eQ9nJvYnEct7qD6XR6a6NlNBpdzcF+vw+7u7tbc5AQAo+Pj8s7mM1miSAIWx3Qqe879vdkNpvRp2RZFqRGIBCguthqtRZf1LlcTtLNvyien5+pgP82vSigKIpgs9lkHXqwcLvdqIZOp4PBYEAHrFQqaKFKpULtXzd4nqe6eHt7Swd0Op2SOo9V5uqTkxNUy2KxwGQymQes1WrUp3p5eQG5g9bMEkKgWCzOXzPJZBL9lfv9fqJWq2W/VvR6PWEYBj0Lh8Pk48u04ucb9Q/gF8cfVFprgBwHlgUAAAAASUVORK5CYII=';
    },


    //シェア機能。現状はタイムライン投稿しようとするとtextメッセージが消えてしまう。
    shareGame: function shareGame() {
        var _this = this;

        console.log('シェア');

        if (typeof FBInstant == 'undefined') return;

        FBInstant.shareAsync({
            intent: 'SHARE', //何をするのか
            // image: cc.RawAsset.rawUrl,    //シェアするときの画像
            // image: this.pic.url,
            image: this.getImgBase64(),
            text: 'Great!',
            data: { myReplayData: '...' }
        }).then(function () {
            // continue with the game.
            _this.testText.string = '共有完了';
            console.log('共有完了');
        });
    },


    //アプリへの招待
    sendRequest: function sendRequest() {

        console.log('招待');

        if (typeof FBInstant == 'undefined') return;

        FBInstant.shareAsync({
            intent: 'CUSTOM',
            image: this.getImgBase64(),
            text: '',
            data: { myReplayData: '...' }
        }).then(function () {
            this.testText.string = 'Message was sent successfully';
            console.log('Message was sent successfully');
        }).catch(function () {
            this.testText.string = '';
            console.log('failed!');
        });
    },


    //友達とのチャット画面でゲームを始めた時にだけ呼ばれる。「〇〇さんが今プレイしました。次はあなたの番です」←これ
    playMessage: function playMessage() {
        console.log('プレイ状況通知');

        if (typeof FBInstant == 'undefined') return;

        FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Play',
            // image: this.getImgBase64(),
            image: this.shareUrl,

            //言語別で表示するメッセージを変える。言語コードについては→　　https://so-zou.jp/web-app/tech/data/code/language.htm

            text: {
                default: FBInstant.player.getName() + "just played. It's your turn!",
                localizations: {
                    //派生言語は別に追加する必要あり。
                    en_US: '', //英語(アメリカ)
                    pt_BR: '', //ポルトガル語(ブラジル)
                    id_ID: '', //インドネシア語(インドネシア)
                    fr_CA: '', //フランス語(フランス)
                    vi_VN: '', //ベトナム語(ベトナム)
                    th_TH: '', //タイ語(タイ)
                    tr_TR: '', //トルコ語(トルコ)
                    de_DE: '', //ドイツ語(ドイツ)
                    es_ES: '', //スペイン語(スペイン)
                    ar_AE: '', //アラビア語(アメリカ)

                    ja_JP: FBInstant.player.getName() + 'さんが今プレイしました。あなたの番です！' //日本語(日本)
                }
            },
            template: 'WORD_PLAYED',
            data: { myReplayData: '...' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH'
        }).then(function () {
            console.log('Message was sent successfully');
            this.testText.string = 'Message was sent successfully';
        }).catch(function () {
            console.log('failed!');
            this.testText.string = 'failed';
        });
    },


    //ショートカット作成(Androidのみ対応)
    createShortCut: function createShortCut() {

        console.log('ショートカット作成');
        if (typeof FBInstant == 'undefined') return;

        FBInstant.canCreateShortcutAsync().then(function (canCreateShortcut) {
            if (canCreateShortcut) {
                FBInstant.createShortcutAsync().then(function () {
                    // Shortcut created
                    this.testText.string = 'ショートカット作成';
                }).catch(function () {
                    // Shortcut not created
                    this.testText.string = 'ショートカット作成失敗';
                });
            }
        });
    },


    //友達を選択して一緒に遊ぶ。ゲームを終了しないで処理が行える。
    PlayWithFriends: function PlayWithFriends() {

        console.log('一緒にプレイ');

        if (typeof FBInstant == 'undefined') return;

        FBInstant.context.chooseAsync().then(function (e) {

            this.testText.string = "FBInstant.context.chooseAsync complete";
            console.log("FBInstant.context.chooseAsync complete");
            console.log(e);
        });
    },


    //Botサイト登録。
    onBuyBot: function onBuyBot() {
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
    getImgBase64: function getImgBase64() {
        var target = cc.find('Canvas');
        var width = cc.winSize.width,
            height = cc.winSize.height;
        // let width = 720, height = 375;
        var renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        var canvas = document.createElement('canvas'); //HTML要素生成。
        var ctx = canvas.getContext('2d');
        canvas.width = width; //
        canvas.height = height; //縦横幅設定
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            var texture = renderTexture.getSprite().getTexture();
            var image = texture.getHtmlElementObj();
            ctx.drawImage(image, width / 2, height / 2);
            console.log('renderType:canvas');
        } else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            var _texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture, 0);
            var data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            var rowBytes = width * 4;
            for (var row = 0; row < height; row++) {
                var srow = height - 1 - row;
                var data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                var imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
            console.log('renderType:WebGL');
        }
        return canvas.toDataURL('image/png');
    },
    showSC: function showSC() {
        console.log(this.getImgBase64());
    }

    // update (dt) {},

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=FbInstantGames.js.map
        