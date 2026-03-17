<!DOCTYPE html>
<html>
<head>
    <title>Registration Details</title>
    <style>
        body {
            font-family: "Segoe UI", Arial, sans-serif;
            background: linear-gradient(120deg, #e0eafc, #cfdef3);
            padding: 40px;
        }

        .card {
            width: 450px;
            margin: auto;
            background: #85ebea;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }

        .row {
            margin: 10px 0;
            font-size: 16px;
        }

        .row span {
            font-weight: bold;
            color: #444;
        }
    </style>
</head>
<body>

<div class="card">
    <h1>User Details</h1>

    <?php
    echo "<div class='row'><span>Name:</span> " . $_POST['name'] . "</div>";
    echo "<div class='row'><span>Phone:</span> " . $_POST['phone'] . "</div>";
    echo "<div class='row'><span>Address:</span> " . $_POST['address'] . "</div>";
    echo "<div class='row'><span>Gender:</span> " . $_POST['gender'] . "</div>";
    echo "<div class='row'><span>City:</span> " . $_POST['city'] . "</div>";
    echo "<div class='row'><span>Email:</span> " . $_POST['email'] . "</div>";
    ?>
</div>

</body>
</html>
