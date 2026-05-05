<?php
include "db.php";
$result = mysqli_query($conn, "SELECT * FROM books");
?>

<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>

<h2>Book Table</h2>

<table class="data-table">
<tr>
<th>ID</th><th>Title</th><th>Author</th><th>Availability</th>
</tr>

<?php
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>
    <td>{$row['id']}</td>
    <td>{$row['title']}</td>
    <td>{$row['author']}</td>
    <td>{$row['availability']}</td>
    </tr>";
}
?>
</table>

<form action="home.php"><button>Back</button></form>

</body>
</html>