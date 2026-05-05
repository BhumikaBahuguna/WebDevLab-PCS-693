<!DOCTYPE html>
<html>
<head>
    <title>Min Max Avg Sum</title>
    <style>
        body {
            font-family: Arial;
            background: #f4f6fb;
            text-align: center;
            padding: 30px;
        }
        .container {
            background: white;
            padding: 20px;
            width: 350px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 0px 0px 10px gray;
        }
        input {
            padding: 8px;
            margin: 8px;
            width: 80%;
        }
        button {
            padding: 10px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 5px;
        }
        .result {
            margin-top: 15px;
            background: #e0f2fe;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>

<div class="container">
<h2>Min, Max, Sum, Average</h2>

<form method="post">
    <input type="number" name="n1" placeholder="Enter number 1" required><br>
    <input type="number" name="n2" placeholder="Enter number 2" required><br>
    <input type="number" name="n3" placeholder="Enter number 3" required><br>
    <button type="submit" name="submit">Calculate</button>
</form>

<?php
if (isset($_POST['submit'])) {

    $n1 = $_POST['n1'];
    $n2 = $_POST['n2'];
    $n3 = $_POST['n3'];

    // SUM
    $sum = $n1 + $n2 + $n3;

    // AVERAGE
    $avg = $sum / 3;

    // MIN using if-else
    if ($n1 <= $n2 && $n1 <= $n3) {
        $min = $n1;
    } elseif ($n2 <= $n1 && $n2 <= $n3) {
        $min = $n2;
    } else {
        $min = $n3;
    }

    // MAX using if-else
    if ($n1 >= $n2 && $n1 >= $n3) {
        $max = $n1;
    } elseif ($n2 >= $n1 && $n2 >= $n3) {
        $max = $n2;
    } else {
        $max = $n3;
    }

    echo "<div class='result'>";
    echo "Sum = $sum <br>";
    echo "Average = $avg <br>";
    echo "Minimum = $min <br>";
    echo "Maximum = $max";
    echo "</div>";
}
?>

</div>
</body>
</html>