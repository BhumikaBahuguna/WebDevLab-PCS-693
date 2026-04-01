<!DOCTYPE html>
<html>
<head>
    <title>Hello</title>
</head>
<body>

<form action="<?php echo $_SERVER['PHP_SELF'];?>" method="POST">
<pre>
user:<input type="text" name="user" value="">
pass:<input type="text" name="pass" value="">
<input type="submit" value="signUp" name="signUp">
<input type="submit" value="signIp" name="signIp">
</pre>
</form>

<?php
require 'connection.php';

if($_SERVER['REQUEST_METHOD']=='POST')
{
    // ✅ SIGN UP
    if(isset($_POST['signUp']))
    {
        $user = $_POST['user'];
        $pass = $_POST['pass'];

        $sql = "INSERT INTO login (user, password) VALUES ('$user', '$pass')";

        if(mysqli_query($con, $sql))
        {
            echo "Sign Up Successful ✅";
        }
        else
        {
            echo "Error: " . mysqli_error($con);
        }
    }

    // ✅ SIGN IN + PRINT DATA
    if(isset($_POST['signIp']))
    {
        $user = $_POST['user'];
        $pass = $_POST['pass'];

        $sql = "SELECT user, password FROM login WHERE user='$user' AND password='$pass'";
        $result = mysqli_query($con, $sql);

        if(mysqli_num_rows($result) > 0)
        {
            echo "Login Successful ✅<br>";

            // 🔥 PRINT retrieved data
            while($row = mysqli_fetch_assoc($result))
            {
                echo "Username: " . $row['user'] . "<br>";
                echo "Password: " . $row['password'] . "<br>";
            }
        }
        else
        {
            echo "Invalid Username or Password ❌";
        }
    }
}

mysqli_close($con);
?>

</body>
</html>