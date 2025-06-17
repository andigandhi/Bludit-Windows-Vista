<?php if (empty($content)): ?>
  <div class="mt-4">
    <?php $language->p('No pages found'); ?>
  </div>
<?php endif; ?>

<!-- Normal pages (Start menu Icons) -->
<?php foreach ($content as $page): ?>
  <script>
    add_menu_item("<?php echo $page->title(); ?>", "<?php echo $page->permalink(); ?>?loadedFromIndex", "<?php if (
  $page->coverImage()
):
  echo $page->coverImage();
endif; ?>");
  </script>
<?php endforeach; ?>

<!-- Static pages (Desktop Icons) -->
<?php foreach ($staticContent as $staticPage): ?>
<script>
  add_desktop_item("<?php echo $staticPage->title(); ?>", "<?php echo $staticPage->permalink(); ?>?loadedFromIndex", "<?php if (
  $staticPage->coverImage()
):
  echo $staticPage->coverImage();
endif; ?>");
</script>
<?php endforeach; ?>

<!-- Pagination TODO: More elegant way without reloading the whole site -->
<?php if (Paginator::numberOfPages() > 1): ?>
  <nav class="paginator">
    <ul class="pagination flex-wrap">

      <!-- Previous button -->
      <?php if (Paginator::showPrev()): ?>
      <script>
        add_menu_link("<?php echo $L->get(
          'Previous'
        ); ?>", "<?php echo Paginator::previousPageUrl(); ?>", "");
      </script>
      <?php endif; ?>

      <!-- Next button -->
      <?php if (Paginator::showNext()): ?>
      <script>
        add_menu_link("<?php echo $L->get(
          'Next'
        ); ?>", "<?php echo Paginator::nextPageUrl(); ?>", "");
      </script>
      <?php endif; ?>

    </ul>
  </nav>
<?php endif; ?>
