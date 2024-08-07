<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import mapboxgl from 'mapbox-gl';
	import logo from '$lib/images/logo-user.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import star from '$lib/images/star-review.png';
	import disableStar from '$lib/images/gray-star.png';
	import BottomButton from '$lib/components/bottomButton.svelte';
	import ApiController from '../../../../ApiController.js';
	import PilihAlamatPopup from '$lib/components/popup/User/PilihAlamatPopup.svelte';
	import '@fontsource/montserrat';

	$: email = $page.params.email;

 	export let latitude = 0.5629111224534288;
  	export let longitude = 101.4421451952098;
  	let showPilihAlamatPopup = false;
	let categories = [];
	let users = [];
    let allRates = [];
    let completedOrdersCount = 0;

  	let form = {
	    fullName: '',
	    email: '',
	    notelp: '',
	    profilPict: '',
	    alamat: '',
	    kelurahan: '',
	    kecamatan: '',
	    kodePos: '',
	    longitudeLaundry: null,
    	latitudeLaundry: null,
	    detailAlamat: '',
	    bukaTutupLaundry: ''
	};

	let operasionalForm = {
	    days: [
	      { name: 'Senin', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Selasa', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Rabu', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Kamis', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Jumat', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Sabtu', jamBuka: '', jamTutup: '', tutup: false },
	      { name: 'Minggu', jamBuka: '', jamTutup: '', tutup: false }
	    ]
	};

	let kategoriForm = {
	    idKategori: '',
	    emailLaundry: '',
	    categoryType: '',
	    harga: '',
	    keterangan: ''
	};

	let pesananForm = {
	    idPesanan: '',
	    emailLaundry: '',
	    emailUser: '',
	    alamatUser: '',
	    statusPesanan: [
	      	{ status: 'menunggu_konfirmasi', tanggal: '', waktu: '', active: 'false' },
            { status: 'menunggu_dijemput', tanggal: '', waktu: '', active: 'false' },
            { status: 'sedang_dijemput', tanggal: '', waktu: '', active: 'false' },
            { status: 'diproses', tanggal: '', waktu: '', active: 'false' },
            { status: 'perlu_diantar', tanggal: '', waktu: '', active: 'false' },
            { status: 'sedang_diantar', tanggal: '', waktu: '', active: 'false' },
            { status: 'selesai', tanggal: '', waktu: '', active: 'false' },
            { status: 'gagal', tanggal: '', waktu: '', active: 'false' }
	    ]
	};

	let notifForm = {
	    idNotif: '',
	    emailLaundry: '',
	    emailUser: '',
	    emailPetugas: '',
	    statusPesanan: [
	      	{ status: 'menunggu_konfirmasi', tanggal: '', waktu: '', active: 'false' },
            { status: 'menunggu_dijemput', tanggal: '', waktu: '', active: 'false' },
            { status: 'sedang_dijemput', tanggal: '', waktu: '', active: 'false' },
            { status: 'diproses', tanggal: '', waktu: '', active: 'false' },
            { status: 'perlu_diantar', tanggal: '', waktu: '', active: 'false' },
            { status: 'sedang_diantar', tanggal: '', waktu: '', active: 'false' },
            { status: 'selesai', tanggal: '', waktu: '', active: 'false' },
            { status: 'gagal', tanggal: '', waktu: '', active: 'false' }
	    ]
	};

  	onMount(async () => {
  		const token = localStorage.getItem('token');

	    try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAdminEmail/${email}`,
                token: token
            });

            console.log('API Response:', response);

            if (response && response.data && response.data.success) {
                const admin = response.data.admin;
                form.fullName = admin.namaLaundry;
                form.email = admin.email;
                form.notelp = admin.notelp;
                form.bukaTutupLaundry = admin.bukaTutupLaundry;
                form.profilPict = admin.profilPict;
                form.alamat = admin.alamat;
                form.kelurahan = admin.kelurahan;
                form.kecamatan = admin.kecamatan;
                form.kodePos = admin.kodePos;
                form.longitudeLaundry = admin.longitudeLaundry;
                form.latitudeLaundry = admin.latitudeLaundry;
                form.detailAlamat = admin.detailAlamat;
                operasionalForm.days = admin.days;
            } else {
                console.error('Failed to fetch admin:', response ? response.data.error : 'No response from server');
            }

            mapboxgl.accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

		    const map = new mapboxgl.Map({
		      container: 'map',
		      style: 'mapbox://styles/mapbox/streets-v11',
		      center: [form.longitudeLaundry, form.latitudeLaundry],
		      zoom: 14
		    });

		    const marker = new mapboxgl.Marker()
		      .setLngLat([form.longitudeLaundry, form.latitudeLaundry])
		      .addTo(map);

        } catch (error) {
            console.error('Error fetching admin:', error);
        }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getKategori/${email}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
		        categories = response.data.categories;
		      } else {
                console.error('Failed to fetch categories:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesanan`, 
                token: token
            });

            if (response && response.data && response.data.success) {
		        let order = response.data.orders;
		        if (order.length > 0) {
		          const lastUserId = order
		            .map(user => parseInt(user.idPesanan))
		            .sort((a, b) => a - b)
		            .pop();
		          const incrementedId = lastUserId + 1;
		          pesananForm.idPesanan = incrementedId.toString();
		          console.log(order);
		          console.log(pesananForm.idPesanan);
		        } else {
		          pesananForm.idPesanan = '1';
		        }
		      } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getNotification`, 
                token: token
            });

            if (response && response.data && response.data.success) {
		        let notif = response.data.notifs;
		        if (notif.length > 0) {
		          const lastUserId = notif
		            .map(user => parseInt(user.idNotif))
		            .sort((a, b) => a - b)
		            .pop();
		          const incrementedId = lastUserId + 1;
		          notifForm.idNotif = incrementedId.toString();
		          console.log(notif);
		          console.log(notifForm.idNotif);
		        } else {
		          notifForm.idNotif = '1';
		        }
		      } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAllPenilaianByLaundry/${email}`,
                token: token
            });

            console.log('API Response:', response);

            if (response && response.data && response.data.success) {
                allRates = response.data.rates;
                console.log(allRates);
            } else {
                console.error('Failed to fetch admin:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin:', error);
        }

        generateDone(email);
	});

  	function fetchAddresses() {
	    showPilihAlamatPopup = true;
	    showAddresses();
	}

	async function showAddresses() {
		const token = localStorage.getItem("token");
		const email = localStorage.getItem("email");

	    try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getAlamat/${email}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
		        users = response.data.users;
		        console.log(users);
		      } else {
                console.error('Failed to fetch categories:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
	}

	async function handleSelectAddress(event) {
	    let selectedAddress = event.detail.address;
	    let currentDate = event.detail.currentDate;
    	let currentTime = event.detail.currentTime;
	    showPilihAlamatPopup = false;
	    console.log('Selected Address:', selectedAddress);

	    pesananForm.statusPesanan.forEach(status => {
	        if (status.status === 'menunggu_konfirmasi') {
	            status.tanggal = currentDate;
	            status.waktu = currentTime;
	            status.active = 'true';
	        }
	    });

	    const token = localStorage.getItem("token");
		const emailStored = localStorage.getItem("email");

	    const formData = new FormData();
	    formData.append('idPesanan', pesananForm.idPesanan);
	    formData.append('emailLaundry', email);
	    formData.append('emailUser', emailStored);
	    formData.append('alamatUser', selectedAddress.alamat);
	    formData.append('statusPesanan', JSON.stringify(pesananForm.statusPesanan));

	    try {
	        const response = await ApiController({
	            method: 'POST',
	            endpoint: `addPesanan/${selectedAddress.idPesanan}`,
	            datas: formData
	        });

	        console.log('API Response:', response);
	        if (response.data.success) {
	            alert('Data Berhasil Ditambahkan!');
	            window.location.href = '/halamanUser/Pesanan';
	        } else {
	            alert('Terjadi kesalahan saat data ditambahkan: ' + (response.data.error || 'Unknown error'));
	        }
	    } catch (error) {
	        console.error('Error adding pesanan:', error);
	        alert('Terjadi kesalahan saat data ditambahkan');
	    }


	    const formData1 = new FormData();
	    formData1.append('idNotif', notifForm.idNotif);
	    formData1.append('idPesanan', pesananForm.idPesanan);
	    formData1.append('emailLaundry', email);
	    formData1.append('emailUser', emailStored);
	    formData1.append('message', 'Ada pesanan baru dari pelanggan!');

	    try {
	        const response = await ApiController({
	            method: 'POST',
	            endpoint: `addNotif/${selectedAddress.idPesanan}/${notifForm.idNotif}`,
	            datas: formData1
	        });

	        console.log('API Response:', response);
	        if (response.data.success) {
	            window.location.href = '/halamanUser/Pesanan';
	        } else {
	            alert('Failed to add Pesanan: ' + (response.data.error || 'Unknown error'));
	        }
	    } catch (error) {
	        console.error('Error adding pesanan:', error);
	        alert('An error occurred while adding pesanan.');
	    }
	}

	function handleClosePopup() {
	    showPilihAlamatPopup = false;
	}

	function censorName(name) {
        if (name.length <= 2) {
            return name;
        }
        return name.substring(0, 2) + '*'.repeat(name.length - 3);
    }

    async function generateDone(email) {
    	console.log(email);
    	const token = localStorage.getItem("token");

    	try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getPesananByEmailLaundry/${email}`,
                token: token
            });

            console.log('API Response:', response);

            if (response && response.data && response.data.success) {
                const allOrder = response.data.orders;
                console.log(allOrder);
                completedOrdersCount = allOrder.filter(order => order.statusPesanan[6].active === 'true').length;
                console.log("Completed orders count:", completedOrdersCount);
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }
</script>

<style>
	@import url('https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css');
</style>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="Halaman Detail" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="scrollable">
		<div class="header">
			<a href="/halamanUser/Beranda/">
				<img src="{logo}" class="logoUser" alt="Logo User">
			</a>
		</div>
		<div class="card-row centered-items">
			<div class="sub-big-title">{form.fullName}</div>
		</div>
		<div class="card-row centered-items">
			<div class="card-title-smaller">{completedOrdersCount} Pesanan Selesai</div>
		</div>
		<div style="width: 400px">
			<div id="map"></div>
		</div>
		<div>
			<div class="card-info-border">
                <div class="card-row">
                    <div>
                        <div class="card-row-spaceless">
                            <div>
                                <div class="card-title">Alamat</div>
                                <div class="card-caption">{form.alamat}, {form.kelurahan}, {form.kecamatan}, {form.kodePos}</div>
                                <div class="card-caption">Catatan: {form.detailAlamat}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>
		<div class="card-row">
			<div class="title">Kategori</div>
		</div>
		{#each categories as user}
			<div class="card-info-border">
				<div class="card-row-spaceless">
					<img src="/assets/cuci-kering.png" class="img-icon-cat" style="margin-right: 10px;">
					<div>
						<div class="card-title">{user.categoryName}</div>
						<div class="card-caption">Rp. {user.harga}</div>
						<div class="card-caption">Keterangan: {user.keterangan}</div>
					</div>
				</div>
			</div>
		{/each}
		<div class="card-info-border">
            <div class="card-row">
                <div>
                    <div class="card-row-spaceless">
                        <div>
                            <div class="card-title">Jam Operasional</div>
                            {#each operasionalForm.days as day}
                                <div class="card-caption">
                                	<table>
                                		<tr>
                                			<td>{day.name}</td>
                                			<td>{day.jamBuka} - {day.jamTutup}</td>
                                		</tr>
                                	</table>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {#if allRates !== -1}
        <div class="card-row">
            <div class="title">Penilaian</div>
        </div>
        <div class="scrollable-x">
            <div class="laundry-list">
                {#each allRates as rate}
                <div class="card-info-border">
                    <div class="card-row">
                        <div>
                            <div class="card-title">{censorName(rate.emailUser)}</div>
                            <div class="card-caption-bigger">"{rate.ulasan}"</div>
                        </div>
                        <div>
                            <div class="card-review">
                                {#each { length: 5 } as _, i}
                                    <img src="{i < rate.rate ? star : disableStar}" alt="star" class="img-icon-star">
                                {/each}
                            </div><br>
                            <div class="card-caption">{rate.tanggal}</div>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>
        {/if}
		<br><br>
		<br><br>
	</div>
	{#if form.bukaTutupLaundry === 'Tutup'}
		<BottomButton label="Toko Laundry Tutup" disabled="true" style="background-color: #808080;"/>
	{:else}
		<BottomButton label="Pesan" onClick={fetchAddresses} />
	{/if}
</div>
{#if showPilihAlamatPopup}
	<PilihAlamatPopup userAddresses={users} on:select={handleSelectAddress} on:close={handleClosePopup} />
{/if}