<script>
	import { onMount } from 'svelte';
	import icon from '$lib/images/logo.png';
	import profil from '$lib/images/profil-logo.png';
	import arrowLeft from '$lib/images/left-arrow.png';
	import img from '$lib/images/profile/profile.jpg';
	import profilIcon from '$lib/images/profil-symbol.png';
	import ratingIcon from '$lib/images/chat.png';
	import logoutIcon from '$lib/images/logout.png';
	import edit from '$lib/images/edit.png';
	import hapus from '$lib/images/delete.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import AdminNavbar from '../../AdminNavbar.svelte';
	import ApiController from '../../ApiController.js';
	import Mapbox from '$lib/components/popup/Admin/Mapbox.svelte';
	import EditProfilePopup from '$lib/components/popup/Admin/EditProfilPopup.svelte';
	import TambahAlamatPopup from '$lib/components/popup/Admin/TambahAlamatPopup.svelte';
	import EditAlamatPopup from '$lib/components/popup/Admin/EditAlamatPopup.svelte';
	import TambahPembayaranPopup from '$lib/components/popup/Admin/TambahPembayaranPopup.svelte';
	import EditPembayaranPopup from '$lib/components/popup/Admin/EditPembayaranPopup.svelte';
	import TambahJamOperasionalPopup from '$lib/components/popup/Admin/TambahJamOperasionalPopup.svelte';
	import EditJamOperasionalPopup from '$lib/components/popup/Admin/EditJamOperasionalPopup.svelte';
	import '@fontsource/montserrat';

	let email;
	let users = [];
	let paymentMethods = [];
	let categories = [];
	let showMap = false;
  	let latitude, longitude;
	let state = '';

  	const accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

	let form = {
	    fullName: '',
	    email: '',
	    notelp: '',
	    profilPict: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads',
	    alamat: '',
	    kelurahan: '',
	    kecamatan: '',
	    kodePos: '',
	    longitudeLaundry: null,
    	latitudeLaundry: null,
	    detailAlamat: '',
	    bukaTutupLaundry: ''
	};

	let pembayaranForm = {
		idPembayaran: '',
		emailLaundry: '',
	    paymentMethod: '',
	    namaBank: '',
	    noRekBank: '',
	    qrqris: '',
	    catatan: '',
	    upload_path: '/Users/macbook/laundrylab/static/uploads/qr'
	}

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

	let showEditProfilePopup = false;
	let addressExists = false;
	let alamatExists = false;
	let jamOperasionalExists = false;
	let kategoriExists = false;
	let showAddAlamatPopup = false;
	let showEditAlamatPopup = false;
	let showAddPembayaranPopup = false;
	let showEditPembayaranPopup = false;
	let showAddJamOperasionalPopup = false;
	let showEditJamOperasionalPopup = false;

 	onMount(async () => {
        const token = localStorage.getItem('token');
        const emailStored = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAdminEmail/${emailStored}`,
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

                console.log(form.bukaTutupLaundry);
                console.log(admin);

                const addressExists = admin.alamat;
                if (addressExists) {
                    form.alamat = admin.alamat;
                    form.kelurahan = admin.kelurahan;
                    form.kecamatan = admin.kecamatan;
                    form.kodePos = admin.kodePos;
                    form.longitudeLaundry = admin.longitudeLaundry;
                    form.latitudeLaundry = admin.latitudeLaundry;
                    form.detailAlamat = admin.detailAlamat;
                    alamatExists = true;
                }
                console.log(addressExists);

		        if (admin.days && admin.days.length > 0) {
		          jamOperasionalExists = true;
				  operasionalForm.days = admin.days;
				} else {
				  jamOperasionalExists = false;
				  console.log('Jam Operasional data does not exist or is empty.');
				}

				if (form.bukaTutupLaundry) {
					state = form.bukaTutupLaundry;
				}

				console.log("alamatExists: ", alamatExists);
				console.log("jamOperasionalExists: ", jamOperasionalExists);
            } else {
                console.error('Failed to fetch admin:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin:', error);
        }

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getKategori/${emailStored}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
		        categories = response.data.categories;
		        if (categories.length > 0) {
		        	kategoriExists = true;
		        } else {
		          	kategoriExists = false;
		        }
		      } else {
                console.error('Failed to fetch categories:', response ? response.data.error : 'No response from server');
            }
            console.log("kategoriExists: ", kategoriExists);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }

        try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: `getPembayaran/${emailStored}`,
	        token: token
	      });

	      	if (response && response.data && response.data.success) {
	        users = response.data.users;
	        paymentMethods = users.filter(user => user.emailLaundry === emailStored);
	        
	        if (users.length > 0) {
	          const lastUserId = users
	            .map(user => parseInt(user.idPembayaran))
	            .sort((a, b) => a - b)
	            .pop();
	          const incrementedId = lastUserId + 1;
	          pembayaranForm.idPembayaran = incrementedId.toString();
	        } else {
	          pembayaranForm.idPembayaran = '1';
	        }
	      } else {
	        console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching users:', error);
	    }
    });

	async function handleAddressMapClick() {
	    try {
	      latitude = form.latitudeLaundry;
	      longitude = form.longitudeLaundry;
	      showMap = true;
	      console.log(longitude);
	      console.log(latitude);
	    } catch (error) {
	      alert("Location not found");
	    }
	  }

	function closeMap() {
		showMap = false;
	}

	function logout() {
	    localStorage.removeItem('isAuthenticated');
	    localStorage.removeItem('id');
	    localStorage.removeItem('email');
	    localStorage.removeItem('role');
	    localStorage.removeItem('token');
	    window.location.href = '/';
	}

	async function saveProfile(updatedForm) {
	    const token = localStorage.getItem('token');

	    try {
	      const formData = new FormData();
	        formData.append('namaLaundry', updatedForm.fullName);
	        formData.append('notelp', updatedForm.notelp);
	        formData.append('upload_path', updatedForm.upload_path);

	        if (form.profilPict) {
	            formData.append('profilPict', updatedForm.profilPict);
	        }

	      const response = await ApiController({
	        method: 'PUT',
	        endpoint: `updateAdmin/${updatedForm.email}`,
	        token: token,
	        datas: formData,
	        sendForm: true
	      });

	      if (response && response.data && response.data.success) {
	        form = { ...updatedForm };
	        showEditProfilePopup = false;
	        alert('successful');
	        window.location.reload();
	        console.log(updatedForm.fullName);
	        console.log(updatedForm.profilPict);
	      } else {
	        console.error('Failed to update profile:', response ? response.data.error : 'No response from server');
	        alert('Failed to update profile');
	      }
	    } catch (error) {
	      console.error('Error updating profile:', error);
	      alert('Error updating profile');
	    }
	}

	function handleAddressClick() {
	    if (form.alamat && form.kelurahan && form.kecamatan && form.kodePos && form.detailAlamat) {
	    	addressExists = true;
            showEditAlamatPopup = true;
        } else {
            showAddAlamatPopup = true;
        }
	}

	async function saveNewAddress(newAddress) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email'); 

	    try {
	        const formData = new FormData();
	        formData.append('alamat', newAddress.alamat);
	        formData.append('kelurahan', newAddress.kelurahan);
	        formData.append('kecamatan', newAddress.kecamatan);
	        formData.append('kodePos', newAddress.kodePos);
	        formData.append('longitudeLaundry', newAddress.longitudeLaundry);
	        formData.append('latitudeLaundry', newAddress.latitudeLaundry);
	        formData.append('detailAlamat', newAddress.detailAlamat);

	        const response = await ApiController({
		        method: 'PUT',
		        endpoint: `adminRegisterById/${email}`,
		        token: token,
		        datas: formData,
		        sendForm: true
		      });

	        if (response && response.data && response.data.success) {
	            addressExists = true;
	            form = { ...form, ...newAddress };
	            showAddAlamatPopup = false;
	            showEditAlamatPopup = false;
	            alert('Address updated successfully');    
	        	window.location.reload();
	            console.log(addressExists);
	        } else {
	            alert('Failed to update address: ' + result.message);
	        }
	    } catch (error) {
	        console.error('Error updating address:', error);
	        alert('Error updating address');
	    }
	}

async function saveNewPembayaran(newPembayaran) {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    const formData = new FormData();
	formData.append('idPembayaran', newPembayaran.idPembayaran);
	formData.append('emailLaundry', email);
    formData.append('paymentMethod', newPembayaran.paymentMethod);
    formData.append('namaBank', newPembayaran.namaBank);
    formData.append('noRekBank', newPembayaran.noRekBank);
    formData.append('catatan', newPembayaran.catatan);
    formData.append('upload_path', newPembayaran.upload_path);

    if (pembayaranForm.paymentMethod === 'qris') {
      formData.append('qrisImg', newPembayaran.qrisImg);
    }

    try {
      const response = await ApiController({ 
      	method: 'POST', 
      	endpoint: `addPaymentMethod/${email}`, 
      	datas: formData 
      });
      console.log('API Response:', response);
      if (response.data.success) {
      	showAddPembayaranPopup = false;
        alert('Metode Pembayaran added successfully!');
        window.location.reload();
      } else {
        alert('Failed to add Metode Pembayaran: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding metode pembayaran:', error);
      alert('An error occurred while adding metode pembayaran.');
    }
  }

  async function EditPembayaran(newPembayaran) {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    try {
    	const formData = new FormData();
		formData.append('emailLaundry', email);
	    formData.append('paymentMethod', newPembayaran.paymentMethod);
	    formData.append('namaBank', newPembayaran.namaBank);
	    formData.append('noRekBank', newPembayaran.noRekBank);
	    formData.append('catatan', newPembayaran.catatan);
	    formData.append('upload_path', newPembayaran.upload_path);

	    if (pembayaranForm.paymentMethod === 'qris') {
	      formData.append('qrisImg', newPembayaran.qrisImg);
	    }

	      const response = await ApiController({ 
	      	method: 'PUT', 
	      	endpoint: `editPaymentMethod/${newPembayaran.idPembayaran}/${email}`,
	      	token: token,
	      	datas: formData, 
	      	sendForm: true 
	      });
	      console.log('API Response:', response);

	      if (response && response.data && response.data.success) {
	      	showEditPembayaranPopup = false;
	      	pembayaranForm = { ...pembayaranForm, ...newPembayaran };
	        alert('Metode Pembayaran updated successfully!');
	        window.location.reload();
	      } else {
	        alert('Failed to update Metode Pembayaran: ' + (response.data.error || 'Unknown error'));
	      }
	    } catch (error) {
	      console.error('Error updating metode pembayaran:', error);
	      alert('An error occurred while updating metode pembayaran.');
	    }
  	}

  	async function handlePembayaranClick(idPembayaran) {
    	showEditPembayaranPopup = true;
  		await fetchPembayaranDetails(idPembayaran);
  	}

  	async function deletePembayaran(idPembayaran) {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        try {
            const response = await ApiController({
                method: 'DELETE',
                endpoint: `deletePaymentMethod/${idPembayaran}/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                alert('Metode Pembayaran deleted successfully');
                users = users.filter(user => user.idPembayaran !== idPembayaran);
                window.location.reload();
            } else {
                console.error('Failed to delete metode pembayaran:', response ? response.data.error : 'No response from server');
                alert('Failed');
            }
        } catch (error) {
            console.error('Error deleting metode pembayaran:', error);
        }
    }

    async function fetchPembayaranDetails(idPembayaran) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email');

	    try {
	        const response = await ApiController({
	            method: 'GET',
	            endpoint: `getPembayaranId/${idPembayaran}/${email}`,
	            token: token
	        });

	        if (response && response.data && response.data.success) {
			    const metodePembayaran = response.data.pembayaran;
			    if (metodePembayaran) {
			    	pembayaranForm = { ...pembayaranForm, ...metodePembayaran };
			    } else {
			        console.error('Metode pembayaran is undefined');
			    }
			} else {
			    console.error('Failed to fetch pembayaran details:', response ? response.data.error : 'No response from server');
			    console.log('Response 2:', response);
				console.log('Response Data 2:', response.data);
			}
	    } catch (error) {
	        console.error('Error fetching pembayaran details:', error);
	    }
	}

	function handleJamOperasionalClick() {
	    if (jamOperasionalExists) {
            showEditJamOperasionalPopup = true;
        } else {
            showAddJamOperasionalPopup = true;
        }
	  }

	async function saveNewJamOperasional(newJamOperasional) {
	    const token = localStorage.getItem('token');
	    const email = localStorage.getItem('email'); 

	    try {
	        const formData = new FormData();
	        formData.append('days', JSON.stringify(newJamOperasional.days));

	        const response = await ApiController({
		        method: 'PUT',
		        endpoint: `adminRegisterByIdJam/${email}`,
		        token: token,
		        datas: formData,
		        sendForm: true
		      });

	        if (response && response.data && response.data.success) {
	            jamOperasionalExists = true;
	            operasionalForm = { ...operasionalForm, ...newJamOperasional };
	            showAddJamOperasionalPopup = false;
	            showEditJamOperasionalPopup = false;
	            alert('Jam Operasional updated successfully');
	            window.location.reload();
	            console.log(jamOperasionalExists);
	        } else {
	            alert('Failed to update jam operasional: ' + response.data.message);
	        }
	    } catch (error) {
	        console.error('Error updating jam operasional:', error);
	        alert('Error updating jam operasional');
	    }
	}

	async function toggleState() {
		const token = localStorage.getItem('token');
		const email = localStorage.getItem('email');

		let newState = '';
		if (form.bukaTutupLaundry === 'Buka') {
			newState = 'Tutup';
		} else if (form.bukaTutupLaundry === 'Tutup') {
			newState = 'Buka';
		}

		const formData = new FormData();
		formData.append('bukaTutupLaundry', newState);

		try {
			const response = await ApiController({
				method: 'PUT',
				endpoint: `editAdminState/${email}`,
				token: token,
				datas: formData
			});

			if (response && response.data && response.data.success) {
				state = newState;
				form.bukaTutupLaundry = newState;
				window.location.reload();
			} else {
				console.error('Failed to update state:', response ? response.data.error : 'No response from server');
				alert('Failed to update state');
			}
		} catch (error) {
			console.error('Error updating state:', error);
			alert('Error updating state');
		}
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
                <a href="/halamanAdmin">
                    <img src="{arrowLeft}" alt="back" class="back-arrow" />
                </a>
                Profil Saya
            </div>
        </div>
        <br>
        <div class="centered-items">
            <div class="profile-img"><img src={"/uploads/" + form.profilPict} alt="No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet. No Profile Image Yet"></div>
        </div><br>
        <div class="centered-items">
        	{#if alamatExists && jamOperasionalExists && kategoriExists}
        		<button on:click={toggleState} class="button-border {form.bukaTutupLaundry === 'Buka' ? 'button-border-red' : 'button-border-green'}">
				  {#if form.bukaTutupLaundry === 'Buka'}
				    Tutup Laundry
				  {:else}
				    Buka Laundry
				  {/if}
				</button>
        	{:else}
				<h2>Lengkapi Data di Profil dan Beranda!</h2>
        	{/if}
			<br>
        </div>
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
            <Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} disabled={true} style="width: 410px;" />
            <Input type="text" placeholder="Email" bind:value={form.email} disabled={true} style="width: 410px;" />
            <Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} disabled={true} style="width: 410px;" />
            {#if form.alamat}
            <div class="card-info-border">
                <div class="card-row">
                    <div>
                        <div class="card-row-spaceless">
                            <div>
                                <div class="card-title">Alamat</div>
                                <div class="card-caption">{form.alamat}, {form.kelurahan}, {form.kecamatan}, {form.kodePos}</div>
                                <div class="card-caption">Catatan: {form.detailAlamat}</div>
                                <div class="card-caption">
						            <a href="javascript:void(0)" on:click={handleAddressMapClick}>Lihat Peta</a>
						        </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="card-review">
                            <a href="javascript:void(0)" on:click={handleAddressClick}>Ubah</a>
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
                            <a href="javascript:void(0)" on:click={handleAddressClick}>Tambah</a>
                        </div>
                    </div>
                </div>
            </div>
            {/if}
            <div class="card-info-border">
			  <div class="card-row">
			    <div>
			      <div class="card-title">Metode Pembayaran</div>
			      <div class="card-border"></div>
			      {#each paymentMethods as method}
			        {#if method.paymentMethod === 'bank'}
			          <div class="card-row-spaceless">
			            <div>
			              <div class="card-title-smaller">Transfer Bank</div>
			              
			              <div class="card-caption">{method.namaBank}</div>
			              <div class="card-caption">{method.noRekBank}</div>
			              <div class="card-caption">{method.catatan}</div>
			            </div>
			          </div>
			          <div>
		              	<div class="card-review">
					        <a href="javascript:void(0)" on:click={handlePembayaranClick(method.idPembayaran)}>Ubah</a>
					    </div>
					    <div class="card-review">
					        <a href="javascript:void(0)" on:click={() => deletePembayaran(method.idPembayaran)}>Hapus</a>
					    </div>
		              </div>
		        {:else if method.paymentMethod === 'qris'}
			          <div class="card-row-spaceless">
			            <div>
			              <div class="card-title-smaller">QRIS</div>
			              <img src={"/uploads/qr/" + method.qrisImg} alt="QRIS Image" class="laundry-image">
			              <div class="card-caption">{method.catatan}</div>
			            </div>
			          </div>
			          <div>
		              	<div class="card-review">
					        <a href="javascript:void(0)" on:click={handlePembayaranClick(method.idPembayaran)}>Ubah</a>
					    </div>
					    <div class="card-review">
					        <a href="javascript:void(0)" on:click={() => deletePembayaran(method.idPembayaran)}>Hapus</a>
					    </div>
		              </div>
			        {:else if method.paymentMethod === 'tunai'}
			          <div class="card-row-spaceless">
			            <div>
			              <div class="card-title-smaller">Tunai</div>
			              <div class="card-caption">{method.catatan}</div>
			            </div>
			          </div>
			          <div>
		              	<div class="card-review">
					        <a href="javascript:void(0)" on:click={handlePembayaranClick(method.idPembayaran)}>Ubah</a>
					    </div>
					    <div class="card-review">
					        <a href="javascript:void(0)" on:click={() => deletePembayaran(method.idPembayaran)}>Hapus</a>
					    </div>
		              </div>
			        {/if}
			        <div class="card-border"></div>
			      {/each}
			    </div>
			    <div>
			      <div class="card-review">
			        <a href="javascript:void(0)" on:click={() => showAddPembayaranPopup = true}>Tambah</a>
			      </div>
			    </div>
			  </div>
			</div>
			{#if jamOperasionalExists}
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
	                    <div>
	                        <div class="card-review">
	                            <a href="javascript:void(0)" on:click={handleJamOperasionalClick}>Ubah</a>
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
	                                <div class="card-title">Jam Operasional</div>
	                                <div class="card-caption">Jam Operasional belum diisi</div>
	                            </div>
	                        </div>
	                    </div>
	                    <div>
	                        <div class="card-review">
	                            <a href="javascript:void(0)" on:click={handleJamOperasionalClick}>Tambah</a>
	                        </div>
	                    </div>
	                </div>
	            </div>
            {/if}
        </div>
        <div class="centered-items">
            <Button type="button" label="Logout" on:click={logout} />
        </div>
        <br><br>
        <br><br>
    </div>
    <AdminNavbar />
</div>
{#if showMap}
  <Mapbox {latitude} {longitude} on:close={closeMap} />
{/if}
{#if showEditProfilePopup}
	<EditProfilePopup {form} on:close={() => showEditProfilePopup = false} on:save={(e) => saveProfile(e.detail)} />
{/if}
{#if showAddAlamatPopup}
	<TambahAlamatPopup {form} on:close={() => showAddAlamatPopup = false} on:save={(e) => saveNewAddress(e.detail)} />
{/if}
{#if showEditAlamatPopup}
	<EditAlamatPopup {form} on:close={() => showEditAlamatPopup = false} on:save={(e) => saveNewAddress(e.detail)} />
{/if}
{#if showAddPembayaranPopup}
	<TambahPembayaranPopup {pembayaranForm} on:close={() => showAddPembayaranPopup = false} on:save={(e) => saveNewPembayaran(e.detail)} />
{/if}
{#if showEditPembayaranPopup}
    <EditPembayaranPopup {pembayaranForm} on:close={() => showEditPembayaranPopup = false} on:save={(e) => EditPembayaran(e.detail)} />
{/if}
{#if showAddJamOperasionalPopup}
  <TambahJamOperasionalPopup {operasionalForm} on:close={() => showAddJamOperasionalPopup = false} on:save={(e) => saveNewJamOperasional(e.detail)} />
{/if}
{#if showEditJamOperasionalPopup}
  <EditJamOperasionalPopup {operasionalForm} on:close={() => showEditJamOperasionalPopup = false} on:save={(e) => saveNewJamOperasional(e.detail)} />
{/if}
