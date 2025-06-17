<span id="nav-clock">00:00</span>
<script>
function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  h = timeAddZeroes(h);
  m = timeAddZeroes(m);
  document.getElementById('nav-clock').innerHTML =  h + ":" + m;
  setTimeout(startTime, 10000);
}

function timeAddZeroes(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

startTime();
</script>

<!-- Social Networks -->
<?php foreach (Theme::socialNetworks() as $key => $label): ?>
	<a class="nav-link" href="<?php echo $site->{$key}(); ?>" target="_blank">
		<img class="d-none d-sm-block nav-svg-icon" src="<?php echo DOMAIN_THEME .
    'img/' .
    $key .
    '.svg'; ?>" alt="<?php echo $label; ?>" />
	</a>
<?php endforeach; ?>
