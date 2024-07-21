<script>
  import '@fontsource/montserrat';
  export let type = 'button';
  export let label = 'Button';
  export let disabled = false;
  export let style = '';
  export let href = '';
</script>

<button type={type} {disabled} on:click style={style} href={href}>{label}</button>
