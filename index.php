<?php
if ($WHERE_AM_I == 'page' && isset($_GET['loadedFromIndex'])) {
  include THEME_DIR_PHP . 'page.php';
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
		<button id="taskMenBtn" class="taskElement active" style="width: 30px; text-align: center" onClick="toggleMenu()"></button>
	</div>

	<!-- Load Bludit Plugins: Site Body Begin -->
	<?php Theme::plugins('siteBodyBegin'); ?>

	<!-- Content -->
    			<?php if ($WHERE_AM_I == 'page') { ?>
                <div class="window" style="width: 1200px; height: 800px; left: 5%; top: 8%; z-index: 4;">
                <div class="title-bar">
                    <div class="title-bar-text"><img alt="" src="<?php if ($page->coverImage()):
                      echo $page->coverImage();
                    endif; ?>" style="height: 11px; margin-right: 5px; float:left;">Über</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onclick="toggleWindow(217750)"></button>
                            <button id="btn-resize-217750" aria-label="Maximize" onclick="maximizeWindow(217750)"></button>
                            <button aria-label="Close" onclick="removeWindow(217750)"></button>
                        </div>
                    </div>
                    <div class="window-body" style="position: relative; height: 480px; overflow: hidden;">
                <?php
                include THEME_DIR_PHP . 'page.php';
                echo '</div></div>';
                } else {include THEME_DIR_PHP . 'home.php';} ?>

	<!-- Load Bludit Plugins: Site Body End -->
	<?php Theme::plugins('siteBodyEnd'); ?>

</body>
</html>
