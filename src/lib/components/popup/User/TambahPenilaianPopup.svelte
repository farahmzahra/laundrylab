<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let penilaianForm = {
    idPesanan: '',
    idPenilaian: '',
    emailUser: '',
    emailLaundry: '',
    tanggal: '',
    rate: 0,
    ulasan: ''
  };

  const dispatch = createEventDispatcher();

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    if (!penilaianForm.ulasan) {
        alert('Kolom harus terisi!');
        return;
    }

    dispatch('save', { ...penilaianForm });
  }

  function handleKeyDown(event) {
    if (event.target.classList.contains('popup-overlay') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      closePopup();
    }
  }

  function setRating(rating) {
    penilaianForm.rate = rating;
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click={closePopup} on:keydown={handleKeyDown}>
  <div class="popup" on:click|stopPropagation>
    <h2>Beri Penilaian Pada Toko</h2><br>
    <div class="centered-items">
      {#each Array(5) as _, i}
        <span class="star {i < penilaianForm.rate ? 'filled' : ''}" style="font-size: 24px; margin: 7px;" on:click={() => setRating(i + 1)}>
          ★
        </span>
      {/each}
    </div><br>
    <div class="centered-items">
      <Input type="text" placeholder="Berikan Ulasan" bind:value={penilaianForm.ulasan} />
    </div>
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Beri Penilaian" on:click={saveChanges} />
    </div>
  </div>
</div>