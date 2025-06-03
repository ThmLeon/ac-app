<script>
  import { page } from '$app/stores';
  $: error = $page.url.searchParams.get('error_description') || 'Unbekannter Fehler';
</script>

<h1>Fehler beim Login</h1>
<p>{error}</p>
<a href="/">Zurück zur Startseite</a>