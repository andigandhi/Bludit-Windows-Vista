<!doctype html>
<html>
<head>
	<link rel="stylesheet" href="https://unpkg.com/7.css" />
	<style>
	body {
	font-size: 130%;
	font-family: Georgia, 'Times New Roman', Times, serif;
	}
	h1 {
	font-size: 2rem;
	}
	h2 {
	font-size: 1.6rem;
	}
	h3,h4,h5 {
	font-size: 1.4rem;
	}
	</style>
	<meta charset="utf-8">
	<title>.</title>
</head>
<body>
    Categories are currently not supported.
    Here, category <?php
    global $currentCategory;
    echo $currentCategory;
    ?> should be displayed.
    <?php //echo $categories;


    $list = $categories->getList($currentCategory, 1, -1);
    echo $list;
    ?>
</body>
</html>
