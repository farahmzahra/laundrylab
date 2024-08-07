<script>
	import { onMount } from 'svelte';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import UserNavbar from '../../UserNavbar.svelte';
	import ApiController from '../../ApiController.js';
	import EditProfilePopup from '$lib/components/popup/User/EditProfilPopup.svelte';
	import TambahAlamatPopup from '$lib/components/popup/User/TambahAlamatPopup.svelte';
	import EditAlamatPopup from '$lib/components/popup/User/EditAlamatPopup.svelte';
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

	let alamatForm = {
		idAlamat: '',
		alamat: '',
	    kelurahan: '',
	    kecamatan: '',
	    kodePos: '',
	    longitudeUser: null,
    	latitudeUser: null,
	    detailAlamat: '',
	}

	let addressExists = false;
	let showEditProfilePopup = false;
	let showAddAlamatPopup = false;
	let showEditAlamatPopup = false;

	 onMount(async () => {
	    const token = localStorage.getItem('token');
	    const emailStored = localStorage.getItem('email');

	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: `getUserEmail/${emailStored}`,
	        token: token
	      });

	      console.log('API Response:', response);

	      if (response && response.data && response.data.success) {
	        const user = response.data.pelanggan;
	        form.fullName = user.nama;
	        form.email = user.email;
	        form.notelp = user.notelp;
	        form.profilPict = user.profilPict;
	      } else {
	        console.error('Failed to fetch user:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching user:', error);
	    }

	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: `getAlamat/${emailStored}`,
	        token: token
	      });

	      	if (response && response.data && response.data.success) {
	      	addressExists = true;
	        users = response.data.users;
	        dataAddresses = users.filter(user => user.emailUser === emailStored);
	        
	        if (users.length > 0) {
	          const lastUserId = users
	            .map(user => parseInt(user.idAlamat))
	            .sort((a, b) => a - b)
	            .pop();
	          const incrementedId = lastUserId + 1;
	          alamatForm.idAlamat = incrementedId.toString();
	        } else {
	          alamatForm.idAlamat = '1';
	        }
	      } else {
	        console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching users:', error);
	    }
	  });

    async function saveProfile(updatedForm) {
	    const token = localStorage.getItem('token');

	    try {
	      const formData = new FormData();
	        formData.append('nama', updatedForm.fullName);
	        formData.append('notelp', updatedForm.notelp);
	        formData.append('upload_path', updatedForm.upload_path);

	        if (form.profilPict) {
	            formData.append('profilPict', updatedForm.profilPict);
	        }

	      const response = await ApiController({
	        method: 'PUT',
	        endpoint: `updateUser/${updatedForm.email}`,
	        token: token,
	        datas: formData,
	        sendForm: true
	      });

	      if (response && response.data && response.data.success) {
	        form = { ...updatedForm };
	        showEditProfilePopup = false;
	        alert('Data Berhasil Diubah!');
	        window.location.reload();
	      } else {
	        console.error('Failed to update profile:', response ? response.data.error : 'No response from server');
	        alert('Terjadi kesalahan saat data diperbarui');
	      }
	    } catch (error) {
	      console.error('Error updating profile:', error);
	      alert('Terjadi kesalahan saat data diperbarui');
	    }
	}

	async function saveNewAddress(newAlamat) {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    const formData = new FormData();
	formData.append('idAlamat', newAlamat.idAlamat);
	formData.append('emailUser', email);
    formData.append('alamat', newAlamat.alamat);
    formData.append('kelurahan', newAlamat.kelurahan);
    formData.append('kecamatan', newAlamat.kecamatan);
    formData.append('kodePos', newAlamat.kodePos);
    formData.append('longitudeUser', newAlamat.longitudeUser);
    formData.append('latitudeUser', newAlamat.latitudeUser);
    formData.append('detailAlamat', newAlamat.detailAlamat);

    try {
      const response = await ApiController({ 
      	method: 'POST', 
      	endpoint: `addAlamatUser/${email}`, 
      	datas: formData 
      });
      console.log('API Response:', response);
      if (response.data.success) {
      	showAddAlamatPopup = false;
      	window.location.reload();
        alert('Data Berhasil Ditambahkan!');
      } else {
        alert('Terjadi kesalahan saat data ditambahkan: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding alamat:', error);
      alert('Terjadi kesalahan saat data ditambahkan');
    }
  }

  async function EditAddress(newAlamat) {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    try {
    	const formData = new FormData();
		formData.append('emailUser', email);
	    formData.append('alamat', newAlamat.alamat);
	    formData.append('kelurahan', newAlamat.kelurahan);
	    formData.append('kecamatan', newAlamat.kecamatan);
	    formData.append('kodePos', newAlamat.kodePos);
	    formData.append('longitudeUser', newAlamat.longitudeUser);
	    formData.append('latitudeUser', newAlamat.latitudeUser);
	    formData.append('detailAlamat', newAlamat.detailAlamat);

	      const response = await ApiController({ 
	      	method: 'PUT', 
	      	endpoint: `editAlamatUser/${newAlamat.idAlamat}/${email}`,
	      	token: token,
	      	datas: formData, 
	      	sendForm: true 
	      });
	      console.log('API Response:', response);

	      if (response && response.data && response.data.success) {
	      	showEditAlamatPopup = false;
	      	alamatForm = { ...alamatForm, ...newAlamat };
	      	console.log(alamatForm);
	      	console.log(newAlamat);
	        alert('Data Berhasil Diperbarui!');
	      } else {
	        alert('Terjadi kesalahan saat data diperbarui: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error updating alamat:', error);
	      alert('Terjadi kesalahan saat data diperbarui');
	    }
  	}

  	async function handleAlamatClick(idAlamat) {
    	showEditAlamatPopup = true;
  		await fetchAlamatDetails(idAlamat);
  		// console.log(idAlamat);
  	}

    async function fetchAlamatDetails(idAlamat) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    try {
	        const response = await ApiController({
	            method: 'GET',
	            endpoint: `getAlamatId/${idAlamat}/${email}`,
	            token: token
	        });

	        if (response && response.data && response.data.success) {
			    const addresses = response.data.alamatUser;
			    if (addresses) {
			    	alamatForm = { ...alamatForm, ...addresses };
			    	console.log(alamatForm.longitudeUser);
			    	console.log(alamatForm.latitudeUser);
			    } else {
			        console.error('Alamat is undefined');
			    }
			} else {
			    console.error('Failed to fetch alamat details:', response ? response.data.error : 'No response from server');
			    console.log('Response 2:', response);
				console.log('Response Data 2:', response.data);
			}
	    } catch (error) {
	        console.error('Error fetching alamat details:', error);
	    }
	}

	async function deleteAlamat(idAlamat) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'DELETE',
                endpoint: `deleteAlamatUser/${idAlamat}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alert('Data Berhasil Dihapus');
                users = users.filter(user => user.idAlamat !== idAlamat);
            } else {
                console.error('Failed to delete alamat:', response ? response.data.error : 'No response from server');
                alert('Terjadi kesalahan saat data dihapus');
            }
        } catch (error) {
            console.error('Error deleting alamat:', error);
            alert('Terjadi kesalahan saat data dihapus');
        }
    }

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
	<meta name="description" content="Halaman Profil" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="scrollable">
		<div class="header" style="align-items: center;">
			<div class="title-center">
		      Profil Saya
		    </div>
		</div>
		<br>
		<div class="centered-items">
            <div class="profile-img"><img src={form.profilPict} fetchpriority="high" alt="No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet"></div>
        </div><br>
        <div>
        	<div class="card-row">
                <div>
                    <div class="card-row-spaceless">
                        <div class="card-title">Detail Data</div>
                    </div>
                </div>
                <div>
                    <div class="card-row-spaceless">
                        <a href="javascript:void(0)" on:click={() => showEditProfilePopup = true}>Ubah</a>
                    </div>
                </div>
            </div>
            <Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} disabled={true} style="width: 410px;" id="nama"/>
            <Input type="text" placeholder="Email" bind:value={form.email} disabled={true} style="width: 410px;" id="Email" />
            <Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} disabled={true} style="width: 410px;" id="notelp"/>
        </div>
        
<!-- 	        {#if addressExists} -->
		{#if dataAddresses.length > 0}
         <div class="card-info-border">
		  <div class="card-row">
		    <div>
		      <div class="card-title">Alamat</div>
		      <div class="card-border"></div>
		      {#each dataAddresses as alamat}
		          <div class="card-row-spaceless">
		            <div>
		              <div class="card-caption">{alamat.alamat}, {alamat.kelurahan}, {alamat.kecamatan}, {alamat.kodePos}</div>
                            <div class="card-caption">Catatan: {alamat.detailAlamat}</div>
		            </div>
		          </div>
		          <div>
	              	<div class="card-review">
				        <a href="javascript:void(0)" on:click={handleAlamatClick(alamat.idAlamat)}>Ubah</a>
				    </div>
				    <div class="card-review">
				        <a href="javascript:void(0)" on:click={() => deleteAlamat(alamat.idAlamat)}>Hapus</a>
				    </div>
	              </div>
		        <div class="card-border"></div>
		      {/each}
		    </div>
		    <div>
		      <div class="card-review">
		        <a href="javascript:void(0)" on:click={() => showAddAlamatPopup = true}>Tambah</a>
		      </div>
		    </div>
		  </div>
		</div>
        {:else}
        <div class="card-info-border">
            <div class="card-row">
                <div>
                    <div class="card-row-spaceless">
                        <div>
                            <div class="card-title">Alamat</div>
                            <div class="card-caption">Alamat belum diisi</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="card-review">
                        <a href="javascript:void(0)" on:click={() => showAddAlamatPopup = true}>Tambah</a>
                    </div>
                </div>
            </div>
        </div>
        {/if}
		<div class="centered-items">
            <Button type="button" label="Logout" on:click={logout} />
        </div>
        <br><br>
        <br><br>
	</div>
	<UserNavbar />
</div>
{#if showEditProfilePopup}
	<EditProfilePopup {form} on:close={() => showEditProfilePopup = false} on:save={(e) => saveProfile(e.detail)} />
{/if}
{#if showAddAlamatPopup}
	<TambahAlamatPopup {alamatForm} on:close={() => showAddAlamatPopup = false} on:save={(e) => saveNewAddress(e.detail)} />
{/if}
{#if showEditAlamatPopup}
    <EditAlamatPopup {alamatForm} on:close={() => showEditAlamatPopup = false} on:save={(e) => EditAddress(e.detail)} />
{/if}