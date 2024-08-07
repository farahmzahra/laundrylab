<script>
  import { createEventDispatcher } from 'svelte';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let form = {
    fullName: '',
    email: '',
    notelp: '',
    profilPict: '',
    upload_path: '/Users/macbook/laundrylab/static/uploads'
  };

  const dispatch = createEventDispatcher();

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    if (!form.fullName || !form.email || !form.notelp) {
        alert('Semua kolom harus terisi!');
        return;
    }

    if (!isValidPhoneNumber(form.notelp)) {
        alert('Format nomor telepon salah, awali dengan 62!');
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

  function handleImageChange(event) {
      const file = event.target.files[0];
      form.profilPict = file;
  }

  function isValidPhoneNumber(phoneNumber) {
      const phoneNumberPattern = /^62\d{9,11}$/;;
      return phoneNumberPattern.test(phoneNumber);
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click="{closePopup}" on:keydown="{handleKeyDown}">
  <div class="popup" on:click|stopPropagation>
    <h2>Edit Profile</h2>
    <div class="centered-items">
      <Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Email" bind:value={form.email} disabled={true} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} />
    </div>
    <div class="centered-items">
      <h3>Upload Foto Profil</h3>
    </div>
    <div class="centered-items">
      <input type="file" accept="image/png, image/jpeg" on:change={handleImageChange} />
    </div>
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>