<?php
$filename = "attendance.txt";

// Add record
if (isset($_POST['submit'])) {
    $data = $_POST['roll']." - ".$_POST['name']." - ".$_POST['status']."\n";
    file_put_contents($filename, $data, FILE_APPEND);
    $msg = "Record added successfully";
}

// Ensure file exists
if (!file_exists($filename)) file_put_contents($filename, "");

$lines = file($filename);
$total = $present = $absent = 0;
?>

<!DOCTYPE html>
<html>
<head>
<title>Attendance System</title>
<style>
body{
    font-family: Arial;
    background: linear-gradient(to right,#dbeafe,#dcfce7);
    margin:0;
    padding:20px;
}
.container{
    max-width:700px;
    margin:auto;
    background:#fff;
    padding:20px;
    border-radius:12px;
    box-shadow:0 5px 15px rgba(0,0,0,.2);
}
h2{text-align:center;color:#1e3a8a;}
input,select{
    padding:8px;
    width:100%;
    margin:5px 0 10px;
}
button{
    padding:10px;
    width:100%;
    background:#2563eb;
    color:#fff;
    border:none;
    border-radius:6px;
    cursor:pointer;
}
button:hover{background:#1e40af;}
.success{
    background:#dcfce7;
    color:green;
    padding:10px;
    border-radius:6px;
    margin-bottom:10px;
}
table{width:100%;border-collapse:collapse;}
th{background:#2563eb;color:#fff;}
td,th{
    padding:8px;
    text-align:center;
    border:1px solid #ccc;
}
.summary{margin-top:15px;font-weight:bold;}
</style>
</head>

<body>
<div class="container">

<h2>Attendance System</h2>

<?php if (isset($msg)) echo "<div class='success'>$msg</div>"; ?>

<form method="post">
Roll No:
<input type="text" name="roll" required>

Name:
<input type="text" name="name" required>

Status:
<select name="status">
<option>Present</option>
<option>Absent</option>
</select>

<button type="submit" name="submit">Add Record</button>
</form>

<table>
<tr><th>Roll No</th><th>Name</th><th>Status</th></tr>

<?php
foreach ($lines as $line) {
    $line = trim($line);
    if (!$line) continue;

    list($roll,$name,$status) = explode(" - ", $line);

    echo "<tr><td>$roll</td><td>$name</td><td>$status</td></tr>";

    $total++;
    ($status == "Present") ? $present++ : $absent++;
}
?>

</table>

<div class="summary">
Total Students: <?= $total ?><br>
Present: <?= $present ?><br>
Absent: <?= $absent ?>
</div>

</div>
</body>
</html>