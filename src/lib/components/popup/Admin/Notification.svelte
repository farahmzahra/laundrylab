<script>
    import { onMount, onDestroy } from 'svelte';

    let allNotifs = [
        { message: "Notification 1" },
        { message: "Notification 2" },
        { message: "Notification 3" }
    ];

    let showPopup = false;

    function togglePopup() {
        showPopup = !showPopup;
    }

    function closePopup(event) {
        if (!event.target.closest('.notification-popup') && !event.target.closest('.img-icon')) {
            showPopup = false;
        }
    }

    onMount(async () => {
        // Your existing onMount logic
        document.addEventListener('click', closePopup);
    });

    onDestroy(() => {
        document.removeEventListener('click', closePopup);
    });
</script>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f8f9fa;
    }

    .logo {
        height: 50px;
    }

    .img-icon {
        height: 30px;
        cursor: pointer;
    }

    .notification-popup {
        display: none;
        position: absolute;
        top: 60px;
        right: 10px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background-color: white;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .notification-popup ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .notification-popup li {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .notification-popup li:last-child {
        border-bottom: none;
    }

    .notification-popup.show {
        display: block;
    }
</style>

<div class="header">
    <img src="{logo}" class="logo" alt="Logo">
    <img src="{notif}" class="img-icon" alt="notif" on:click={togglePopup}>
</div>
<div class="notification-popup {showPopup ? 'show' : ''}">
    <ul>
        {#each allNotifs as notif}
            <li>{notif.message}</li>
        {/each}
    </ul>
</div>