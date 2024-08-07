<script>
  import arrow from '$lib/images/down-arrow.png';
  export let label = '';
  export let value = '';
  export let type = '';
  export let id = '';
  export let placeholder = '';
  export let style = '';
  export let options = [];
  export let accept = '';
  export let onchange = '';
  export let disabled = '';
  export let hidden = false;
</script>

<div class="input-container">
  {#if type === 'text'}
    <input type="text" bind:value={value} placeholder={placeholder} style={style} id={id} disabled={disabled} hidden={hidden} />
  {:else if type === 'password'}
    <input type="password" bind:value={value} placeholder={placeholder} style={style} />
  {:else if type === 'number'}
    <input type="number" bind:value={value} placeholder={placeholder} style={style} />
  {:else if type === 'time'}
    <input type="time" bind:value={value} placeholder={placeholder} style={style} />
  {:else if type === 'dropdown'}
    <select bind:value={value} class="dropdown-style" style={style}>
      <option value="" disabled selected>{placeholder}</option>
      {#each options as option}
        <option value={option.value} selected={value === option.value}>{option.label}</option>
      {/each}
    </select>
  {:else if type === 'file'}
    <label class="file-label">{label}</label>
    <br><br>
    <input type="file" bind:value={value} placeholder={placeholder} accept={accept} onchange={onchange} style={style} />
  {/if}
</div>


<!--     <select bind:value={value} class="dropdown-style" style={style}>
      <option value="" disabled selected>{placeholder}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
 -->