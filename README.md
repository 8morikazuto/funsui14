funsui14
========

九州大学噴水企画'14

Webの勉強のために自由に活用してください。  
ただしソースファイルをコピペする場合は以下の記述を入れてください。  
`Copyright 九州大学噴水企画'14 | MIT Lisence | https://github.com/petamoriken/funsui14`  
なお、動画、画像の転用は禁止です。

HTMLテンプレートエンジンとして[EJS]、CSSプリプロセッサとして[Stylus]、そしてタスクランナーとして[Gulp]を使用しています。  
もしこれらを学びたいのであれば、[こちらのスライド](http://www.slideshare.net/yutoyoshinari/ss-37936903 "フロントエンドの効率化")を見ることをおすすめします。

ソースファイルはすべて develop フォルダの中に入っています。  
もし、これらのファイルをコンパイルしたいと思ったら、ターミナル上でダウンロードしたこのフォルダのディレクトリに移動し、以下のコマンドを実行してください。　　

    npm install  
    gulp release  

もし実行できないときは[node.js]、[Gulp]をインストールしてください。

[EJS]: http://www.embeddedjs.com/ "EJS - JavaScript Templates"
[Stylus]: http://learnboost.github.io/stylus/ "Stylus — expressive, robust, feature-rich CSS preprocessor"
[Gulp]: http://gulpjs.com/ "gulp.js - the streaming build system"
[node.js]: http://nodejs.org/ "node.js"