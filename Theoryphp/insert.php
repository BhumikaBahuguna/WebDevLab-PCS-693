<!DOCTYPE html>

<html>

<head>
  <title>Hello!</title>
</head>

<body>

<?php
 $user ='root';
$pass ='';
$db='geu' ;
//create connection
$con =  mysqli_connect('localhost', $user, $pass,$db) or
    die("Connection failed: " . mysqli_connect_error());

echo "Connected successfully";
$sql = "insert into student values('s_1','shreya') ";

if (mysqli_query($con, $sql)) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($con);
}
mysqli_close($con);
?>

</body>