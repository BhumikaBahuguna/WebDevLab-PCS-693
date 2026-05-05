<!DOCTYPE html>
<html>
<head>
    <title>Maximum of Three Numbers</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6fb;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1f2a44;
        }
        .form-group {
            margin: 15px 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input {
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 100%;
        }
        button {
            background-color: #16a34a;
            color: white;
            padding: 12px;
            border: none;
            border-radius: 4px;
            width: 100%;
        }
        .result {
            background-color: #f0f0f0;
            padding: 15px;
            margin-top: 20px;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
<div class="container">

<h1>Find Maximum of Three Numbers</h1>

<form method="post">
    <div class="form-group">
        <label>Enter First Number:</label>
        <input type="number" name="num1" required>
    </div>
    <div class="form-group">
        <label>Enter Second Number:</label>
        <input type="number" name="num2" required>
    </div>
    <div class="form-group">
        <label>Enter Third Number:</label>
        <input type="number" name="num3" required>
    </div>
    <button type="submit">Find Maximum</button>
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $num1 = $_POST["num1"];
    $num2 = $_POST["num2"];
    $num3 = $_POST["num3"];

    // Step 1: Assume first number is max
    $max = $num1;

    // Step 2: Compare with second number
    if ($num2 > $max) {
        $max = $num2;
    }

    // Step 3: Compare with third number
    if ($num3 > $max) {
        $max = $num3;
    }

    echo "<div class='result'>
    Maximum number among $num1, $num2 and $num3 is: <strong>$max</strong>
    </div>";
}
?>

</div>
</body>
</html>