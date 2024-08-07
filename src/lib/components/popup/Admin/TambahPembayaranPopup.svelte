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

  let paymentMethods = [
    { label: 'Transfer Bank', value: 'bank' },
    { label: 'QRIS', value: 'qris' },
    { label: 'Tunai', value: 'tunai' }
  ];

  function handleFileChange(event) {
    const files = event.target.files;
    if (files.length > 0) {
      pembayaranForm.qrisImg = files[0];
    }
  }

  async function saveChanges() {
    if (!pembayaranForm.paymentMethod) {
        alert('Semua kolom harus terisi!');
        return;
    }

    if (pembayaranForm.paymentMethod === 'bank') {
        if (!pembayaranForm.namaBank || !pembayaranForm.noRekBank || !pembayaranForm.catatan) {
            alert('Semua kolom harus terisi!');
            return;
        }
    }

    if (pembayaranForm.paymentMethod === 'qris') {
        if (!pembayaranForm.catatan) {
            alert('Semua kolom harus terisi!');
            return;
        }
    }

    if (pembayaranForm.paymentMethod === 'tunai') {
        if (!pembayaranForm.catatan) {
            alert('Semua kolom harus terisi!');
            return;
        }
    }

    dispatch('save', { ...pembayaranForm });
  }

  function closePopup() {
    dispatch('close');
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}">
  <div class="popup" on:click|stopPropagation>
    <h2>Tambah Metode Pembayaran</h2>
    <Input type="dropdown" placeholder="Pilih Metode Pembayaran" bind:value={pembayaranForm.paymentMethod} options={paymentMethods} style="width: 400px;" />
    {#if pembayaranForm.paymentMethod === 'bank'}
      <Input type="text" placeholder="Nama Bank" bind:value={pembayaranForm.namaBank} style="width: 400px;" />
      <Input type="text" placeholder="Nomor Rekening Bank" bind:value={pembayaranForm.noRekBank} style="width: 400px;" />
      <Input type="text" placeholder="Catatan" bind:value={pembayaranForm.catatan} style="width: 400px;" />
    {:else if pembayaranForm.paymentMethod === 'qris'}
      <h3>Upload QRIS Image</h3>
      <input type="file" accept="image/png, image/jpeg" on:change={handleFileChange} style="width: 400px;" />
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
