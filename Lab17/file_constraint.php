<!DOCTYPE html>
<html>
<head>
<title>File Upload</title>
<style>
body{
    font-family: Arial;
    background: linear-gradient(to right,#dbeafe,#dcfce7);
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
}
.container{
    background:#fff;
    padding:25px;
    border-radius:12px;
    box-shadow:0 5px 15px rgba(0,0,0,0.2);
    text-align:center;
    width:330px;
}
h2{color:#1e3a8a;margin-bottom:15px;}
input[type="file"]{margin:15px 0;width:100%;}
input[type="submit"]{
    padding:10px;
    width:100%;
    background:#2563eb;
    color:#fff;
    border:none;
    border-radius:6px;
    cursor:pointer;
}
input[type="submit"]:hover{background:#1e40af;}
.message{margin-top:15px;padding:10px;border-radius:6px;}
.success{background:#dcfce7;color:green;}
.error{background:#fee2e2;color:red;}
</style>
</head>
<body>

<div class="container">
<h2>Upload File</h2>

<form method="post" enctype="multipart/form-data">
    <input type="file" name="file" required>
    <input type="submit" value="Upload">
</form>

<?php
if (isset($_FILES['file'])) {

    if ($_FILES['file']['error'] != 0) {
        echo "<div class='message error'>Upload error</div>";
    } else {
        $name = $_FILES['file']['name'];
        $tmp = $_FILES['file']['tmp_name'];
        $size = $_FILES['file']['size'];
        $type = strtolower(pathinfo($name, PATHINFO_EXTENSION));

        if (!in_array($type, ["jpg","png","pdf"])) {
            echo "<div class='message error'>Invalid file type</div>";
        } elseif ($size > 2000000) {
            echo "<div class='message error'>File too large</div>";
        } else {
            $folder = "myfiles/";

            if (!is_dir($folder)) mkdir($folder);

            $newName = uniqid() . "." . $type;

            if (move_uploaded_file($tmp, $folder.$newName)) {
                echo "<div class='message success'>
                File uploaded as: $newName<br>
                Original: $name
                </div>";
            } else {
                echo "<div class='message error'>Upload failed</div>";
            }
        }
    }
}
?>

</div>
</body>
</html>