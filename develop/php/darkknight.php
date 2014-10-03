<?php

require_once "HTTP/Request2.php";

$api = "https://www.googleapis.com/youtube/v3/playlistItems";

$request = new HTTP_Request2($api, HTTP_Request2::METHOD_GET);
$reqUri = $request->getUrl();
$reqUri->setQueryVariables(array(
	"part" => "contentDetails",
	"maxResults" => 1,
	"playlistId" => "PL1vSSpchqjDoPpXHgCrk8E6EUTomrvB6P",
	"key" => "AIzaSyBgmnnbRLGpKwqsyRy8ctjcPQWlKjYbfxI"
));
$result = $request->send()->getBody();

$obj = json_decode($result, true);
$id = $obj["items"][0]["contentDetails"]["videoId"];

$retUri = "http://youtu.be/".$id."?list=PL1vSSpchqjDoPpXHgCrk8E6EUTomrvB6P";

echo "<a href=".$retUri.">移動しない場合はこちらをクリックしてください。</a>";
header('Location: '.$retUri, true, 302);
exit();