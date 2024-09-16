<script>
    import { onMount } from 'svelte';
    import icon from '$lib/images/logo.png';
    import profil from '$lib/images/profil-logo.png';
    import location from '$lib/images/location.png';
    import laundry from '$lib/images/laundry-pict.png';
    import category1 from '$lib/images/cuci-setrika.png';
    import category2 from '$lib/images/cuci-kering.png';
    import category3 from '$lib/images/setrika.png';
    import leftArr from '$lib/images/left-arrow.png';
    import arrow from '$lib/images/down-arrow.png';
    import Button from '$lib/components/button.svelte';
	import TambahPenilaianPopup from '$lib/components/popup/User/TambahPenilaianPopup.svelte';
    import UserNavbar from '../../UserNavbar.svelte';
    import arrowLeft from '$lib/images/left-arrow.png';
    import arrowRight from '$lib/images/right-arrow.png';
    import ApiController from '../../ApiController.js';
    import '@fontsource/montserrat';

    let tabs = ['Menunggu Konfirmasi', 'Menunggu Dijemput', 'Sedang Dijemput', 'Diproses', 'Perlu Diantar', 'Sedang Diantar', 'Selesai'];
    let activeTab = 'Menunggu Konfirmasi';
    let order = [];
    let showAddPenilaianPopup = false;
    let searchName = '';
    let searchDate = '';
    let searchTime = '';
    let scrollNumber = 0;

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

    let penilaianForm = {
    	idPesanan: '',
	    idPenilaian: '',
	    emailUser: '',
	    emailLaundry: '',
	    tanggal: '',
	    rate: 0,
	    ulasan: ''
	};

    // onMount(async () => {
    //     const token = localStorage.getItem("token");
    //     const email = localStorage.getItem("email");

    //     try {
    //         const response = await ApiController({ 
    //             method: 'GET', 
    //             endpoint: `getPesananByEmail/${email}`,
    //             token: token
    //         });

    //         if (response && response.data && response.data.success) {
    //             order = response.data.orders;
    //             for (let i = 0; i < order.length; i++) {
    //                 const emailLaundry = order[i].emailLaundry;
    //                 await getLaundryDetails(emailLaundry, i);
    //                 if (order[i].emailPetugas) {
    //                     await getPetugasDetails(order[i].emailPetugas, i);
    //                 }
    //             }
    //             console.log(order);
    //         } else {
    //             console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching orders:', error);
    //     }

    //     try {
    //         const response = await ApiController({ 
    //             method: 'GET', 
    //             endpoint: `getPenilaian`, 
    //             token: token
    //         });

    //         if (response && response.data && response.data.success) {
		  //       let rate = response.data.rates;
		  //       if (rate.length > 0) {
		  //         const lastUserId = rate
		  //           .map(user => parseInt(user.idPenilaian))
		  //           .sort((a, b) => a - b)
		  //           .pop();
		  //         const incrementedId = lastUserId + 1;
		  //         penilaianForm.idPenilaian = incrementedId.toString();
		  //       } else {
		  //         penilaianForm.idPenilaian = '1';
		  //       }
		  //     } else {
    //             console.error('Failed to fetch rates:', response ? response.data.error : 'No response from server');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching rates:', error);
    //     }
    // });

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        // try {
        //     const response = await ApiController({ 
        //         method: 'GET', 
        //         endpoint: `getPesananByEmail/${email}`,
        //         token: token
        //     });

        //     if (response && response.data && response.data.success) {
        //         order = response.data.orders;

        //         order.sort((a, b) => {
        //             const dateTimeA = new Date(`${a.statusPesanan[0].tanggal} ${a.statusPesanan[0].waktu}`);
        //             const dateTimeB = new Date(`${b.statusPesanan[0].tanggal} ${b.statusPesanan[0].waktu}`);
        //             return dateTimeB - dateTimeA;
        //         });

        //         for (let i = 0; i < order.length; i++) {
        //             const emailLaundry = order[i].emailLaundry;
        //             await getLaundryDetails(emailLaundry, i);
        //             if (order[i].emailPetugas) {
        //                 await getPetugasDetails(order[i].emailPetugas, i);
        //             }
        //         }
        //         console.log(order);
        //     } else {
        //         console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
        //     }
        // } catch (error) {
        //     console.error('Error fetching orders:', error);
        // }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmail/${email}`,
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
                    const emailLaundry = order[i].emailLaundry;
                    await getLaundryDetails(emailLaundry, i);
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
                endpoint: `getPenilaian`, 
                token: token
            });

            if (response && response.data && response.data.success) {
                let rate = response.data.rates;
                if (rate.length > 0) {
                    const lastUserId = rate
                        .map(user => parseInt(user.idPenilaian))
                        .sort((a, b) => a - b)
                        .pop();
                    const incrementedId = lastUserId + 1;
                    penilaianForm.idPenilaian = incrementedId.toString();
                } else {
                    penilaianForm.idPenilaian = '1';
                }
            } else {
                console.error('Failed to fetch rates:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
        }
    });

    async function getLaundryDetails(email, index) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAdminEmail/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const admin = response.data.admin;
                order[index] = { ...order[index], laundryDetails: admin };
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
	            order[index] = { ...order[index], petugasDetails: petugas };
            } else {
                console.error('Failed to fetch petugas details:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching petugas details:', error);
        }
    }

    function handleClick(event, email) {
	    console.log('Clicked Laundry Email:', email);
	}

	async function openAddPenilaianPopup(idPesanan, emailLaundry, emailUser) {
	  	
	  	penilaianForm.idPesanan = idPesanan;
	  	penilaianForm.emailLaundry = emailLaundry;
	  	penilaianForm.emailUser = emailUser;
	  	console.log(penilaianForm.emailLaundry);
	  	console.log(penilaianForm.emailUser);
	  	showAddPenilaianPopup = true;
	}

    async function saveNewRate(newPenilaian) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    const now = new Date();
        const currentDate = now.toISOString().split('T')[0];

	    const formData = new FormData();
		formData.append('idPenilaian', newPenilaian.idPenilaian);
		formData.append('emailLaundry', newPenilaian.emailLaundry);
	    formData.append('emailUser', newPenilaian.emailUser);
	    formData.append('tanggal', currentDate);
	    formData.append('rate', newPenilaian.rate);
	    formData.append('ulasan', newPenilaian.ulasan);

	    for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        console.log(newPenilaian.idPesanan);

	    try {
	      const response = await ApiController({ 
	      	method: 'POST', 
	      	endpoint: `addPenilaian`, 
	      	datas: formData 
	      });
	      if (response.data.success) {
	      	showAddPenilaianPopup = false;
	      	try {
                const updateResponse = await ApiController({
                    method: 'PUT',
                    endpoint: `isRated/${newPenilaian.idPesanan}/${email}`,
                    token: token
                });

                if (updateResponse.data.success) {
                    showAddPenilaianPopup = false;
                }
            } catch (updateError) {
                console.error('Error updating status:', updateError);
            }
            alert('Penilaian Berhasil Ditambahkan!')
	        window.location.reload();
	      } else {
	        alert('Terjadi kesalahan saat data ditambahkan: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error adding penilaian:', error);
	      alert('Terjadi kesalahan saat data ditambahkan');
	    }
	}

    function filteredOrders() {
        return order.filter(pesanan => {
            const matchesName = searchName ? pesanan.laundryDetails?.namaLaundry?.toLowerCase().includes(searchName.toLowerCase()) : true;
            const matchesDate = searchDate ? pesanan.statusPesanan.some(status => status.tanggal === searchDate) : true;
            const matchesTime = searchTime ? pesanan.statusPesanan.some(status => status.waktu === searchTime) : true;

            return matchesName && matchesDate && matchesTime;
        });
    }

