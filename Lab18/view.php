<?php
include "db.php";
$result = mysqli_query($conn, "SELECT * FROM students");
?>
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Student Table</h2>

<table class="data-table">
<tr>
<th>ID</th><th>Roll</th><th>Name</th>
<th>S1</th><th>S2</th><th>S3</th><th>S4</th>
</tr>

<?php
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>
    <td>{$row['id']}</td>
    <td>{$row['rollno']}</td>
    <td>{$row['name']}</td>
    <td>{$row['sub1']}</td>
    <td>{$row['sub2']}</td>
    <td>{$row['sub3']}</td>
    <td>{$row['sub4']}</td>
    </tr>";
}
?>
</table>

<form action="home.php"><button>Back</button></form>

</body>
</html>
