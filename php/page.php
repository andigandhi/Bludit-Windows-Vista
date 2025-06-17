<!-- Opening a window with the selected article. TODO: set the size of the article -->
<script>
fillWindow(["<?php echo $page->title(); ?>", "<?php echo $page->permalink(); ?>?loadedFromIndex", "<?php echo $page->coverImage(); ?>"], 800, 1000);
</script>
