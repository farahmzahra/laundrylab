<script>
  import { createEventDispatcher } from 'svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';

  export let operasionalForm = {
    days: [
      { name: 'Senin', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Selasa', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Rabu', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Kamis', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Jumat', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Sabtu', jamBuka: '', jamTutup: '', tutup: false },
      { name: 'Minggu', jamBuka: '', jamTutup: '', tutup: false }
    ]
  };

  const dispatch = createEventDispatcher();

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    dispatch('save', { ...operasionalForm });
  }

  function handleKeyDown(event) {
    if (event.target.classList.contains('popup-overlay') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      closePopup();
    }
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}" on:keydown="{handleKeyDown}">
  <div class="popup" on:click|stopPropagation>
    <h2>Tambah Jam Operasional</h2>
    {#each operasionalForm.days as day, index}
    <div class="centered-items">
      <div class="card-row-spaceless">
        <div class="text-operational">{day.name}</div>
          <div class="space-style">
              <div>
                <input type="time" class="time-field" bind:value={operasionalForm.days[index].jamBuka} disabled={operasionalForm.days[index].tutup} />
              </div>
          </div>
          <div class="space-style">
              <div>
                <input type="time" class="time-field" bind:value={operasionalForm.days[index].jamTutup} disabled={operasionalForm.days[index].tutup} />
              </div>
          </div>
          <div class="space-style">
                <input type="checkbox" bind:checked={operasionalForm.days[index].tutup} style="width: 10px" />
              <div class="text-operational">Tutup</div>
          </div>
      </div>
    </div>
    {/each}
    <div class="centered-items">
      <button type="button" on:click={closePopup}>Batal</button>
      <button type="button" on:click={saveChanges}>Simpan</button>
    </div>
  </div>
</div>