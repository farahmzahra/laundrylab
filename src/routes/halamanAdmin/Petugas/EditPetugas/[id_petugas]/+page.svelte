<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import arrowLeft from '$lib/images/left-arrow.png';
	import arrow from '$lib/images/down-arrow.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../../../ApiController.js';
	import '@fontsource/montserrat';

	let form = {
	    fullName: '',
	    email: '',
	    notelp: '',
	    password: '',
	    profil_petugas: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads'
	};

	$: id_petugas = $page.params.id_petugas;
	let currentProfileImage = '';

    onMount(async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getPetugasId/${id_petugas}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const petugas = response.data.petugas;
                form.profil_petugas = petugas.profil_petugas;
                currentProfileImage = petugas.profil_petugas;
                form.fullName = petugas.nama_petugas;
                form.email = petugas.email_petugas;
                form.notelp = petugas.notelp_petugas;
                form.password = petugas.password_petugas;
                console.log(form.profil_petugas);
            } else {
                console.error('Failed to fetch petugas:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching petugas:', error);
        }
    });

    function handleImageChange(event) {
        const file = event.target.files[0];
        form.profil_petugas = file;
    }

    async function updatePetugas() {
        const token = localStorage.getItem('token');

        if (form.profil_petugas.name === currentProfileImage) {
            alert("You can't change the image with the same image used");
            return;
        }

        try {
	        const formData = new FormData();
	        formData.append('nama_petugas', form.fullName);
	        formData.append('notelp_petugas', form.notelp);
	        formData.append('password_petugas', form.password);
	        formData.append('upload_path', form.upload_path);

	        if (form.profil_petugas) {
	            formData.append('profil_petugas', form.profil_petugas);
	        }

            const response = await ApiController({
                method: 'PUT',
                endpoint: `updatePetugas/${id_petugas}`,
                token: token,
                datas: formData,
                sendForm: true
            });

            if (response && response.data && response.data.success) {
                alert('Petugas updated successfully');
                window.location.href = '/halamanAdmin/Petugas';
            } else {
            	console.error('Failed to update petugas:', response ? response.data.error : 'No response from server');
                alert('Failed');
            }
        } catch (error) {
            console.error('Error updating petugas:', error);
        }
    }

</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header" style="align-items: center;">
		<div class="title-center">
	      <a href="/halamanAdmin">
	        <img src="{arrowLeft}" alt="back" class="back-arrow" />
	      </a>
	      Ubah Profil Petugas
	    </div>
	</div>
	<br>
	<div class="centered-items">
		<div class="profile-img">
			<img src="/uploads/{form.profil_petugas}" alt="Profile Picture" />
		</div>
	</div><br>
	<div class="centered-items">
		<input type="file" accept="image/*" id="profil-petugas" on:change={handleImageChange}>
	</div><br>
	<div>
		<Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} />
		<Input type="text" placeholder="Email" bind:value={form.email} disabled={true} />
		<Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} />
		<Input type="text" placeholder="Password" bind:value={form.password} />
	</div>
	<div class="centered-items">
		<Button type="button" label="Ubah" on:click={updatePetugas} />
	</div>
</div>