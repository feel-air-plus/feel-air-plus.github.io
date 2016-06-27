var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var chatDataStore = milkcocoa.dataStore("chat");

$(function() {
    //チャットデータストア内の項目を一覧で取得
    chatDataStore.stream().size(20).sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            renderMessage(data);
        });
    });

    chatDataStore.on("push", function(e) {
        // チャット内容変更のイベントを受け取った際に、チャットメッセージを表示
        renderMessage(e);
    });

    function renderMessage(msg) {
        var last_message = "summary";
        //取得したチャットデータストア内の項目一覧を画面上に表示
        //TODO:テーブルに書き換える
        var message_html = '<p class="post-text">' + msg.value.message + '</p>';
        var user_html    = '<p class="post-user">' + msg.value.userId + '</p>';
        var date_html    = '<p class="post-date">'+msg.value.date+'</p>';
        $("#"+last_message).before('<div id="'+msg.id+'" class="post">'
            + message_html
            + user_html
            + date_html
            +'</div>');
        last_message = msg.id;
    };
});
