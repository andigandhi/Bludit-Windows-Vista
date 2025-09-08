<?php
// If the sub-page is loaded from the appication itself (displayed in a window iFrame), only the raw content of the sub site is printed
if ($WHERE_AM_I == 'page' && isset($_GET['loadedFromIndex'])) {
  include THEME_DIR_PHP . 'page-iframe.php';
  exit();
} elseif (isset($_GET['archive'])) {
  include THEME_DIR_PHP . 'archive.php';
  exit();
} elseif (isset($_GET['category'])) {
  $currentCategory = htmlspecialchars($_GET['category']);
  include THEME_DIR_PHP . 'category.php';
  exit();
} ?>

<!doctype html>
<html lang="<?php echo Theme::lang(); ?>">
<head>
    <?php include THEME_DIR_PHP . 'head.php'; ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</head>

<body>

    <!-- Background Aurora Lightrays -->
    <div class="light-rays">
        <div class="ray"></div>
        <div class="ray"></div>
        <div class="ray"></div>
    </div>
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <path class="curve" d="M 200 1000 C 400 600, 600 400, 800 0" />
        <path class="curve" d="M 0 900 C 300 500, 700 300, 1000 0" />
    </svg>

	<!-- Creates the main Menu -->
	<div class="window glass" id="mainMenu" style="visibility: hidden;">
	   <div id="mainMenuLeft">
    		<div id="menu_content">
    		</div>
		</div>
	 <div id="mainMenuCategories">
		<div id="mainMenuCategoriesImage" class="window">
		<img id="mainMenuCategoriesImageTag" alt="" width=100% src="<?php echo $site->logo()
    ? DOMAIN_UPLOADS . $site->logo(false)
    : DOMAIN_THEME . '/img/user.bmp'; ?>">
		</div>
		<?php
  global $categories;
  foreach ($categories->db as $key => $fields) {
    echo '<div class="mainMenuCategoriesItem" onClick=\'wm.addWindow({';
    echo 'title: "' . $fields['name'] . '", ';
    echo 'link: "?category=' . $key . '", ';
    echo 'icon: "' . DOMAIN_THEME . 'img/archive.png"';
    echo '})\'>' . $fields['name'] . '</div>';
  }
  ?>
    </div>
	</div>

	<!-- Creates the Taskbar -->
	<div class="window glass" id="taskbar">
		<!-- Button for the main Menu -->
		<button id="taskMenBtn" class="taskElement active" aria-label="Toggle main menu"><img alt="Toggle main menu" src="<?php echo DOMAIN_THEME .
    '/img/start.png'; ?>" height="25px"></button>
		<?php include THEME_DIR_PHP . 'navbar.php'; ?>
	</div>

	<!-- Load Bludit Plugins: Site Body Begin -->
	<?php Theme::plugins('siteBodyBegin'); ?>


	<!-- Loads the different window divs and the menu -->
    <?php echo '<script>var DOMAIN_THEME="' . DOMAIN_THEME . '"</script>'; ?>
    <?php echo Theme::js('js/siteLoader.js'); ?>

    <script>
    const desktopIcons = [
    <?php
    global $pages;

    $list = $pages->getList(
      $pageNumber = 1,
      $numberOfItems = -1,
      $published = false,
      $static = true,
      $sticky = false,
      $draft = false,
      $scheduled = false
    );

    for ($i = count($list) - 1; $i >= 0; $i--) {
      try {
        // Create the page object from the page key
        $pageObj = new Page($list[$i]);
        if (!$pageObj->noindex()) {
          echo '{';
          echo 'title: "' . $pageObj->title() . '", ';
          echo 'link: "' . $pageObj->permalink() . '?loadedFromIndex", ';
          echo 'icon: "' . $pageObj->coverImage() . '"';;
          echo '},';
        }
      } catch (Exception $e) {
        // Continue
      }
    }
    ?>
    ];
    const menuIcons = [
    <?php
    $list = array_merge(
      $pages->getList(
        $pageNumber = 1,
        $numberOfItems = -1,
        $published = false,
        $static = false,
        $sticky = true,
        $draft = false,
        $scheduled = false
      ),
      $pages->getList(
        $pageNumber = 1,
        $numberOfItems = Paginator::$pager['itemsPerPage'],
        $published = true,
        $static = false,
        $sticky = false,
        $draft = false,
        $scheduled = false
      )
    );

    for ($i = 0; $i < count($list); $i++) {
      try {
        // Create the page object from the page key
        $pageObj = new Page($list[$i]);
        if (!$pageObj->noindex()) {
          // if ($pageObj->getValue("type") == "sticky") {
          //     echo 'wm.fillWindow("' .
          //       $pageObj->title() .
          //       '", "' .
          //       $pageObj->permalink() .
          //       '?loadedFromIndex", "' .
          //       $pageObj->coverImage() .
          //       '");';
          // }
          echo '{';
          echo 'title: "' . $pageObj->title() . '", ';
          echo 'link: "' . $pageObj->permalink() . '?loadedFromIndex", ';
          echo 'icon: "' . $pageObj->coverImage() . '", ';
          echo 'type: "' . $pageObj->getValue("type") . '"';
          echo '},';
        }
      } catch (Exception $e) {
        // Continue
      }
    }
    ?>
    <?php if (Paginator::numberOfPages() > 1) {
        echo '{';
        echo 'title: "Archive", ';
        echo 'link: "?archive", ';
        echo 'icon: "' . DOMAIN_THEME . 'img/archive.png"';;
        echo '},';
    } ?>
    ];
    </script>

	<!-- Load the content if a specific page is opened -->
    <?php if ($WHERE_AM_I == 'page') {
      include THEME_DIR_PHP . 'page.php';
    } ?>

	<!-- Load Bludit Plugins: Site Body End -->
	<?php Theme::plugins('siteBodyEnd'); ?>

</body>
</html>