</script>

<svelte:head>
    <title>LaundryLab</title>
    <meta name="description" content="Halaman Pesanan" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
    <div class="scrollable">
        <div class="header" style="align-items: center;">
            <div class="title-center">
                <a href="/halamanUser">
                    <img src="{leftArr}" alt="back" class="back-arrow" />
                </a>
                Pesanan Saya
            </div>
        </div>
        <br>
        <div>
            <input type="text" placeholder="Cari Laundry" bind:value={searchName} style="width: 225px;" />
            <input type="date" placeholder="Search by Date" bind:value={searchDate} style="width: 175px;" />
        </div>
        <div class="card-row-end">
            <div class="next-previous-button">
               <img src="{arrowLeft}" class="icon-next-previous-backless" alt="arrow1" on:click={() => {
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
                <img src="{arrowRight}" class="icon-next-previous-backless" alt="arrow2" on:click={() => {
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
            {#if searchName == "" && searchDate == ""}
                {#each order as pesanan}
                    {#if pesanan.statusPesanan[0].status === 'menunggu_konfirmasi' && activeTab === 'Menunggu Konfirmasi' && pesanan.statusPesanan[0].active === 'true' }
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </div>
                        </div>
                    {:else if pesanan.statusPesanan[1].status === 'menunggu_dijemput' && activeTab === 'Menunggu Dijemput' && pesanan.statusPesanan[1].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                    </a>
                    {:else if pesanan.statusPesanan[2].status === 'sedang_dijemput' && activeTab === 'Sedang Dijemput' && pesanan.statusPesanan[2].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Sedang Dijemput</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">Tanggal Petugas Menjemput: </div>
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">W{pesanan.statusPesanan[2].tanggal} | {pesanan.statusPesanan[2].waktu}</div>
                                </div>
                                <div class="space-style">
    			                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
    			                </div>
                            </div>
                        </div>
                    </a>
                    {:else if pesanan.statusPesanan[3].status === 'diproses' && activeTab === 'Diproses' && pesanan.statusPesanan[3].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Diproses</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">Tanggal Pesanan Diproses: </div>
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[3].tanggal} | {pesanan.statusPesanan[3].waktu}</div>
                                </div>
                                <div class="space-style">
    			                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
    			                </div>
                            </div>
                        </div>
                    </a>
                    {:else if pesanan.statusPesanan[4].status === 'perlu_diantar' && activeTab === 'Perlu Diantar' && pesanan.statusPesanan[4].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                		{#if pesanan.isRated === 'true'}
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                                <div class="card-row-spaceless">
                                    <div class="space-style">
                                        <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </a>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <div class="status-text" style="text-align: right;">Sudah Dinilai</div>
                                </div>
                            </div>
                        </div>
                        {:else}
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                                <div class="card-row-spaceless">
                                    <div class="space-style">
                                        <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </a>
                            <div class="card-row-spaceless">
                            	<div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={openAddPenilaianPopup(pesanan.idPesanan, pesanan.emailLaundry, pesanan.emailUser)}>Beri Penilaian</button>
                                </div>
                            </div>
                        </div>
                        {/if}

                    {:else if pesanan.statusPesanan[7].status === 'gagal' && activeTab === 'Gagal' && pesanan.statusPesanan[7].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Gagal</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;">Pesanan Gagal</div>
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
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </div>
                        </div>
                    {:else if pesanan.statusPesanan[1].status === 'menunggu_dijemput' && activeTab === 'Menunggu Dijemput' && pesanan.statusPesanan[1].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                    </a>
                    {:else if pesanan.statusPesanan[2].status === 'sedang_dijemput' && activeTab === 'Sedang Dijemput' && pesanan.statusPesanan[2].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Sedang Dijemput</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">Tanggal Petugas Menjemput: </div>
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">W{pesanan.statusPesanan[2].tanggal} | {pesanan.statusPesanan[2].waktu}</div>
                                </div>
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                </div>
                            </div>
                        </div>
                    </a>
                    {:else if pesanan.statusPesanan[3].status === 'diproses' && activeTab === 'Diproses' && pesanan.statusPesanan[3].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Diproses</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">Tanggal Pesanan Diproses: </div>
                                    <div class="card-caption" style="text-align: left;font-weight: bold; color: #2a6c72;">{pesanan.statusPesanan[3].tanggal} | {pesanan.statusPesanan[3].waktu}</div>
                                </div>
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: right;">Petugas: {pesanan.petugasDetails ? (pesanan.petugasDetails[0]?.nama_petugas || 'Loading...') : 'Loading...'}</div>
                                </div>
                            </div>
                        </div>
                    </a>
                    {:else if pesanan.statusPesanan[4].status === 'perlu_diantar' && activeTab === 'Perlu Diantar' && pesanan.statusPesanan[4].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                        {#if pesanan.isRated === 'true'}
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                                <div class="card-row-spaceless">
                                    <div class="space-style">
                                        <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </a>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <div class="status-text" style="text-align: right;">Sudah Dinilai</div>
                                </div>
                            </div>
                        </div>
                        {:else}
                        <div class="card-info-border">
                            <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                                <div class="card-row-spaceless">
                                    <div class="space-style">
                                        <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
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
                            </a>
                            <div class="card-row-spaceless">
                                <div class="space-style" style="text-align: right;">
                                    <button type="button" on:click={openAddPenilaianPopup(pesanan.idPesanan, pesanan.emailLaundry, pesanan.emailUser)}>Beri Penilaian</button>
                                </div>
                            </div>
                        </div>
                        {/if}

                    {:else if pesanan.statusPesanan[7].status === 'gagal' && activeTab === 'Gagal' && pesanan.statusPesanan[7].active === 'true' }
                    <a sveltekit:prefetch href="{`/halamanUser/Pesanan/DetailPesanan/${pesanan.idPesanan}`}" on:click={(event) => handleClick(event, pesanan.idPesanan)}>
                        <div class="card-info-border">
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-title">{pesanan.laundryDetails?.namaLaundry || 'Loading...'}</div>
                                </div>
                                <div class="space-style">
                                    <div class="status-text" style="text-align: right;">Gagal</div>
                                </div>
                            </div>
                            <div class="card-row-spaceless">
                                <div class="space-style">
                                    <div class="card-caption" style="text-align: left;">Pesanan Gagal</div>
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
        <br><br>
        <br><br>
    </div>
    <UserNavbar />
</div>
{#if showAddPenilaianPopup}
	<TambahPenilaianPopup {penilaianForm} on:close={() => showAddPenilaianPopup = false } on:save={(e) => saveNewRate(e.detail)} />
{/if}
