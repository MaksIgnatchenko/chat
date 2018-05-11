<?php
require_once('connection.php');
$json = json_decode(file_get_contents('php://input'));
$func = $json->func;

if ($func == 'addMessage') {
    addMessage($json);
} else getMessages();

function getMessages(){
    $con = Connection::get_instance();
    $sql = "select * from messages order by id";
    $query = $con->prepare($sql);
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    $array = ['data' => $result, 'nextMessageId' => 1];
    echo json_encode($array);
}


function addMessage($json){
    $mess = $json->message;
    $nick = $json->nick;
    $con = Connection::get_instance();
    $sql = "insert into messages (nick, message) values (?, ?)";
    $query = $con->prepare($sql);
    $query->bindValue(1, $nick, PDO::PARAM_STR);
    $query->bindValue(2, $mess, PDO::PARAM_STR);
    $query->execute();
    echo json_encode('1');
}


