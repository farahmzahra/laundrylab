<script>
  import '@fontsource/montserrat';
  export let label = '';
  export let href = '';
  export let disabled = false;
  export let style = '';
  export let onClick = () => {};
</script>

<!-- <nav class="bottom-navbar">
	<div class="bottom-button">
		<a href={href}><button {disabled} style={style} on:click>{label}</button></a>
	</div>
</nav> -->
<nav class="bottom-navbar">
  <div class="bottom-button">
    <button {disabled} style={style} on:click={onClick}>{label}</button>
  </div>
</nav>