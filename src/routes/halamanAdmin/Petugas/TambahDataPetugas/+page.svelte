<script>
	import { onMount } from 'svelte';
	import icon from '$lib/images/logo.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrow from '$lib/images/down-arrow.png';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import ApiController from '../../../ApiController.js';
	import '@fontsource/montserrat';

	let form = {
		id_petugas: '',
        nama_petugas: '',
        notelp_petugas: '',
        email_petugas: '',
        password_petugas: '',
        profil_petugas: '',
        upload_path: '/Users/macbook/laundrylab/static/uploads'
    };

    let files;
    let users = [];

    const fetchUsers = async () => {
	    const token = localStorage.getItem('token');
	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: 'getPetugas',
	        token: token
	      });

	      if (response && response.data && response.data.success) {
	        users = response.data.users;
	        if (users.length > 0) {
	          const lastUserId = users
	            .map(user => parseInt(user.id_petugas))
	            .sort((a, b) => a - b)
	            .pop();
	          const incrementedId = lastUserId + 1;
	          form.id_petugas = incrementedId.toString();
	        } else {
	          form.id_petugas = '1';
	        }
	      } else {
	        console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching users:', error);
	    }
	  };

	  const handleFileChange = (event) => {
	    const files = event.target.files;
	    if (files.length > 0) {
	      form.profil_petugas = files[0];
	    }
	  };

	  const petugasRegister = async () => {
	    const formData = new FormData();
	    formData.append('id_petugas', form.id_petugas);
	    formData.append('nama_petugas', form.nama_petugas);
	    formData.append('notelp_petugas', form.notelp_petugas);
	    formData.append('email_petugas', form.email_petugas);
	    formData.append('password_petugas', form.password_petugas);
	    formData.append('upload_path', form.upload_path);

	    if (form.profil_petugas) {
	      formData.append('profil_petugas', form.profil_petugas);
	    } else {
	      console.log('No file selected');
	    }

	    try {
	      const response = await ApiController({ method: 'POST', endpoint: 'petugasRegister', datas: formData });
	      console.log('API Response:', response);
	      if (response.data.success) {
	        alert('Petugas added successfully!');
	        window.location.href = '/halamanAdmin/Petugas';
	      } else {
	        alert('Failed to add petugas: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error adding petugas:', error);
	      alert('An error occurred while adding petugas.');
	    }
	  };

	  onMount(fetchUsers);

</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div class="card-row">
		<div class="title">Tambah Petugas</div>
	</div><br>
	<div>
	    <Input type="text" placeholder="Nama Petugas" bind:value={form.nama_petugas} style="width: 400px;" />
		<Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp_petugas} style="width: 400px;" />
	    <Input type="text" placeholder="Email Petugas" bind:value={form.email_petugas} style="width: 400px;" />
	    <Input type="text" placeholder="Password Petugas" bind:value={form.password_petugas} style="width: 400px;" />
	    <h3>Foto Profil Petugas</h3>
	    <input type="file" accept="image/png, image/jpeg, image/jpg" on:change={handleFileChange} style="width: 400px;" />
	    <!-- <Input type="file" accept="image/*" label="Profil Petugas" bind:value={form.profil_petugas} style="width: 400px;" /> -->
	</div>
	<div class="buttons">
		<Button type="button" label="Tambah Petugas" on:click={petugasRegister}/>
	</div>
</div>