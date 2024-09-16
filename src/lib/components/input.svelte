<script>
  import arrow from '$lib/images/down-arrow.png';
  import hidden_symbol from '$lib/images/hidden.png';
  import eye_symbol from '$lib/images/eye.png';
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
  export let isPassword = '';
</script>

<div class="input-container">
  {#if type === 'text'}
    <input type="text" bind:value={value} placeholder={placeholder} style={style} id={id} disabled={disabled} hidden={hidden} />
  {:else if type === 'password'}
    <div class="position-password">
      {#if type }
        
      {/if}
      {#if isPassword == "true"}
          <img src="{eye_symbol}" class="icon-eye" alt="Eye" on:click={()=> {
            isPassword = "false"
          }}>
          <input type="password" bind:value={value} placeholder={placeholder} style={style} />
      {:else}
          <img src="{hidden_symbol}" class="icon-eye" alt="Eye" on:click={()=> {
            isPassword = "true"
          }}>
          <input type="text" bind:value={value} placeholder={placeholder} style={style} />
      {/if}
    </div>
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