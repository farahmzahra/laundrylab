<script>
	import { onMount } from 'svelte';
	import logo from '$lib/images/logo-admin.png';
	import notif from '$lib/images/notification.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
    import disableStar from '$lib/images/gray-star.png';
	import star from '$lib/images/star-review.png';
	import ApiController from '../ApiController.js';
	import AdminNavbar from '../AdminNavbar.svelte';
	import TambahPetugasPopup from '$lib/components/popup/Admin/Petugas/TambahPetugasPopup.svelte';
	import EditPetugasPopup from '$lib/components/popup/Admin/Petugas/EditPetugasPopup.svelte';
	import TambahKategoriPopup from '$lib/components/popup/Admin/Kategori/TambahKategoriPopup.svelte';
	import EditKategoriPopup from '$lib/components/popup/Admin/Kategori/EditKategoriPopup.svelte';
	import '@fontsource/montserrat';

    let authRole = 'admin'

	let files;
    let users = [];
    let categories = [];
    let allRates = [];
    let allNotifs = [];
    let showAddPetugasPopup = false;
    let showEditPetugasPopup = false;
    let showAddKategoriPopup = false;
    let showEditKategoriPopup = false;

    let form = {
		id_petugas: '',
        nama_petugas: '',
        notelp_petugas: '',
        email_petugas: '',
        password_petugas: '',
        profil_petugas: '',
        upload_path: '/Users/macbook/laundrylab/static/uploads'
    };

    let kategoriForm = {
	    idKategori: '',
	    emailLaundry: '',
	    categoryType: '',
	    categoryName: '',
	    harga: '',
	    keterangan: ''
	};

    onMount(async () => {
        const storedRole = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        
        if (!storedRole || storedRole !== authRole) {
            window.location.href = '/';
        } 
        // else {
        //     console.log('Local storage has valid email.');
        // }

        const token = localStorage.getItem('token');
        const adminEmail = localStorage.getItem('email');

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPetugas/${adminEmail}`, 
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

        try {
	        const response = await ApiController({
	            method: 'GET',
	            endpoint: `getKategori/${email}`,
	            token: token
	        });

	        if (response && response.data && response.data.success) {
	            categories = response.data.categories;
	            console.log(categories);  // Log the fetched categories for debugging
	            if (categories.length > 0) {
	                const lastUserId = categories
	                    .map(user => parseInt(user.idKategori))
	                    .sort((a, b) => a - b)
	                    .pop();
	                const incrementedId = lastUserId + 1;
	                kategoriForm.idKategori = incrementedId.toString();
	            } else {
	                kategoriForm.idKategori = '1';
	            }
	        } else {
	            console.error('Failed to fetch categories:', response ? response.data.error : 'No response from server');
	        }
	    } catch (error) {
	        console.error('Error fetching categories:', error);
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

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getNotifByEmailLaundry/${email}`,
                token: token
            });

            console.log('API Response:', response);

            if (response && response.data && response.data.success) {
                allNotifs = response.data.notifs;
                console.log(allNotifs);
            } else {
                console.error('Failed to fetch notification:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching notification:', error);
        }
    });

	async function saveNewPetugas(newPetugas) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    const formData = new FormData();
	    formData.append('id_petugas', form.id_petugas);
	    formData.append('emailLaundry', email);
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

	    // for (let [key, value] of formData.entries()) {
	    //     console.log(key, value);
	    // }

	    try {
	      const response = await ApiController({ 
	      	method: 'POST', 
	      	endpoint: `petugasRegister/${email}`,
	      	datas: formData 
	      });
	      console.log('API Response:', response);
	      if (response.data.success) {
	      	showAddPetugasPopup = false;
	        alert('Data Berhasil Ditambahkan!');
	        window.location.reload();
	      } else {
	      	showAddPetugasPopup = false;
	        alert('Terjadi kesalahan saat data ditambahkan: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error adding petugas:', error);
	      alert('Terjadi kesalahan saat data ditambahkan');
	    }
	  }

	  async function EditPetugas(newPetugas) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    try {
	    	const formData = new FormData();
		    formData.append('nama_petugas', form.nama_petugas);
		    formData.append('notelp_petugas', form.notelp_petugas);
		    formData.append('password_petugas', form.password_petugas);
		    formData.append('upload_path', form.upload_path);

	        if (form.profil_petugas) {
	            formData.append('profil_petugas', form.profil_petugas);
	        }

		      const response = await ApiController({ 
		      	method: 'PUT', 
		      	endpoint: `updatePetugas/${newPetugas.id_petugas}/${email}`,

		      	token: token,
		      	datas: formData, 
		      	sendForm: true 
		      });``
		      console.log('API Response:', response);

		      if (response && response.data && response.data.success) {
		      	showEditPetugasPopup = false;
		      	form = { ...form, ...newPetugas };
		        alert('Data Berhasil Diperbarui!');
		        window.location.reload();
		      } else {
		      	showEditPetugasPopup = false;
		        alert('Terjadi kesalahan saat data diperbaruis: ' + (response.data.error || 'Unknown error'));
		      }
		    } catch (error) {
		      console.error('Error updating petugas:', error);
		      alert('Terjadi kesalahan saat data diperbarui');
		    }
	  	}

	async function handlePetugasClick(id_petugas) {
    	showEditPetugasPopup = true;
  		await fetchPetugasDetails(id_petugas);
  	}

    async function fetchPetugasDetails(id_petugas) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getPetugasId/${id_petugas}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const petugas = response.data.petugas;
                if (petugas) {
                	form = { ...form, ...petugas };
                }
                console.log(form.profil_petugas);
            } else {
                console.error('Failed to fetch petugas:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching petugas:', error);
        }
	}

	async function deletePetugas(id_petugas) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'DELETE',
                endpoint: `deletePetugas/${id_petugas}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alert('Data Berhasil Dihapus');
                window.location.reload();
                users = users.filter(user => user.id_petugas !== id_petugas);
            } else {
                console.error('Failed to delete petugas:', response ? response.data.error : 'No response from server');
                alert('Terjadi kesalahan saat data dihapus');
            }
        } catch (error) {
            console.error('Error deleting petugas:', error);
            alert('Terjadi kesalahan saat data dihapus');
        }
    }

    async function saveNewKategori(newKategori) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    const formData = new FormData();
	    formData.append('idKategori', kategoriForm.idKategori);
	    formData.append('emailLaundry', email);
	    formData.append('categoryType', kategoriForm.categoryType);
	    formData.append('categoryName', kategoriForm.categoryName);
	    formData.append('harga', kategoriForm.harga);
	    formData.append('keterangan', kategoriForm.keterangan);

	    try {
	      const response = await ApiController({ 
	      	method: 'POST', 
	      	endpoint: `addKategori/${email}`, 
	      	datas: formData 
	      });
	      console.log('API Response:', response);
	      if (response.data.success) {
	      	console.log(formData);
	      	showAddKategoriPopup = false;
	        alert('Data Berhasil Ditambahkan!');
	        window.location.reload();
	      } else {
	      	showAddKategoriPopup = false;
	        alert('Terjadi kesalahan saat data ditambahkan: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error adding kategori:', error);
	      alert('Terjadi kesalahan saat data ditambahkan');
	    }
	  }

	  async function EditKategori(newKategori) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    try {
	    	const formData = new FormData();
		    formData.append('categoryType', kategoriForm.categoryType);
		    formData.append('categoryName', kategoriForm.categoryName);
		    formData.append('harga', kategoriForm.harga);
		    formData.append('keterangan', kategoriForm.keterangan);

		      const response = await ApiController({ 
		      	method: 'PUT', 
		      	endpoint: `editKategori/${newKategori.idKategori}/${email}`,
		      	token: token,
		      	datas: formData, 
		      	sendForm: true 
		      });
		      console.log('API Response:', response);

		      if (response && response.data && response.data.success) {
		      	showEditKategoriPopup = false;
		      	kategoriForm = { ...kategoriForm, ...newKategori };
		        alert('Data Berhasil Diperbarui!');
		        window.location.reload();
		      } else {
		      	showEditKategoriPopup = false;
		        alert('Terjadi kesalahan saat data diperbarui: ' + (response.data.error || 'Unknown error'));
		      }
		    } catch (error) {
		      console.error('Error updating kategori:', error);
		      alert('Terjadi kesalahan saat data diperbarui');
		    }
	  	}

	async function handleKategoriClick(idKategori) {
    	showEditKategoriPopup = true;
  		await fetchKategoriDetails(idKategori);
  	}

    async function fetchKategoriDetails(idKategori) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getKategoriId/${idKategori}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const kategori = response.data.kategori;
                if (kategori) {
                	kategoriForm = { ...kategoriForm, ...kategori };
                }
            } else {
                console.error('Failed to fetch kategori:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching kategori:', error);
        }
	}

	async function deleteKategori(idKategori) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'DELETE',
                endpoint: `deleteKategori/${idKategori}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alert('Data Berhasil Dihapus');
                categories = categories.filter(user => user.idKategori !== idKategori);
                window.location.reload();
            } else {
                console.error('Failed to delete kategori:', response ? response.data.error : 'No response from server');
                alert('Terjadi kesalahan saat data diperbarui');
            }
        } catch (error) {
            console.error('Error deleting kategori:', error);
            alert('Terjadi kesalahan saat data diperbarui');
        }
    }

    function censorName(name) {
        if (name.length <= 2) {
            return name;
        }
        return name.substring(0, 2) + '*'.repeat(name.length - 3);
    }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="Halaman Beranda" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<img src="{logo}" class="logo" alt="Logo">
	</div>
	<div class="scrollable">
		<br>
		<div class="card-row">
			<div class="title">Kategori</div>
			<a href="javascript:void(0)" on:click={() => showAddKategoriPopup = true}><div class="sub-title">Tambah</div></a>
		</div>
		<!-- {#if categories.length > 0}
			{#each categories as user}
				{#if user.categoryType === 'cuci_kering'}
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">Cuci Kering</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{:else if user.categoryType === 'cuci_setrika_reguler' }
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">Cuci Setrika Reguler</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{:else if user.categoryType === 'cuci_setrika_kilat' }
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">Cuci Setrika Kilat</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{:else if user.categoryType === 'cuci_bedcover_selimut' }
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">Cuci Bed Cover dan Selimut</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{:else if user.categoryType === 'setrika' }
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">Setrika</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{:else if user.categoryType === 'lainnya' }
					<div class="card-info-border">
						<div class="card-row-spaceless">
							<div class="space-style">
								<div class="card-title">{user.categoryName}</div>
							</div>
							<div class="space-style">
								<div class="card-caption"></div>
							</div>
						</div>
						<div class="card-row-spaceless">
				            <div class="space-style">
				                <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {user.harga}</div>
				                <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {user.keterangan}</div>
				            </div>
				            <div class="space-style">
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handleKategoriClick(user.idKategori)}>Ubah</a>

				                </div>
				                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deleteKategori(user.idKategori)}>Hapus</a></div>
				            </div>
				        </div>
					</div>
				{/if}
			{/each}
		{:else}
			<p>No data</p>
		{/if} -->
		{#if categories.length > 0}
		    {#each categories as category}
		        <div class="card-info-border">
		            <div class="card-row-spaceless">
		                <div class="space-style">
		                    <div class="card-title">{category.categoryName}</div>
		                </div>
		                <div class="space-style">
		                    <div class="card-caption"></div>
		                </div>
		            </div>
		            <div class="card-row-spaceless">
		                <div class="space-style">
		                    <div class="card-caption" style="text-align: left;">Harga&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {category.harga}</div>
		                    <div class="card-caption" style="text-align: left;">Keterangan&nbsp;&nbsp;: {category.keterangan}</div>
		                </div>
		                <div class="space-style">
		                    <div class="card-title-secondary" style="text-align: right;">
		                        <a href="javascript:void(0)" on:click={() => handleKategoriClick(category.idKategori)}>Ubah</a>
		                    </div>
		                    <div class="card-title-secondary" style="text-align: right;">
		                        <a href="javascript:void(0)" on:click={() => deleteKategori(category.idKategori)}>Hapus</a>
		                    </div>
		                </div>
		            </div>
		        </div>
		    {/each}
		{:else}
		    <p>Belum ada Data</p>
		{/if}
		<div class="card-row">
			<div class="title">Petugas</div>
			<a href="javascript:void(0)" on:click={() => showAddPetugasPopup = true}><div class="sub-title">Tambah</div></a>
		</div>
		{#if users.length > 0}
			{#each users as user}
				<div class="card-info-border">
					<div class="card-row-spaceless">
						<div class="space-style">
							<div class="card-title">{user.nama_petugas} | {user.notelp_petugas}</div>
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
			                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={handlePetugasClick(user.id_petugas)}>Ubah</a>

			                </div>
			                <div class="card-title-secondary" style="text-align: right;"><a href="javascript:void(0)" on:click={() => deletePetugas(user.id_petugas)}>Hapus</a></div>
			            </div>
			        </div>
				</div>
			{/each}
		{:else}
			<p>Belum ada Data</p>
		{/if}

<!-- 		{#if allRates !== -1} -->
        <div class="card-row">
            <div class="title">Penilaian</div>
        </div>
        <div class="scrollable-x">
            <div class="laundry-list">
            {#if allRates.length > 0}
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
	        {:else}
	        	<p>Belum ada Data</p>
	        {/if}
            </div>
        </div>
	</div>
	<br><br><br>
	<AdminNavbar />
</div>
{#if showAddPetugasPopup}
	<TambahPetugasPopup {form} on:close={() => showAddPetugasPopup = false} on:save={(e) => saveNewPetugas(e.detail)} />
{/if}
{#if showEditPetugasPopup}
    <EditPetugasPopup {form} on:close={() => showEditPetugasPopup = false} on:save={(e) => EditPetugas(e.detail)} />
{/if}
{#if showAddKategoriPopup}
	<TambahKategoriPopup {kategoriForm} on:close={() => showAddKategoriPopup = false} on:save={(e) => saveNewKategori(e.detail)} />
{/if}
{#if showEditKategoriPopup}
    <EditKategoriPopup {kategoriForm} on:close={() => showEditKategoriPopup = false} on:save={(e) => EditKategori(e.detail)} />
{/if}