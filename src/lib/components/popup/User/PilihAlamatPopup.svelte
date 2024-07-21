<script>
  import { createEventDispatcher } from 'svelte';

  export let userAddresses = [];

  const dispatch = createEventDispatcher();
  let selectedAddress = '';

  function selectAddress() {
    const address = userAddresses.find(addr => addr.alamat === selectedAddress);
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0];

    dispatch('select', { address, currentDate, currentTime });
  }

  function closePopup() {
    dispatch('close');
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}">
  <div class="popup" on:click|stopPropagation>
    <h2>Pilih Alamat Penjemputan</h2>
    <div class="dropdown">
      <select bind:value={selectedAddress} class="dropdown-style">
        <option disabled selected value="">-- Pilih Alamat --</option>
        {#each userAddresses as address}
          <option value={address.alamat}>{address.alamat}</option>
        {/each}
      </select>
    </div>
    <div class="centered-items">
      <button type="button" on:click={selectAddress}>Pilih</button>
      <button type="button" on:click={closePopup}>Batal</button>
    </div>
  </div>
</div>
