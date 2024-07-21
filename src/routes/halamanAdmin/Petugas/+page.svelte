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
	import arrowLeft from '$lib/images/left-arrow.png';
	import AdminNavbar from '../../AdminNavbar.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../ApiController.js';
	import '@fontsource/montserrat';

	let users = [];

 	onMount(async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: 'getPetugas', 
                token: token
            });

            if (response && response.data && response.data.success) {
                users = response.data.users;
            } else {
                console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });

    async function deletePetugas(id_petugas) {
        const token = localStorage.getItem('token');

        try {
            const response = await ApiController({
                method: 'DELETE',
                endpoint: `deletePetugas/${id_petugas}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alert('Petugas deleted successfully');
                users = users.filter(user => user.id_petugas !== id_petugas);
            } else {
                console.error('Failed to delete petugas:', response ? response.data.error : 'No response from server');
                alert('Failed');
            }
        } catch (error) {
            console.error('Error deleting petugas:', error);
        }
    }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="scrollable">
		<div class="header" style="align-items: center;">
			<div class="title-center">
		      <a href="/halamanAdmin"> <!-- Link to go back to the previous page -->
		        <img src="{arrowLeft}" alt="back" class="back-arrow" />
		      </a>
		      Petugas
		    </div>
		</div>
		<br>
		<div class="card-row">
			<a href="Petugas/TambahDataPetugas"><Button type="button" label="Tambah Petugas" /></a>
		</div>
		<div class="content">
			{#if users.length > 0}
				{#each users as user}
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">{user.id_petugas} | {user.nama_petugas} | {user.notelp_petugas}</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.email_petugas}</div>
				                <div class="card-caption" style="text-align: left;">Password&nbsp;&nbsp;: {user.password_petugas}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a sveltekit:prefetch href="{`/halamanAdmin/Petugas/EditPetugas/${user.id_petugas}`}">Ubah</a></div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deletePetugas(user.id_petugas)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{/each}
			{:else}
				<p>No data</p>
			{/if}
		</div>
		<br><br><br>
	</div>
	<AdminNavbar />
</div>