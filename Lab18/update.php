<?php
include "db.php";

$message = "";

if (isset($_POST['update'])) {
    $query = "UPDATE students SET
    sub1='{$_POST['sub1']}',
    sub2='{$_POST['sub2']}',
    sub3='{$_POST['sub3']}',
    sub4='{$_POST['sub4']}'
    WHERE rollno='{$_POST['rollno']}'";

    $message = mysqli_query($conn, $query)
        ? "Updated successfully!"
        : "Error";
}
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Update Record</h2>

<?php if ($message) echo "<div class='message'>$message</div>"; ?>

<form method="POST">
<input type="number" name="rollno" placeholder="Roll No" required>
<input type="number" name="sub1" placeholder="Sub1" required>
<input type="number" name="sub2" placeholder="Sub2" required>
<input type="number" name="sub3" placeholder="Sub3" required>
<input type="number" name="sub4" placeholder="Sub4" required>

<input type="submit" name="update" value="Update">
</form>

<form action="home.php"><button>Back</button></form>

</body>
</html>