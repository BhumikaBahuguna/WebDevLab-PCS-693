<!DOCTYPE html>
<html>
<head>
<title>User Registration</title>
<style>
body{
    font-family: Arial;
    background: #f0f9ff;
    text-align: center;
}
form{
    background: white;
    padding: 20px;
    width: 300px;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0px 0px 10px gray;
}
input{
    margin: 8px;
    padding: 8px;
    width: 90%;
}
button{
    padding: 10px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover{
    background: #1e40af;
}
</style>
</head>
<body>
<h2>User Registration Form</h2>
<form method="post">
    <input type="text" name="username" placeholder="Enter Username"><br>
    <input type="password" name="password" placeholder="Enter Password"><br>
    <input type="email" name="email" placeholder="Enter Email"><br>
    <input type="text" name="age" placeholder="Enter Age"><br>
    <button type="submit">Register</button>
</form>
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? "";
    $password = $_POST['password'] ?? "";
    $email = $_POST['email'] ?? "";
    $age = $_POST['age'] ?? "";
    if (empty($username) || empty($password) || empty($email) || empty($age)) {
        echo "<h3 style='color:red;'>All fields are required!</h3>";
    } else {
        if ($age >= 18) {
            echo "<h3>Age before conversion: $age (" . gettype($age) . ")</h3>";
            settype($age, "integer");
            echo "<h3>Age after conversion: $age (" . gettype($age) . ")</h3>";
            echo "<h2 style='color:green;'>Registration Successful!</h2>";
            echo "<p><b>Username:</b> $username</p>";
            echo "<p><b>Password:</b> $password</p>";
            echo "<p><b>Email:</b> $email</p>";
            echo "<p><b>Age:</b> $age</p>";
        } else {
            echo "<h3>Datatypes:</h3>";
            echo "Username: " . gettype($username) . "<br>";
            echo "Password: " . gettype($password) . "<br>";
            echo "Email: " . gettype($email) . "<br>";
            echo "Age: " . gettype($age) . "<br>";
            echo "<h3 style='color:red;'>User must be above 18!</h3>";
        }
        unset($username, $password, $email, $age);
        if (isset($username) || isset($password) || isset($email) || isset($age))
            echo "Details not removed";
        else
            echo "<br><b>Details removed</b>";
    }
}
?>
</body>
</html>