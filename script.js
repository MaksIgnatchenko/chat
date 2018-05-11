var button = document.getElementById('button');
var option = document.getElementById('server');
var url = "server.php";
option.onchange = () => {
    if (option.value == 'Мой сервер') {
        url = "server.php"; 
    } else {
        url = "http://students.a-level.com.ua:10012"; 
    }
    if (setId !== undefined) {
        clearInterval(setId);
    }
    setId = setInterval(readMessage,2000);
}

function jsonPost(url, data) {
    return new Promise((resolve, reject) => {
        let ajax = new XMLHttpRequest();
        ajax.open("POST", url, true);
        // ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        let res = JSON.stringify(data);
        ajax.send(res);

        ajax.onreadystatechange = () => {
            if (ajax.readyState == XMLHttpRequest.DONE && ajax.status == 200) {
                var data = JSON.parse(ajax.responseText);
                resolve(data);
            } else if (ajax.status != 200) {
                reject(new Error("status is not 200"))
                }
        }
    })
}

button.onclick = () => {
    var auth = document.getElementById('author').value;
    var mess = document.getElementById('message').value;
    jsonPost(url, {func: "addMessage", nick: auth, message: mess}).then(data=>{console.log(data)});
    readMessage();
    document.getElementById('message').value = null;
}

function readMessage() {
    jsonPost(url, {func: "getMessages"}).then(data => {
            var chat = document.getElementById('chat');
            chat.innerHTML = "";
            var trHead = document.createElement("tr");
            var trH = chat.appendChild(trHead);
            for (var head in data.data[data.data.length - 1]) {
                if ((head !== "id") && (head !== "timestamp")) {
                    let thEl = document.createElement("th");
                    thEl.innerHTML = head;
                    trH.appendChild(thEl);
                }
            }
            for (var i = (data.data.length - 1); i >= (data.data.length - 20); i--) {
                let trEl = document.createElement("tr");
                let tr = chat.appendChild(trEl);
                for (var cell in data.data[i]) {
                    if ((cell == "id") || (cell == "timestamp")) continue;
                    let tdEl = document.createElement("td");
                    tdEl.innerHTML = data.data[i][cell];
                    tr.appendChild(tdEl);
                }
            }
    });
}
var setId = setInterval(readMessage,2000);



