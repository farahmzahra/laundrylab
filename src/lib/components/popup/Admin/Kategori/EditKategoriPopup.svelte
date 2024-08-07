<script>
  import { createEventDispatcher } from 'svelte';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let kategoriForm = {
      idKategori: '',
      emailLaundry: '',
      categoryType: '',
      categoryName: '',
      harga: '',
      keterangan: ''
  };

  const dispatch = createEventDispatcher();

  let categoryTypes = [
    { label: 'Cuci Kering', value: 'cuci_kering', categoryName: 'Cuci Kering' },
    { label: 'Cuci Setrika Reguler', value: 'cuci_setrika_reguler', categoryName: 'Cuci Setrika Reguler' },
    { label: 'Cuci Setrika Kilat', value: 'cuci_setrika_kilat', categoryName: 'Cuci Setrika Setrika' },
    { label: 'Cuci Bed Cover dan Selimut', value: 'cuci_bedcover_selimut', categoryName: 'Cuci Kering' },
    { label: 'Setrika', value: 'setrika', categoryName: 'Cuci Kering' },
    { label: 'Cuci Lainnya', value: 'lainnya', categoryName: '' }
  ];

  async function saveChanges() {
    if (!kategoriForm.categoryType || !kategoriForm.categoryName || !kategoriForm.harga || !kategoriForm.keterangan) {
        alert('Semua kolom harus terisi!');
        return;
    }
    
    dispatch('save', { ...kategoriForm });
  }

  function closePopup() {
    dispatch('close');
  }

  $: if (kategoriForm.categoryType !== 'lainnya') {
    const selectedCategory = categoryTypes.find(category => category.value === kategoriForm.categoryType);
    if (selectedCategory) {
      kategoriForm.categoryName = selectedCategory.categoryName;
    }
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}">
  <div class="popup" on:click|stopPropagation>
    <h2>Ubah Kategori</h2>
    <Input type="dropdown" placeholder="Pilih Metode Pembayaran" bind:value={kategoriForm.categoryType} options={categoryTypes} disabled={true} />
    {#if kategoriForm.categoryType === 'lainnya'}
      <Input type="text" placeholder="Isi Nama Kategori" bind:value={kategoriForm.categoryName} style="width: 400px;" />
    {:else if kategoriForm.categoryType === 'cuci_kering'}
      <Input type="text" placeholder="Isi Nama Kategori" bind:value={kategoriForm.categoryName} style="width: 400px;" />
    {/if}
      <Input type="text" placeholder="Harga per/kg" bind:value={kategoriForm.harga} style="width: 400px;" />
      <Input type="text" placeholder="Keterangan Tambahan" bind:value={kategoriForm.keterangan} style="width: 400px;" />
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>
