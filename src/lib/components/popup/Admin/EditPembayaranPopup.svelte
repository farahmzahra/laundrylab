<script>
  import { createEventDispatcher } from 'svelte';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let pembayaranForm = {
    idPembayaran: '',
    emailLaundry: '',
    paymentMethod: '',
    namaBank: '',
    noRekBank: '',
    qrisImg: null,
    catatan: '',
    upload_path: '/Users/macbook/laundrylab/static/uploads'
  };

  const dispatch = createEventDispatcher();

  function handleImageChange(event) {
      const file = event.target.files[0];
      pembayaranForm.qrisImg = file;
  }

  async function saveChanges() {
    dispatch('save', { ...pembayaranForm });
  }

  function closePopup() {
    dispatch('close');
  }

  function handleKeyDown(event) {
    if (event.target.classList.contains('popup-overlay') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      closePopup();
    }
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}">
  <div class="popup" on:click|stopPropagation>
    <h2>Ubah Metode Pembayaran</h2>
    <Input type="text" placeholder="Pilih Metode Pembayaran" bind:value={pembayaranForm.paymentMethod} disabled={true} />
    {#if pembayaranForm.paymentMethod === 'bank'}
      <Input type="text" placeholder="Nama Bank" bind:value={pembayaranForm.namaBank} style="width: 400px;" />
      <Input type="text" placeholder="Nomor Rekening Bank" bind:value={pembayaranForm.noRekBank} style="width: 400px;" />
      <Input type="text" placeholder="Catatan" bind:value={pembayaranForm.catatan} style="width: 400px;" />
    {:else if pembayaranForm.paymentMethod === 'qris'}
      <h3>Upload QRIS Image</h3>
      <input type="file" accept="image/png, image/jpeg" on:change={handleImageChange} style="width: 400px;" />
      <Input type="text" placeholder="Catatan" bind:value={pembayaranForm.catatan} style="width: 400px;" />
    {:else if pembayaranForm.paymentMethod === 'tunai'}
      <Input type="text" placeholder="Catatan" bind:value={pembayaranForm.catatan} style="width: 400px;" />
    {/if}
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>
