<script type="text/javascript">
	import { onMount } from 'svelte';
	import ApiController from '../ApiController.js';

	let form = { 
		email: "",
		role: ""
	}

	async function verifEmail() {
	    const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let userEmail = urlParams.get("email")
		let userRole = urlParams.get("role")

	    const formData = new FormData();
		formData.append('email', userEmail);
		formData.append('role', userRole);

	    try {
	      const response = await ApiController({ 
	      	method: 'POST', 
	      	endpoint: `emailVerification`, 
	      	datas: formData 
	      });
	      console.log('API Response:', response);
	      if (response.data.success) {
	      	alert('Email berhasil diverifikasi, silahkan lakukan login!!');
			window.location.href = '/'
	      } else {
	        alert('Terjadi kesalahan');
	      }
	    } catch (error) {
	      console.error('Error:', error);
	    }
	}

	onMount(async() => {
		verifEmail()
	})
</script>