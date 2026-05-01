<!DOCTYPE html>
<html>
<head>
    <title>Swap Two Numbers</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f6fb;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1f2a44;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 14px;
        }
        label {
            display: block;
            margin-bottom: 6px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #d9deea;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 16px;
        }
        button {
            background-color: #16a34a;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 8px;
        }
        .result {
            margin-top: 20px;
            background-color: #ecfdf5;
            border: 1px solid #86efac;
            border-radius: 6px;
            padding: 14px;
            color: #14532d;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Swap Two Numbers</h1>

        <form method="post">
            <div class="form-group">
                <label>First Number</label>
                <input type="number" step="any" name="num1" required>
            </div>
            <div class="form-group">
                <label>Second Number</label>
                <input type="number" step="any" name="num2" required>
            </div>
            <button type="submit">Swap Numbers</button>
        </form>

        <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $num1 = (float)$_POST["num1"];
                $num2 = (float)$_POST["num2"];

                echo "<div class='result'>";
                echo "Before Swap: First = $num1, Second = $num2<br>";

                $temp = $num1;
                $num1 = $num2;
                $num2 = $temp;

                echo "After Swap: First = $num1, Second = $num2";
                echo "</div>";
            }
        ?>
    </div>
</body>
</html>