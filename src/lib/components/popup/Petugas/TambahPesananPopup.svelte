<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import trashbin from '$lib/images/trash.png';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let pesananForm = {
    idPesanan: '',
    emailPetugas: '',
    pesanan: [{ categoryType: '', berat: '', item: '' }],
    catatan: '',
    totalBayar: 0,
    idPembayaran: '',
    buktiPembayaran: '',
    upload_path: '/Users/macbook/laundrylab/static/uploads/paymentProof'
  };

  export let hargaPerCategory = {};
  export let payMethod = [];
  export let category = [];

  const dispatch = createEventDispatcher();
  let showModal = false;
  let modalImage = '';

  function closePopup() {
    dispatch('close');
    window.location.reload();
  }

  function saveChanges() {
    calculateTotalBayar();
    dispatch('save', pesananForm);
  }

  function handleKeyDown(event) {
    if (event.target.classList.contains('popup-overlay') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      closePopup();
    }
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      pesananForm.buktiPembayaran = files[0];
    }
  };

  function addPesanan() {
    pesananForm = {
      ...pesananForm,
      pesanan: [...pesananForm.pesanan, { categoryType: '', berat: '', item: '' }]
    };
  }

  function removePesanan(index) {
    pesananForm = {
      ...pesananForm,
      pesanan: pesananForm.pesanan.filter((_, idx) => idx !== index)
    };
    calculateTotalBayar();
  }

  function calculateTotalBayar() {
      let total = 0;
      pesananForm.pesanan.forEach(p => {
          const harga = parseFloat(hargaPerCategory[p.categoryType] || 0);
          const berat = parseFloat(p.berat || 0);
          total += harga * berat;
      });
      pesananForm.totalBayar = total;
  }

  function openModal(imageSrc) {
    modalImage = imageSrc;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    modalImage = '';
  }

  $: pesananForm.pesanan, calculateTotalBayar();

  onMount(() => {
    calculateTotalBayar();
    if (payMethod.length > 0) {
      pesananForm.idPembayaran = payMethod[0].idPembayaran;
    }
  });
</script>

<style>
  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }

  .modal img {
    max-width: 90%;
    max-height: 90%;
  }
</style>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}" on:keydown="{handleKeyDown}">
  <div class="popup" on:click|stopPropagation>
    <h2>Tambah Pesanan</h2>
    {#each pesananForm.pesanan as pesanan, index}
    <div class="centered-items">
        <div class="centered-items">
          <div class="card-row-spaceless">
              <div class="space-style">
                  <div style="margin-left: 10px; margin-right: 10px;">
                    <select bind:value={pesanan.categoryType} on:change={calculateTotalBayar} style="width: 100px;" class="dropdown-style">
                    <option disabled selected value="">Kategori</option>
                      {#each category as cat}
                        <option value={cat.categoryType}>{cat.categoryName}</option>
                      {/each}
                    </select>
                  </div>
              </div>
              <div class="space-style">
                  <div style="margin-right: 10px;">
                    <input type="text" placeholder="Berat" bind:value={pesanan.berat} on:input={calculateTotalBayar} style="width: 100px;" />
                  </div>
              </div>
              <div class="space-style">
                <div style="margin-right: 10px;">
                  <input type="text" placeholder="Item" bind:value={pesanan.item} style="width: 100px;" />
                </div>
              </div>
              <div class="space-style">
                <div style="margin-right: 10px;">
                  <button type="button" on:click={() => removePesanan(index)} style="width: 50px; margin-bottom: 12px" ><img src="{trashbin}" style="width: 20px; height: 20px;"></button>
                </div>
            </div>
          </div>
        </div>
    </div>
    {/each}
    <div class="centered-items">
        <button type="button" on:click={addPesanan}>Add Pesanan</button>
    </div><br>
    <div class="centered-items">
      <div>
        <label>Total Bayar: Rp. {pesananForm.totalBayar}</label>
      </div>
    </div><br>
    <div class="centered-items">
      <div>
        <input type="text" placeholder="Catatan Pesanan" bind:value={pesananForm.catatan} style="width: 380px;" />
      </div>
    </div>
    <div class="centered-items">
      <div>
        <label class="centered-items">Metode Pembayaran: </label>
          <select bind:value={pesananForm.idPembayaran} style="width: 200px;" class="dropdown-style">
            <option disabled selected value="">Pembayaran</option>
              {#each payMethod as method}
                <option value={method.idPembayaran}>
                  {#if method.paymentMethod === 'bank'}
                    {method.namaBank}
                  {:else if method.paymentMethod === 'qris'}
                    QRIS
                  {:else if method.paymentMethod === 'tunai'}
                    Tunai
                  {/if}
                </option>
              {/each}
        </select>
      </div>
    </div>
    {#if pesananForm.idPembayaran}
      {#each payMethod as method}
        {#if method.idPembayaran === pesananForm.idPembayaran}
          {#if method.paymentMethod === 'bank'}
            <div class="centered-items">
              <div>
                <label>No Rek: {method.noRekBank}</label>
              </div>
            </div>
            <div class="centered-items">
              <div>
                <label>Catatan: {method.catatan}</label>
              </div>
            </div>
          {:else if method.paymentMethod === 'qris'}
            <div class="centered-items">
              <div>
                <label>QRIS Image:</label>
              </div>
            </div>
            <div class="centered-items">
              <div>
                <img src={method.qrisImg} alt="QRIS Image" style="width: 100px; height: 100px; cursor: pointer;" on:click={() => openModal(method.qrisImg)} />
              </div>
            </div>
            <div class="centered-items">
              <div>
                <label>Catatan: {method.catatan}</label>
              </div>
            </div>
          {:else if method.paymentMethod === 'tunai'}
            <div class="centered-items">
              <div>
                <label>Catatan: {method.catatan}</label>
              </div>
            </div>
          {/if}
        {/if}
      {/each}
    {/if}
    <br>
    <div class="centered-items">
        <label>Bukti Pembayaran</label>
    </div>
    <div class="centered-items">
        <input type="file" accept="image/png, image/jpeg, image/jpg" on:change={handleFileChange} />
    </div>
    <div class="centered-items">
      <div>
        <button type="button" on:click={closePopup}>Batal</button>
        <button type="button" on:click={saveChanges}>Simpan</button>
      </div>
    </div>
  </div>
</div>

{#if showModal}
  <div class="modal" on:click={closeModal}>
    <img src={modalImage} alt="QRIS Image" />
  </div>
{/if}