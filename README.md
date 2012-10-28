jqMini.js
======================
スマートフォン向け画面遷移フレームワーク。  
シンプルに画面遷移の機能だけを実装することができます。  
jQueryMobileの画面遷移機能だけ使いたいなぁという人のためのフレームワークです。

デモ
------
http://dev.creatorish.com/demo/jqmini1.1/

使い方
------

### HTMLマークアップ ###

    <div id="jqmini" class="jqMini">
        <div id="main" class="current page">
            <!--初期ページの内容-->
        </div>
        <div id="page2" class="page">
            <!--ページ2の内容-->
        </div>
        <div id="page3" class="page">
            <!--ページ3の内容-->
        </div>
    </div>

currentクラスを付けたシーンが初期シーンになります

### CSS ###

    <link rel="stylesheet" href="jqMini.css" />

### JavaScript ###

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="jqMini.js"></script>
    <script>
        $("#jqmini").jqMini();
    </script>

### ページ遷移リンク ###

    <div id="main" class="current page">
        <a href="#page2" data-transition="slideleft">次へ</a>
    </div>

hrefに遷移先のIDを、data-transitionにアニメーション名を記述します。

### ページ遷移リンク（戻る） ###

    <div id="page2" class="page">
        <a href="#main" data-transition="slideleft" data-reverse="true">戻る</a>
    </div>
    
data-reverse=”true”を追加するだけで、アニメーションが逆向きになります。  
またscrollCheckがtrueのときはスクロール位置を復元します。

### 外部リンク ###

    <div id="page3" class="page">
        <a href="creatorish.com" rel="external">外部リンク</a>
    </div>

rel=”external”をつけると外部リンクになります。（externalはオプションで変更できます）

### 画面遷移のキャンセル ###

    $("#page").bind(jqMiniEvent.changePage,function() {
        return false;
    });

アニメーションの種類
------

+    fade: フェードで切り替えます
+    popup: ポップアップするように切り替えます
+    popdown: ポップアップが閉じるように切り替えます
+    flipleft: カードをひっくり返すように切り替えます [要CSS3D]
+    flipright: カードをひっくり返すように切り替えます（逆回転） [要CSS3D]
+    flipup: 縦にカードをひっくり返すように切り替えます [要CSS3D]
+    flipdown: 縦にカードをひっくり返すように切り替えます（逆回転） [要CSS3D]
+    turnleft: 左を基準に回転するように切り替えます [要CSS3D]
+    turnright: 左を基準に回転するように切り替えます（逆回転） [要CSS3D]
+    flowleft: iPhoneのSafariのように切り替えます
+    flowright: iPhoneのSafariのように切り替えます（逆向き）
+    slidefadeleft: 左へスライドしながらフェードして切り替えます
+    slidefaderight: 右へスライドしながらフェードして切り替えます
+    slidefadeup: 上へスライドしながらフェードして切り替えます
+    slidefadedown: 下へスライドしながらフェードして切り替えます
+    slideleft: 左へスライドして切り替えます
+    slideright: 右へスライドして切り替えます
+    slideup: 上へスライドして切り替えます
+    slidedown: 下へスライドして切り替えます
+    none: アニメーションせず即切り替えます
+    coverleft: 右から左にかぶさるように切り替えます
+    coverright: 左から右にかぶさるように切り替えます
+    coverup: 下からから上にかぶさるように切り替えます
+    coverdown: 上から下にかぶさるように切り替えます
+    shuffleleft: 左にカードをきるように切り替えます
+    shuffleright: 右にカードをきるように切り替えます
+    shuffleup: 上にカードをきるように切り替えます
+    shuffledown: 下にカードをきるように切り替えます
+    shrink: 一旦縮んで広がるように切り替えます
+    rollleft: 左に回転しながら切り替えます [要CSS3D]
+    rollright: 右に回転しながら切り替えます [要CSS3D]

オプション
------

    $("#jqmini").jqMini({
        transition: "fade",
        scrollCheck: true,
        scrollTime: 150,
        external: "external",
        hash: true
    });

+    transition: "fade" : data-transitionが記述されていないときの 初期アニメーション名です。
+    scrollCheck: true : シーン切り替え時にスクロール位置を保存するかどうかです。data-reverse="true"のときにスクロール位置を復元します。
+    scrollTime: 150 : スクロール復元時のアニメーション時間（ミリ秒）
+    external: "external" : rel属性にこの値がついているものを外部リンクとして扱います
+    hash: true : URLハッシュによる画面遷移を行うかどうかです。

イベント
------

jqMini.jsでは画面遷移時にイベントを実行させることができます。

    //画面遷移毎に実行する場合
    $("#jqMini").bind(jqMiniEvent.changeStartまたはjqMiniEvent.changeStart,function(from,to) {
        //実行する内容
    });
    //指定シーンに遷移時に毎回実行する場合
    $("#シーン名").bind(イベント名,function(fromまたはto) {
        //実行する内容
    });
    //指定シーンに初めて遷移してきたときのみ実行する場合
    $("#シーン名").one(イベント名,function(fromまたはto) {
        //実行する内容
    });

+    jqMiniEvent.changeStart: from(遷移前の要素),to(遷移後の要素) : 画面遷移が実行される直前に発生します。
+    jqMiniEvent.changeEnd: from(遷移前の要素),to(遷移後の要素) : 画面遷移が完了した直後に発生します。
+    jqMiniEvent.show: from(遷移前の要素) : 指定シーンの表示が完了した直後に発生します。
+    jqMiniEvent.hide: to(遷移後の要素) : 指定シーンが非表示になった直後に発生します。
+    jqMiniEvent.preshow: from(遷移前の要素) : 指定シーンが表示になる前に発生します。
+    jqMiniEvent.prehide: to(遷移後の要素) : 指定シーンが非表示になる前に発生します。

画面遷移イベント時に遷移をキャンセルすることができます。  
changePage,preShow,preHideのいずれかの場合でreturn false;することでキャンセルすることができます。

グローバル関数
------

jqMiniオブジェクトには1つだけ関数があります。

    var jqmini = $("#jqmini").jqMini();
    jqmini.goTo("#scene01",{
        reverse: true,
        transition: "slideleft"
    });

指定シーンに遷移することができます。上のソースではscene01にスライドしながら遷移します。

ライセンス
--------
[MIT]: http://www.opensource.org/licenses/mit-license.php
Copyright &copy; 2012 creatorish.com
Distributed under the [MIT License][mit].

作者
--------
creatorish yuu  
Weblog: <http://creatorish.com>  
Facebook: <http://facebook.com/creatorish>  
Twitter: <http://twitter.jp/creatorish>