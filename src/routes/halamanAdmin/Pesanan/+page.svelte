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
    import arrowLeft from '$lib/images/left-arrow.png';
    import arrowRight from '$lib/images/right-arrow.png';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../ApiController.js';
	import AdminNavbar from '../../AdminNavbar.svelte';
	import '@fontsource/montserrat';

	let tabs = ['Menunggu Konfirmasi', 'Menunggu Dijemput', 'Sedang Dijemput', 'Diproses', 'Perlu Diantar', 'Sedang Diantar', 'Selesai'];
  	let activeTab = 'Menunggu Konfirmasi';
  	let order = [];
  	let dataPetugas = [];
  	let selectedPetugas = '';
    let searchName = '';
    let searchDate = '';
    let searchTime = '';
    let scrollNumber = 0;

  	let form = {
        nama: '',
        notelp: '',
        email: '',
        profilPict: ''
    };

    let petugasForm = {
        nama: '',
        notelp: '',
        email: '',
        profilPict: ''
    };

    let pesananForm = {
        idPesanan: '',
        emailLaundry: '',
        emailUser: '',
        emailPetugas: '',
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

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmailLaundry/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                order = response.data.orders;

                const currentDate = new Date();
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(currentDate.getMonth() - 1);

                order = order.filter(pesanan => {
                    const statusAtIndex6 = pesanan.statusPesanan[6] || {};
                    const isActive = statusAtIndex6.active === 'true';
                    const orderDate = new Date(`${statusAtIndex6.tanggal} ${statusAtIndex6.waktu}`);

                    return !(isActive && orderDate < oneMonthAgo);
                });

                order.sort((a, b) => {
                    const dateTimeA = new Date(`${a.statusPesanan[0]?.tanggal} ${a.statusPesanan[0]?.waktu}`);
                    const dateTimeB = new Date(`${b.statusPesanan[0]?.tanggal} ${b.statusPesanan[0]?.waktu}`);
                    return dateTimeB - dateTimeA;
                });

                for (let i = 0; i < order.length; i++) {
                    const emailUser = order[i].emailUser;
                    await getLaundryDetails(emailUser, i);
                    if (order[i].emailPetugas) {
                        await getPetugasDetails(order[i].emailPetugas, i);
                    }
                }

                console.log(order);
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPetugas/${email}`,
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
                order[index] = { ...order[index], laundryDetails: pelanggan };
                console.log("Updated order:", order[index]);
            } else {
                console.error('Failed to fetch admin details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    }

    async function getPetugasDetails(email, index) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getPetugasByEmail/${email}`,
                token: token
            });

	        if (response && response.data && response.data.success) {
                const petugas = response.data.users;
	            order[index] = { ...order[index], petugasDetails: petugas }; // Correct the index here
	            console.log(order[index]);
	            console.log(petugas);
	            console.log(email);
            } else {
                console.error('Failed to fetch petugas details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching petugas details:', error);
        }
    }

	async function setPetugas(pesanan) {
	    const token = localStorage.getItem("token");

	    // const selectedPetugasObj = dataPetugas.find(p => p.nama_petugas === selectedPetugas);

	    const selectedPetugasObj = dataPetugas.find(p => p.nama_petugas === pesanan.selectedPetugas);

	    if (!selectedPetugasObj) {
	        console.error('Selected petugas not found');
	        return;
	    }

	    let email_petugas = selectedPetugasObj.email_petugas;

	    const now = new Date();
	    const currentDate = now.toISOString().split('T')[0];
	    const currentTime = now.toTimeString().split(' ')[0];

	    const formData = new FormData();
	    formData.append('emailPetugas', email_petugas);
	    formData.append('currentDate', currentDate);
	    formData.append('currentTime', currentTime);

	    console.log('Tanggal:', currentDate);
	    console.log('Waktu:', currentTime);

	    for (let [key, value] of formData.entries()) {
	        console.log(key, value);
	    }
        console.log(pesanan.idPesanan);
        console.log(pesanan.emailLaundry);

	    try {
	        const response = await ApiController({
	            method: 'PUT',
	            endpoint: `editKonfirmasi/${pesanan.idPesanan}/${pesanan.emailLaundry}`,
                // endpoint: `editKonfirmasi/${pesanan.idPesanan}`,
	            token: token,
	            datas: formData,
	            sendForm: true
	        });

	        console.log('Server response:', response);

	        if (response && response.data && response.data.success) {
	        	const orderIndex = order.findIndex(o => o.idPesanan === pesanan.idPesanan);
	            if (orderIndex !== -1) {
	                order[orderIndex] = { ...order[orderIndex], emailPetugas: email_petugas, petugasDetails: selectedPetugasObj };
	            }
	            window.location.reload();
                console.log(response.data);
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
	        } else {
	            console.error('Failed to update status:', response ? response.data.error : 'No response from server');
	        }
	    } catch (error) {
	        console.error('Error updating status:', error);
	    }
	}

    function handleClick(event, email) {
        console.log('Clicked Laundry Email:', email);
    }

    async function updateDiproses(pesanan) {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

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
                endpoint: `editDiproses/${pesanan.idPesanan}/${email}`,
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

    // function filteredOrders() {
    //     return order.filter(pesanan => {
    //         // const matchesName = searchName ? pesanan.petugasDetails?.nama_petugas?.toLowerCase().includes(searchName.toLowerCase()) : true;
    //         const matchesName = searchName ? (
    //             pesanan.petugasDetails[0]?.nama_petugas?.toLowerCase().includes(searchName.toLowerCase()) || 
    //             pesanan.laundryDetails?.nama?.toLowerCase().includes(searchName.toLowerCase())
    //           ) : true;
    //         const matchesDate = searchDate ? pesanan.statusPesanan.some(status => status.tanggal === searchDate) : true;
    //         const matchesTime = searchTime ? pesanan.statusPesanan.some(status => status.waktu === searchTime) : true;

    //         return matchesName && matchesDate && matchesTime;
    //     });
    // }

    function filteredOrders() {
        return order.filter(pesanan => {
            // const matchesName = searchName ? (
            //     pesanan.petugasDetails?.some(petugas => 
            //         petugas.nama_petugas?.toLowerCase().includes(searchName.toLowerCase())
            //     ) || 
            //     pesanan.laundryDetails?.nama?.toLowerCase().includes(searchName.toLowerCase())
            // ) : true;
            const matchesName = searchName ? pesanan.laundryDetails?.nama?.toLowerCase().includes(searchName.toLowerCase()) : true;
            const matchesDate = searchDate ? pesanan.statusPesanan.some(status => status.tanggal === searchDate) : true;
            const matchesTime = searchTime ? pesanan.statusPesanan.some(status => status.waktu === searchTime) : true;

            return matchesName && matchesDate && matchesTime;
        });
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
		<img src="{profil}">
	</div><br>
	<div class="scrollable">
		<div class="card-row">
			<div class="title">Pesanan</div>
		</div>
        <div>
            <input type="text" placeholder="Cari Pelanggan" bind:value={searchName} style="width: 225px;" />
            <input type="date" placeholder="Search by Date" bind:value={searchDate} style="width: 175px;" />
        </div>
        <div class="card-row-end">
            <div class="next-previous-button">
               <img src="{arrowLeft}" class="icon-next-previous-backless" on:click={() => {
                    let scrollElem = document.getElementById("scroll");
                    if (scrollNumber > 0) {
                         scrollNumber -= 100;
                         console.log(scrollNumber)
                         scrollElem.scrollBy({
                            left: -100,
                            behavior: 'smooth'
                        });
                    }
                }}>
                <img src="{arrowRight}" class="icon-next-previous-backless" on:click={() => {
                    let scrollElem = document.getElementById("scroll");
                    scrollNumber += 100;
                    console.log(scrollNumber)
                    scrollElem.scrollBy({
                        left: 100,
                        behavior: 'smooth'
                    });
                }}>
            </div>
        </div>
		<div class="scrollable-x menu-bar" id="scroll">
		  {#each tabs as tab}
		    <div class="tab {activeTab === tab ? 'active' : ''}" on:click={() => activeTab = tab}>
		      {tab}
		    </div>
		  {/each}
		</div>
		<div class="content">
            {#if searchName == "" && searchDate == "" && searchTime == ""}
                {#each order as pesanan}
                	<!-- {#if activeTab === 'Semua'}
                		<div class="card-info-border">
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
                                <select bind:value={selectedPetugas} class="dropdown-style" style="width:150px">
    						        <option disabled selected value="">Pilih Petugas</option>
    						        {#each dataPetugas as petugas}
    						          <option value={petugas.nama_petugas}>{petugas.nama_petugas}</option>
    						        {/each}
    						    </select>
                            </div>
                            <div class="card-row-spaceless">
                            	<div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={() => setPetugas(pesanan)}>Set Petugas</button>
                                </div>
                            </div>
                            
                        </div> -->
    	            {#if pesanan.statusPesanan[0].status === 'menunggu_konfirmasi' && activeTab === 'Menunggu Konfirmasi' && pesanan.statusPesanan[0].active === 'true' }
                        <div class="card-info-border">
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
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Waktu Pemesanan: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[0].tanggal} | {pesanan.statusPesanan[0].waktu}</div>
                                </div>
    <!--                             <select bind:value={selectedPetugas} class="dropdown-style" style="width:150px">
    						        <option disabled selected value="">Pilih Petugas</option>
    						        {#each dataPetugas as petugas}
    						          <option value={petugas.nama_petugas}>{petugas.nama_petugas}</option>
    						        {/each}
    						    </select> -->
    						    <select bind:value={pesanan.selectedPetugas} class="dropdown-style" style="width:150px">
    						        <option disabled selected value="">Pilih Petugas</option>
    						        {#each dataPetugas as petugas}
    						            <option value={petugas.nama_petugas}>{petugas.nama_petugas}</option>
    						        {/each}
    						    </select>
                            </div>
                            <div class="card-row-spaceless">
                            	<div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={() => setPetugas(pesanan)}>Set Petugas</button>
                                </div>
                            </div>
                        </div>
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
    			                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Waktu Menunggu Penjemputan: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[1].tanggal} |  {pesanan.statusPesanan[1].waktu}</div>
    			                </div>
    			                <div class="space-style">
    			                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
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
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Petugas Menjemput: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">W{pesanan.statusPesanan[2].tanggal} | {pesanan.statusPesanan[2].waktu}</div>
                                </div>
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                </div>
                            </div>
                        </div>
                        {:else if pesanan.statusPesanan[3].status === 'diproses' && activeTab === 'Diproses' && pesanan.statusPesanan[3].active === 'true' }
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Pesanan Diproses: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[3].tanggal} | {pesanan.statusPesanan[3].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </a>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={() => updateDiproses(pesanan)}>Selesai Diproses</button>
                                </div>
                            </div>
                        </div>
                        {:else if pesanan.statusPesanan[4].status === 'perlu_diantar' && activeTab === 'Perlu Diantar' && pesanan.statusPesanan[4].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Menunggu Diantar: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[4].tanggal} | {pesanan.statusPesanan[4].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        {:else if pesanan.statusPesanan[5].status === 'sedang_diantar' && activeTab === 'Sedang Diantar' && pesanan.statusPesanan[5].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Petugas Mengantar: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[5].tanggal} | {pesanan.statusPesanan[5].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        {:else if pesanan.statusPesanan[6].status === 'selesai' && activeTab === 'Selesai' && pesanan.statusPesanan[6].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Pesanan Selesai: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[6].tanggal} | {pesanan.statusPesanan[6].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
    	            {/if}
                {/each}
            {:else}
                {#each filteredOrders() as pesanan}
                    {#if pesanan.statusPesanan[0].status === 'menunggu_konfirmasi' && activeTab === 'Menunggu Konfirmasi' && pesanan.statusPesanan[0].active === 'true' }
                        <div class="card-info-border">
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
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Waktu Pemesanan: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[0].tanggal} | {pesanan.statusPesanan[0].waktu}</div>
                                </div>
    <!--                             <select bind:value={selectedPetugas} class="dropdown-style" style="width:150px">
                                    <option disabled selected value="">Pilih Petugas</option>
                                    {#each dataPetugas as petugas}
                                      <option value={petugas.nama_petugas}>{petugas.nama_petugas}</option>
                                    {/each}
                                </select> -->
                                <select bind:value={pesanan.selectedPetugas} class="dropdown-style" style="width:150px">
                                    <option disabled selected value="">Pilih Petugas</option>
                                    {#each dataPetugas as petugas}
                                        <option value={petugas.nama_petugas}>{petugas.nama_petugas}</option>
                                    {/each}
                                </select>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={() => setPetugas(pesanan)}>Set Petugas</button>
                                </div>
                            </div>
                        </div>
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
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Waktu Menunggu Penjemputan: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[1].tanggal} |  {pesanan.statusPesanan[1].waktu}</div>
                                </div>
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
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
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Petugas Menjemput: </div>
                                    <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">W{pesanan.statusPesanan[2].tanggal} | {pesanan.statusPesanan[2].waktu}</div>
                                </div>
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                </div>
                            </div>
                        </div>
                        {:else if pesanan.statusPesanan[3].status === 'diproses' && activeTab === 'Diproses' && pesanan.statusPesanan[3].active === 'true' }
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Pesanan Diproses: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[3].tanggal} | {pesanan.statusPesanan[3].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </a>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={() => updateDiproses(pesanan)}>Selesai Diproses</button>
                                </div>
                            </div>
                        </div>
                        {:else if pesanan.statusPesanan[4].status === 'perlu_diantar' && activeTab === 'Perlu Diantar' && pesanan.statusPesanan[4].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Menunggu Diantar: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[4].tanggal} | {pesanan.statusPesanan[4].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        {:else if pesanan.statusPesanan[5].status === 'sedang_diantar' && activeTab === 'Sedang Diantar' && pesanan.statusPesanan[5].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Petugas Mengantar: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[5].tanggal} | {pesanan.statusPesanan[5].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        {:else if pesanan.statusPesanan[6].status === 'selesai' && activeTab === 'Selesai' && pesanan.statusPesanan[6].active === 'true' }
                        <a sveltekit:prefetch href="{`/halamanAdmin/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                            <div class="card-info-border">
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
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">Tanggal Pesanan Selesai: </div>
                                        <div class="card-caption" style="text-align: left; font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[6].tanggal} | {pesanan.statusPesanan[6].waktu}</div>
                                    </div>
                                    <div class="space-style">
                                        <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/if}
                {/each}
            {/if}
        </div>
	</div>
	<br><br><br>
	<AdminNavbar />
</div>