<script>
	import { onMount } from 'svelte';
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-admin.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrowLeft from '$lib/images/left-arrow.png';
	import arrow from '$lib/images/down-arrow.png';
	import img from '$lib/images/profile/profile.jpg';
	import profilIcon from '$lib/images/profil-symbol.png';
	import alamatIcon from '$lib/images/address.png';
	import pesananIcon from '$lib/images/pesanan-symbol.png';
	import ratingIcon from '$lib/images/chat.png';
	import logoutIcon from '$lib/images/logout.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../ApiController.js';
	import ProtectedRoute from '../../ProtectedRoute.svelte';
	import '@fontsource/montserrat';

	let email = '';
	let dataAddresses = [];
	let users = [];

	let form = {
	    fullName: '',
	    email: '',
	    notelp: '',
	    profilPict: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads'
	};

	 onMount(async () => {
	    const token = localStorage.getItem('token');
	    const emailStored = localStorage.getItem('email');

	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: `getPetugasByEmail/${emailStored}`,
	        token: token
	      });

	      console.log('API Response:', response);

	      if (response && response.data && response.data.success) {
	        const user = response.data.users[0];
	        form.fullName = user.nama_petugas;
	        form.email = user.email_petugas;
	        form.notelp = user.notelp_petugas;
	        form.profilPict = user.profil_petugas;
	        console.log(user);
	      } else {
	        console.error('Failed to fetch user:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching user:', error);
	    }
	  });

	if (typeof window !== 'undefined') {
		email = localStorage.getItem('email') || '';
	}

	function logout() {
	    localStorage.removeItem('isAuthenticated');
	    localStorage.removeItem('id');
	    localStorage.removeItem('email');
	    localStorage.removeItem('role');
	    localStorage.removeItem('token');
	    window.location.href = '/';
	}
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<ProtectedRoute>
	<div class="card-container">
		<div class="header">
			<a href="/halamanPetugas/Pesanan/">
				<img src="{logo}" class="logo">
			</a>
			<a href="/halamanPetugas/Profil/">
				<img src="{profil}">
			</a>
		</div><br>
		<div style="align-items: center;">
			<div class="title-center">
		      Profil Saya
		    </div>
		</div>
		<br>
		<div class="centered-items">
            <div class="profile-img"><img src={form.profilPict} alt="No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet"></div>
        </div><br>
        <div>
        	<div class="card-row">
                <div>
                    <div class="card-row-spaceless">
                        <div class="card-title">Detail Data</div>
                    </div>
                </div>
            </div>
            <Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} disabled={true} style="width: 410px;" />
            <Input type="text" placeholder="Email" bind:value={form.email} disabled={true} style="width: 410px;" />
            <Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} disabled={true} style="width: 410px;" />
        </div>
		<div class="centered-items">
            <Button type="button" label="Logout" on:click={logout} />
        </div>
        <br><br>
        <br><br>
	</div>
</ProtectedRoute>