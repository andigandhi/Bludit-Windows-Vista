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
          $page = new Page($value);

          if (($page->type() == 'published') ||
            ($page->type() == 'sticky') ||
            ($page->type() == 'static')
          ) {
              $title = $page->title();
              $image = $page->coverImage();
              echo '<p>';
              echo '<a href="'.$page->permaLink().'?loadedFromIndex">';
              // echo '<img alt="Icon for menu item '.$title.'" src="' .$image. '" class="menuIcon">';
              echo '<h2>'.$title.'</h2>';
              echo '</a>';
              echo $page->description().'</p><hr>';
          }
        } catch (Exception $e) {
          // continue
        }
    }
?>
</body>
</html>
