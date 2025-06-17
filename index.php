<?php
// If the sub-page is loaded from the appication itself (displayed in a window iFrame), only the raw content of the sub site is printed
if ($WHERE_AM_I == 'page' && isset($_GET['loadedFromIndex'])) {
  echo $page->content();
  exit();
} ?>

<!doctype html>
<html lang="<?php echo Theme::lang(); ?>">
<head>
    <?php include THEME_DIR_PHP . 'head.php'; ?>
</head>

<body onResize="positionTaskbar()" onLoad="positionTaskbar()">

	<!-- Creates the main Menu -->
	<div class="window" id="mainMenu">
		<div id="mainMenuSideBar"></div>
		<div id="menu_content">
		</div>
	</div>

	<!-- Creates the Taskbar -->
	<div class="window" id="taskbar">
		<!-- Button for the main Menu -->
		<button id="taskMenBtn" class="taskElement active" style="width: 30px; text-align: center" onClick="toggleMenu()"><img alt="" src="<?php echo DOMAIN_THEME .
    '/img/start.png'; ?>" height="25px"></button>
		<?php include THEME_DIR_PHP . 'navbar.php'; ?>
	</div>

	<!-- Load Bludit Plugins: Site Body Begin -->
	<?php Theme::plugins('siteBodyBegin'); ?>


	<!-- Loads the different window divs and the menu -->
    <?php echo '<script>var DOMAIN_THEME="' . DOMAIN_THEME . '"</script>'; ?>
    <?php echo Theme::js('js/siteLoader.js'); ?>

    <script>
    // TODO: Change order of items
    <?php
    global $pages;

    foreach ([true, false] as $desktop_icon) {
      $list = $pages->getList(
        $pageNumber = 1,
        $numberOfItems = -1,
        $published = !$desktop_icon,
        $static = $desktop_icon,
        $sticky = !$desktop_icon,
        $draft = false,
        $scheduled = false
      );
      foreach ($list as $pageKey) {
        try {
          // Create the page object from the page key
          $pageObj = new Page($pageKey);
          if (!$pageObj->noindex()) {
            if ($desktop_icon) {
              echo 'add_desktop_item("' .
                $pageObj->title() .
                '", "' .
                $pageObj->permalink() .
                '?loadedFromIndex", "' .
                $pageObj->coverImage() .
                '");';
            } else {
              echo 'add_menu_item("' .
                $pageObj->title() .
                '", "' .
                $pageObj->permalink() .
                '?loadedFromIndex", "' .
                $pageObj->coverImage() .
                '");';
            }
          }
        } catch (Exception $e) {
          // Continue
        }
      }
    }
    ?>
    </script>

	<!-- Load the content if a specific page is opened -->
    <?php if ($WHERE_AM_I == 'page') {
      include THEME_DIR_PHP . 'page.php';
    } ?>

	<!-- Load Bludit Plugins: Site Body End -->
	<?php Theme::plugins('siteBodyEnd'); ?>

</body>
</html>
