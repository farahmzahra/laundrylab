<script>
  import { createEventDispatcher } from 'svelte';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let form = {
		id_petugas: '',
	    nama_petugas: '',
	    notelp_petugas: '',
	    email_petugas: '',
	    password_petugas: '',
	    profil_petugas: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads'
	};

  const dispatch = createEventDispatcher();

  function handleImageChange(event) {
      const file = event.target.files[0];
      form.profil_petugas = file;
  }

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    if (!form.nama_petugas || !form.notelp_petugas || !form.email_petugas || !form.password_petugas) {
        alert('Semua kolom harus terisi!');
        return;
    }
    
    dispatch('save', { ...form });
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
    <h2>Ubah Petugas</h2>
    <div class="centered-items">
      <Input type="text" placeholder="Nama Petugas" bind:value={form.nama_petugas} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp_petugas} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Email Petugas" bind:value={form.email_petugas} disabled={true} />
    </div>
    <div class="centered-items">
      <Input type="password" placeholder="Password Petugas" bind:value={form.password_petugas} isPassword="true" />
    </div>
    <div class="centered-items">
      <h3>Foto Profil Petugas</h3>
    </div>
    <div class="centered-items">
      <input type="file" accept="image/png, image/jpeg, image/jpg" on:change={handleImageChange} />
    </div>
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>