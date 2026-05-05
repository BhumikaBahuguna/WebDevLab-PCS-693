<!DOCTYPE html>
<html>
<head>
    <title>Simple Calculator</title>
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
            background-color: #7c3aed;
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }
        .operation-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 8px;
        }
        .op-btn {
            padding: 10px 0;
            font-size: 18px;
            font-weight: bold;
        }
        .result {
            margin-top: 20px;
            background-color: #f5f3ff;
            border: 1px solid #c4b5fd;
            border-radius: 6px;
            padding: 14px;
            color: #4c1d95;
            font-weight: bold;
        }
        .error {
            color: #b91c1c;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Simple Calculator</h1>

        <form method="post">
            <div class="form-group">
                <label>First Number</label>
                <input type="number" step="any" name="num1" required>
            </div>
            <div class="form-group">
                <label>Second Number</label>
                <input type="number" step="any" name="num2" required>
            </div>
            <div class="form-group">
                <label>Operation</label>
                <div class="operation-buttons">
                    <button type="submit" class="op-btn" name="operation" value="add">+</button>
                    <button type="submit" class="op-btn" name="operation" value="sub">-</button>
                    <button type="submit" class="op-btn" name="operation" value="mul">*</button>
                    <button type="submit" class="op-btn" name="operation" value="div">/</button>
                </div>
            </div>
        </form>

        <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $num1 = (float)$_POST["num1"];
                $num2 = (float)$_POST["num2"];
                $operation = $_POST["operation"];

                if ($operation == "add") {
                    $resultText = "$num1 + $num2 = " . ($num1 + $num2);
                } elseif ($operation == "sub") {
                    $resultText = "$num1 - $num2 = " . ($num1 - $num2);
                } elseif ($operation == "mul") {
                    $resultText = "$num1 * $num2 = " . ($num1 * $num2);
                } elseif ($operation == "div") {
                    if ($num2 == 0) {
                        $resultText = "<span class='error'>Division by zero is not allowed.</span>";
                    } else {
                        $resultText = "$num1 ÷ $num2 = " . ($num1 / $num2);
                    }
                }

                echo "<div class='result'>$resultText</div>";
            }
        ?>
    </div>
</body>
</html>