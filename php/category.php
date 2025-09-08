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
	.menuButton {
	cursor: pointer;
	}
	.iconImage {
	width: 1.6rem;
	margin-right: 0.5rem;
	float:left;
	}
	</style>
	<meta charset="utf-8">
	<title>.</title>
</head>
<body>
    <h1>Category: <?php
    global $categories;
    global $currentCategory;
    echo $categories->getName($currentCategory);
    ?></h1>
    <?php
    global $categories;
    global $currentCategory;

    foreach ($categories->getList($currentCategory, 1, -1) as $key => $value) {
        try {
            $pageObj = new Page($value);
            if (($pageObj->type() == 'published') ||
                ($pageObj->type() == 'sticky') ||
                ($pageObj->type() == 'static')
            ) {
                $title = htmlspecialchars($pageObj->title(), ENT_QUOTES);
                $icon = $pageObj->coverImage() != '' ? $pageObj->coverImage() : '';
                $url = $pageObj->permalink() . '?loadedFromIndex';

                echo '<div class="menuButton" onclick="window.parent.wm.addWindow({title: \'' . $title . '\', icon: \'' . $icon . '\', link: \'' . $url . '\'})">';

                if ($icon != '') {
                    echo '<img class="iconImage" alt="Icon for menu item ' . $title . '" src="' . $icon . '">';
                }

                echo '<h2><b>' . $title . '</b></h2></div>';
                echo '<div style="margin-left:10px;">' . $pageObj->description() . '</div><hr>';
            }
        } catch (Exception $e) {
            // continue
        }
    }
    ?>
</body>
</html>
