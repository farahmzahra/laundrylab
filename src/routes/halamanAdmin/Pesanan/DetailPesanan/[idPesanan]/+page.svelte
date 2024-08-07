<script>
	import { onMount, createEventDispatcher } from 'svelte';
    import { page } from '$app/stores';
	import mapboxgl from 'mapbox-gl';
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-admin.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrow from '$lib/images/down-arrow.png';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../../../ApiController.js';
	import AdminNavbar from '../../../../AdminNavbar.svelte';
	import '@fontsource/montserrat';

	$: idPesanan = $page.params.idPesanan;

	let latitude = 0.5629111224534288;
  	let longitude = 101.4421451952098;
	let order = [];
  	let dataPetugas = [];
  	let userLongitude = null;
  	let userLatitude = null;
  	let showAddPesananPopup = false;
  	let payMethod = [];
  	let hargaPerCategory = [];
  	let category = [];
  	let alamat = [];
  	let emailUser = '';
  	let alamatUser = '';

  	let locationForm = {
    	alamatUser: '',
    	longitudeUser: null,
    	latitudeUser: null
    }

	onMount(async () => {
        const token = localStorage.getItem("token");
        const emailStored = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByIdEmailLaundry/${idPesanan}/${emailStored}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                order = response.data.orders[0];
	            emailUser = order.emailUser;
                await getLaundryDetails(emailUser);
                alamatUser = order.alamatUser;
                await getAddressDetails(emailUser, alamatUser);
                if (order.emailPetugas) {
                	await getPetugasDetails(order.emailPetugas);
                }
                console.log(order);
                console.log(order.statusPesanan[4].active);
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAlamatDetails/${emailUser}/${alamatUser}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alamat = response.data.users[0];
                userLongitude = alamat.longitudeUser;
                userLatitude = alamat.latitudeUser;
	            console.log(userLongitude);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }

            mapboxgl.accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

		    const map = new mapboxgl.Map({
		      container: 'map',
		      style: 'mapbox://styles/mapbox/streets-v11',
		      center: [userLongitude, userLatitude],
		      zoom: 14
		    });

		    const marker = new mapboxgl.Marker()
		      .setLngLat([userLongitude, userLatitude])
		      .addTo(map);
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    });

    async function getLaundryDetails(email) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getUserEmail/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const pelanggan = response.data.pelanggan;
	            order = { ...order, laundryDetails: pelanggan };
	            console.log(pelanggan);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    async function getAddressDetails(emailUser, alamat) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAlamatDetails/${emailUser}/${alamat}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alamat = response.data.users[0];
	            order = { ...order, addressDetails: alamat };
	            console.log(alamat);
	            console.log(order);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    async function getPetugasDetails(email) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getPetugasByEmail/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const users = response.data.users[0];
	            order = { ...order, petugasDetails: users };
	            console.log(users);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    async function updateDiproses(order) {
        const token = localStorage.getItem("token");

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        const formData = new FormData();
        formData.append('currentDate', currentDate);
        formData.append('currentTime', currentTime);

        console.log('Tanggal:', currentDate);
        console.log('Waktu:', currentTime);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        console.log(order.idPesanan);

        try {
            const response = await ApiController({
                method: 'PUT',
                endpoint: `editMenungguDiantar/${order.idPesanan}`,
                token: token,
                datas: formData,
                sendForm: true
            });

            console.log('Server response:', response);

            if (response && response.data && response.data.success) {
                // const orderIndex = order.findIndex(o => o.idPesanan === order.idPesanan);
                // if (orderIndex !== -1) {
                //     order[orderIndex] = { ...order[orderIndex] };
                // }
                window.location.reload();
            } else {
                console.error('Failed to update status:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
</script>

<style>
	@import url('https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css');
</style>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<a href="/halamanPetugas/Pesanan/">
			<img src="{logo}" class="logo">
		</a>
		<img src="{profil}">
	</div><br>
	<div class="card-row centered-items">
		<div class="title">Detail Pesanan</div>
	</div>
	<div class="card-row">
		<div class="sub-big-title">Data Pelanggan</div>
	</div>
	<div class="content">
		<div class="card-info-border">
			<div class="card-row-spaceless">
				<div class="space-style">
					<div class="card-title">{order.laundryDetails?.nama || 'Loading...'}</div>
					<div class="card-title-secondary">Telp. {order.laundryDetails?.notelp || 'Loading...'}</div>
					<div class="card-caption">{order.addressDetails?.alamat || 'Loading...'}, Kelurahan. {order.addressDetails?.kelurahan || 'Loading...'}, Kecamatan. {order.addressDetails?.kecamatan || 'Loading...'}, {order.addressDetails?.kodePos || 'Loading...'}</div>
					<div class="card-caption">Detail Alamat: {order.addressDetails?.detailAlamat || 'Loading...'}</div>
				</div>
			</div>
		</div>
	</div>
	<div style="width: 400px">
		<div id="map"></div>
	</div>
	<div class="card-row">
		<div class="sub-big-title">Data Petugas</div>
	</div>
	<div class="content">
		<div class="card-info-border">
			<div class="card-row-spaceless">
				<div class="space-style">
					<div class="card-title">{order.petugasDetails?.nama_petugas || 'Loading...'}</div>
					<div class="card-title-secondary">Telp. {order.petugasDetails?.notelp_petugas || 'Loading...'}</div>
				</div>
			</div>
		</div>
	</div>
	{#if order.pesanan}
	<div class="card-row">
		<div class="sub-big-title">Data Pesanan</div>
	</div>
	<div class="card-info-border">
		{#if order.pesanan}
			{#each order.pesanan[0] as pesanan}
		        <div class="card-row-spaceless">
		            <div class="space-style">
	                {#if pesanan.categoryType === 'cuci_kering'}
	                	<div class="card-title">Cuci Kering</div>
	                {:else if pesanan.categoryType === 'cuci_setrika_reguler'}
	                	<div class="card-title">Cuci Setrika Reguler</div>
	               	{:else if pesanan.categoryType === 'cuci_setrika_kilat'}
	               		<div class="card-title">Cuci Setrika Kilat</div>
	               	{:else if pesanan.categoryType === 'cuci_bedcover_selimut'}
	               		<div class="card-title">Cuci Bed Cover dan Selimut</div>
	               	{:else if pesanan.categoryType === 'setrika'}
	               		<div class="card-title">Setrika</div>
	               	{:else if pesanan.categoryType === 'lainnya'}
	               		<div class="card-title">Lainnya</div>
	                {/if}
		            </div>
		            <div class="space-style">
		                <div class="card-title-secondary">{pesanan.berat} Kg</div>
		            </div>
		            <div class="space-style">
		                <div class="card-title-secondary">{pesanan.item} item</div>
		            </div>
		        </div>
		    {/each}
		{/if}<br>
        <div class="card-row-spaceless">
            <div class="space-style">
                <div class="card-title">Total Bayar</div>
            </div>
            <div class="space-style" style="margin-left: 50px;">
            {#if order.totalBayar}
			    <div class="card-title-secondary">Rp {order.totalBayar[0]}</div>
			{:else}
			    <div class="card-title-secondary">Loading...</div>
			{/if}

            </div>
        </div><br>
        <div class="card-row-spaceless">
            <div class="space-style">
            {#if order.catatan}
			    <div class="card-title-secondary">Catatan: {order.catatan[0]}</div>
			{:else}
			    <div class="card-sub">Loading...</div>
			{/if}
            </div>
        </div><br>
        <div class="card-row-spaceless">
            <div>
              	<div class="card-title-smaller">Bukti Pembayaran</div>
              		{#if order.buktiPembayaran}
					    <img src={order.buktiPembayaran} alt="Payment Image" class="payment-image">
					{:else}
					    <div class="card-sub">Loading...</div>
					{/if}
            </div>
        </div>
    </div>
<!-- 	    {#if order.statusPesanan[3].active === 'true'}
	    	<button type="button" class="button-centered" on:click={() => updateDiproses(order)}>Selesai Diproses</button>
	    {/if} -->
    {/if}  
    <br><br>
    <br><br><br>
    <AdminNavbar />
</div>