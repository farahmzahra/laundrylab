<script>
	import { goto } from '$app/navigation';
	import berandaIcon from '$lib/images/beranda-symbol.png';
	import pesananIcon from '$lib/images/pesanan-symbol.png';
	import profilIcon from '$lib/images/profil-symbol.png';
	import '@fontsource/montserrat';
</script>

<nav class="bottom-navbar">
	<ul class="nav-list">
  		<li class="nav-item">
  			<a href="/halamanUser/Beranda" class="nav-button">
      			<img src="{berandaIcon}" alt="Beranda" class="img-icon">
      			<span class="nav-label">Beranda</span>
			</a>
  		</li>
  		<li class="nav-item">
  			<a href="/halamanUser/Pesanan" class="nav-button">
      			<img src="{pesananIcon}" alt="Pesanan" class="img-icon">
      			<span class="nav-label">Pesanan</span>
			</a>
  		</li>
  		<li class="nav-item">
  			<a href="/halamanUser/Profil" class="nav-button">
      			<img src="{profilIcon}" alt="Profil" class="img-icon">
      			<span class="nav-label">Profil</span>
			</a>
  		</li>
	</ul>
</nav>