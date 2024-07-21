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
	import minus from '$lib/images/minus.png';
	import plus from '$lib/images/plus.png';
	import star from '$lib/images/star-review.png';
	import BottomButton from '$lib/components/bottomButton.svelte';
	import Button from '$lib/components/button.svelte';
	import Mapbox from '$lib/components/popup/Admin/Mapbox.svelte';
	import TambahPesananPopup from '$lib/components/popup/Petugas/TambahPesananPopup.svelte';
	import ApiController from '../../ApiController.js';
	import '@fontsource/montserrat';

	let tabs = ['Menunggu Dijemput', 'Sedang Dijemput', 'Diproses', 'Perlu Diantar', 'Sedang Diantar', 'Selesai'];
  	let activeTab = 'Menunggu Dijemput';
  	let order = [];
  	let dataPetugas = [];
  	let showMap = false;
  	let longitude = null;
  	let latitude = null;
  	let showAddPesananPopup = false;
  	let payMethod = [];
  	let hargaPerCategory = [];
  	let category = [];

  	let form = {
        nama: '',
        notelp: '',
        email: '',
        profilPict: '',
        longitudeUser: null,
        latitudeUser: null
    };

    let laundryForm = {
        nama: '',
        notelp: '',
        email: '',
        profilPict: ''
    };

    let locationForm = {
    	alamatUser: '',
    	longitudeUser: null,
    	latitudeUser: null
    }

    let pesananForm = {
	    idPesanan: '',
	    emailPetugas: '',
	    pesanan: [{ categoryType: '', berat: '', item: '' }],
	    catatan: '',
	    totalBayar: 0,
	    idPembayaran: '',
	    buktiPembayaran: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads/paymentProof'
	};

  	onMount(async () => {
        const token = localStorage.getItem("token");
        const emailStored = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmailPetugas/${emailStored}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                order = response.data.orders;
                 for (let i = 0; i < order.length; i++) {
	                const emailUser = order[i].emailUser;
	                getLaundryDetails(emailUser, i);
	                if (order[i].emailLaundry) {
	                    getAdminDetails(order[i].emailLaundry, i);
	                }
	                console.log(order);

	                if (order[i].alamatUser) {
                        locationForm.alamatUser = order[i].alamatUser;
                        console.log(locationForm.alamatUser);
                    }
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
                endpoint: `getPetugasByEmail/${emailStored}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                dataPetugas = response.data.users;
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    });

    async function getLaundryDetails(email, index) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getUserEmail/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const pelanggan = response.data.pelanggan;
	            if (index !== -1) {
	                order[index] = { ...order[index], laundryDetails: pelanggan };
	            }
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    async function getAdminDetails(email, index) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAdminEmail/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const admin = response.data.admin;
	            if (index !== -1) {
	                order[index] = { ...order[index], adminDetails: admin };
	            }
	            console.log(admin);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    function handleClick(event, email) {
	    console.log('Clicked Laundry Email:', email);
	}

	async function handleAddressMapClick(email, alamat) {
		const token = localStorage.getItem("token");

	    try {
	    	const response = await ApiController({
                method: 'GET',
                endpoint: `getLongLatPesananUser/${email}/${alamat}`,
                token: token
            });

          	if (response && response.data && response.data.success) {
                const user = response.data.users[0];
                form.latitudeUser = user.latitudeUser;
                form.longitudeUser = user.longitudeUser;
                latitude = form.latitudeUser;
                longitude = form.longitudeUser;
                showMap = true;
                console.log(longitude);
                console.log(latitude);
            } else {
                console.error('Failed to fetch user details:', response ? response.data.error : 'No response from server');
            }

	    } catch (error) {
	      	alert("Location not found");
	    }
	}

	function closeMap() {
		showMap = false;
	}

	async function updateJemputPesanan(pesanan) {
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

	    try {
	        const response = await ApiController({
	            method: 'PUT',
	            endpoint: `editTungguDijemput/${pesanan.idPesanan}/${pesanan.emailPetugas}`,
	            token: token,
	            datas: formData,
	            sendForm: true
	        });

	        console.log('Server response:', response);

	        if (response && response.data && response.data.success) {
	        	const orderIndex = order.findIndex(o => o.idPesanan === pesanan.idPesanan);
	            if (orderIndex !== -1) {
	                order[orderIndex] = { ...order[orderIndex] };
	            }
	            window.location.reload();
	        } else {
	            console.error('Failed to update status:', response ? response.data.error : 'No response from server');
	        }
	    } catch (error) {
	        console.error('Error updating status:', error);
	    }
	}

	async function openAddPesananPopup(idPesanan, emailPetugas) {
		const token = localStorage.getItem("token");

		try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByIdEmail/${idPesanan}/${emailPetugas}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                order = response.data.orders;
                console.log(order);
                await getPesananDetails(order[0].emailLaundry);
                console.log(order[0].emailLaundry);
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
	  	
	  	pesananForm.idPesanan = idPesanan;
	  	pesananForm.emailPetugas = emailPetugas;
	  	console.log(pesananForm.idPesanan);
	  	console.log(pesananForm.emailPetugas);
	  	showAddPesananPopup = true;
	}

	async function getPesananDetails(emailLaundry) {
	    const token = localStorage.getItem("token");

	    console.log(emailLaundry);

	    try {
	        const response = await ApiController({
	            method: 'GET',
	            endpoint: `getPembayaran/${emailLaundry}`,
	            token: token
	        });

	        if (response && response.data && response.data.success) {
	            payMethod = response.data.users;
	            console.log(payMethod);
	        } else {
	            console.error('Failed to fetch payment method details:', response ? response.data.error : 'No response from server');
	        }
	    } catch (error) {
	        alert("Payment Method not found");
	    }

	    try {
	        const response1 = await ApiController({
	            method: 'GET',
	            endpoint: `getKategori/${emailLaundry}`,
	            token: token
	        });

	        if (response1 && response1.data && response1.data.success) {
	            category = response1.data.categories;
	            hargaPerCategory = category.reduce((acc, cat) => {
	                acc[cat.categoryType] = cat.harga;
	                return acc;
	            }, {});
	            console.log(category);
	        } else {
	            console.error('Failed to fetch category details:', response1 ? response1.data.error : 'No response from server');
	        }
	    } catch (error) {
	        alert("Category not found");
	    }
	}

	async function saveNewOrder(event) {
        const token = localStorage.getItem("token");

        const { idPesanan, emailPetugas, pesanan, catatan, totalBayar, idPembayaran, buktiPembayaran, upload_path } = event.detail;

        console.log(pesanan);
        console.log(catatan);
        console.log(totalBayar);
        console.log(idPembayaran);
        console.log(buktiPembayaran);
        console.log(upload_path);

        const now = new Date();
	    const currentDate = now.toISOString().split('T')[0];
	    const currentTime = now.toTimeString().split(' ')[0];

        const formData = new FormData();
        formData.append('pesanan', JSON.stringify(pesanan));
        formData.append('catatan', catatan);
        formData.append('totalBayar', totalBayar);
        formData.append('idPembayaran', idPembayaran);
        formData.append('buktiPembayaran', buktiPembayaran);
        formData.append('currentDate', currentDate);
	    formData.append('currentTime', currentTime);
	    formData.append('upload_path', upload_path);

        for (let pair of formData.entries()) {
	        console.log(pair[0]+ ': ' + pair[1]); 
	    }

	    console.log(pesananForm.idPesanan);
	    console.log(pesananForm.emailPetugas);

        try {
            const response = await ApiController({
                method: 'PUT',
                endpoint: `editSedangDijemput/${pesananForm.idPesanan}/${pesananForm.emailPetugas}`,
                token: token,
                datas: formData,
                sendForm: true
            });

            if (response && response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error('Failed to save order:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    async function updatePerluDiantar(idPesanan) {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        const formData = new FormData();
        formData.append('currentDate', currentDate);
        formData.append('currentTime', currentTime);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await ApiController({
                method: 'PUT',
                endpoint: `editTungguDiantar/${idPesanan}/${email}`,
                token: token,
                datas: formData,
                sendForm: true
            });

            console.log('Server response:', response);

            if (response && response.data && response.data.success) {
                const orderIndex = order.findIndex(o => o.idPesanan === idPesanan);
                if (orderIndex !== -1) {
                    order[orderIndex] = { ...order[orderIndex] };
                }
                window.location.reload();
            } else {
                console.error('Failed to update status:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function updateSedangDiantar(idPesanan) {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        const formData = new FormData();
        formData.append('currentDate', currentDate);
        formData.append('currentTime', currentTime);

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await ApiController({
                method: 'PUT',
                endpoint: `editSedangDiantar/${idPesanan}/${email}`,
                token: token,
                datas: formData,
                sendForm: true
            });

            console.log('Server response:', response);

            if (response && response.data && response.data.success) {
                const orderIndex = order.findIndex(o => o.idPesanan === idPesanan);
                if (orderIndex !== -1) {
                    order[orderIndex] = { ...order[orderIndex] };
                }
                window.location.reload();
            } else {
                console.error('Failed to update status:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<img src="{logo}" class="logo">
		<a href="/halamanPetugas/Profil/">
			<img src="{profil}">
		</a>
	</div><br>
	<div class="scrollable">
		<div class="card-row">
			<div class="title">Pesanan</div>
		</div>
		<div class="scrollable-x menu-bar">
		  {#each tabs as tab}
		    <div class="tab {activeTab === tab ? 'active' : ''}" on:click={() => activeTab = tab}>
		      {tab}
		    </div>
		  {/each}
		</div>
		<div class="content">
		  {#each order as pesanan}
	            {#if pesanan.statusPesanan[0].status === 'menunggu_konfirmasi' && activeTab === 'Menunggu Konfirmasi' && pesanan.statusPesanan[0].active === 'true' }
<!--                     <div class="card-info-border">
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
                            </div>
                            <div class="space-style">
                                <div class="status-text" style="text-align: right;">Menunggu Konfirmasi</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-caption" style="text-align: left;">Tanggal Pemesanan: {pesanan.statusPesanan[0].tanggal}</div>
                                <div class="card-caption" style="text-align: left;">Waktu Pemesanan: {pesanan.statusPesanan[0].waktu}</div>
                            </div>
                        </div>
                    </div> -->
                    {:else if pesanan.statusPesanan[1].status === 'menunggu_dijemput' && activeTab === 'Menunggu Dijemput' && pesanan.statusPesanan[1].active === 'true' }
                    <div class="card-info-border">
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
                            </div>
                            <div class="space-style">
                                <div class="status-text" style="text-align: right;">Menunggu Dijemput</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
                            </div>
                        </div>

                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-caption" style="text-align: left;">Waktu Menunggu Penjemputan: </div>
                                <div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[1].tanggal} |  {pesanan.statusPesanan[1].waktu}</div>
                            </div>
                            <div class="space-style">
                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        	<div class="space-style" style="text-align: right;">
                                <button type="button" on:click={() => updateJemputPesanan(pesanan)}>Jemput</button>
                            </div>
                        </div>
                    </div>
	                {:else if pesanan.statusPesanan[2].status === 'sedang_dijemput' && activeTab === 'Sedang Dijemput' && pesanan.statusPesanan[2].active === 'true' }
                    <div class="card-info-border">
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
                            </div>
                            <div class="space-style">
                                <div class="status-text" style="text-align: right;">Sedang Dijemput</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                            <div class="space-style">
                                <div class="card-caption" style="text-align: left;">Tanggal Petugas Menjemput: </div>
                                <div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[2].tanggal} | {pesanan.statusPesanan[2].waktu}</div>
                            </div>
                            <div class="space-style">
                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
                            </div>
                        </div>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        	<div class="space-style" style="text-align: right;">
                                <button type="button" on:click={openAddPesananPopup(pesanan.idPesanan, pesanan.emailPetugas)}>Tiba Di Lokasi</button>
                            </div>
                        </div>
                    </div>
	                {:else if pesanan.statusPesanan[3].status === 'diproses' && activeTab === 'Diproses' && pesanan.statusPesanan[3].active === 'true' }
                    <div class="card-info-border">
                        <a sveltekit:prefetch href="{`/halamanPetugas/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="status-text" style="text-align: right;">Diproses</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: left;">Tanggal Pesanan Diproses: </div>
                                	<div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[3].tanggal} | {pesanan.statusPesanan[3].waktu}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
	                            </div>
	                        </div>
	                    </a>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        </div>
                    </div>
                {:else if pesanan.statusPesanan[4].status === 'perlu_diantar' && activeTab === 'Perlu Diantar' && pesanan.statusPesanan[4].active === 'true' }
                    <div class="card-info-border">
                        <a sveltekit:prefetch href="{`/halamanPetugas/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="status-text" style="text-align: right;">Perlu Diantar</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: left;">Tanggal Menunggu Diantar: </div>
                                	<div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[4].tanggal} | {pesanan.statusPesanan[4].waktu}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
	                            </div>
	                        </div>
	                    </a>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        	<div class="space-style" style="text-align: right;">
                                <button type="button" on:click={updatePerluDiantar(pesanan.idPesanan)}>Antar Kembali</button>
                            </div>
                        </div>
                    </div>
                {:else if pesanan.statusPesanan[5].status === 'sedang_diantar' && activeTab === 'Sedang Diantar' && pesanan.statusPesanan[5].active === 'true' }
                    <div class="card-info-border">
                        <a sveltekit:prefetch href="{`/halamanPetugas/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="status-text" style="text-align: right;">Sedang Diantar</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: left;">Tanggal Petugas Mengantar: </div>
                                	<div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[5].tanggal} | {pesanan.statusPesanan[5].waktu}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
	                            </div>
	                        </div>
	                    </a>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        	<div class="space-style" style="text-align: right;">
                                <button type="button" on:click={updateSedangDiantar(pesanan.idPesanan)}>Pesanan Selesai</button>
                            </div>
                        </div>
                    </div>
                {:else if pesanan.statusPesanan[6].status === 'selesai' && activeTab === 'Selesai' && pesanan.statusPesanan[6].active === 'true' }
                    <div class="card-info-border">
                        <a sveltekit:prefetch href="{`/halamanPetugas/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title">{pesanan.laundryDetails?.nama || 'Loading...'}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="status-text" style="text-align: right;">Selesai</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-title-smaller">Pesanan dari {pesanan.adminDetails?.namaLaundry || 'Loading...'}</div>
	                            </div>
	                        </div>
	                        <div class="card-row-spaceless">
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: left;">Tanggal Pesanan Selesai: </div>
                                <div class="card-caption" style="text-align: left;">{pesanan.statusPesanan[6].tanggal} | {pesanan.statusPesanan[6].waktu}</div>
	                            </div>
	                            <div class="space-style">
	                                <div class="card-caption" style="text-align: right;">Petugas: {dataPetugas[0]?.nama_petugas || 'Loading...'}</div>
	                            </div>
	                        </div>
	                    </a>
                        <div class="card-row-spaceless">
                        	<div class="space-style" style="text-align: left;">
                        		<a href="javascript:void(0)" on:click={() => handleAddressMapClick(pesanan.emailUser, pesanan.alamatUser)}>Lihat Alamat</a>
                        	</div>
                        </div>
                    </div>
	            {/if}
            {/each}
		</div>
	</div>
	<br><br><br>
</div>
{#if showMap}
  <Mapbox {latitude} {longitude} on:close={closeMap} />
{/if}
{#if showAddPesananPopup}
	<TambahPesananPopup {pesananForm} {hargaPerCategory} {category} {payMethod} on:close={() => showAddPesananPopup = false } on:save={(e) => saveNewOrder(e)} />
{/if}