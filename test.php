<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  // print_r($data);
  // echo '成員為:'.$data['member'];
  echo json_encode($data);
}
?>
