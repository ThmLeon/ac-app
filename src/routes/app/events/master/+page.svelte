<script lang="ts">
  import EventMasterCard from "$lib/components/EventMasterCard.svelte";

        import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";


  export let data: { events_master: any[] };


  let showSheet = false;
  let selectedEventMaster: { id: string; master_name: string; beschreibung: string } | null = null;

  function onEdit(id: string) {
    showSheet = false; // Reset the state to ensure reactivity
    selectedEventMaster = data.events_master.find(eventMaster => eventMaster.id === id);
    showSheet = true; // Reopen the sheet
    focusMasterNameInput();
  }

  function focusMasterNameInput() {
    const inputElement = document.getElementById("master_name") as HTMLInputElement | null;
    if (inputElement) {
      inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
      inputElement.focus();
    }
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-wrap justify-start gap-4">
    {#each data.events_master as eventMaster (eventMaster.id)}
      <div class="flex justify-center">
        <EventMasterCard 
          id={eventMaster.id}
          onEdit={() => {onEdit(eventMaster.id);}}
          name={eventMaster.master_name} 
          description={eventMaster.beschreibung} 
          width="350px" 
        />
      </div>
    {/each}
  </div>

  {#if showSheet && selectedEventMaster}
    <Sheet.Root open={showSheet}>
      <Sheet.Content side="right" class="min-w-[500px] flex flex-col justify-between h-full">
          <form method="POST">
        <div>
          <Sheet.Header>
            <Sheet.Title>Event Master bearbeiten</Sheet.Title>
            <Sheet.Description>
              Ändere die Details des Event Masters unten. Klicke auf "Speichern", wenn du fertig bist.
            </Sheet.Description>
          </Sheet.Header>
          <input type="hidden" name="id" value={selectedEventMaster.id} />
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 gap-4 items-center">
              <Label for="master_name" class="col-span-1 text-left">Master Name</Label>
              <Input 
                id="master_name" 
                name="master_name"
                bind:value={selectedEventMaster!.master_name} 
                class="col-span-3" 
              />
            </div>
            <div class="grid grid-cols-4 gap-4 items-start">
              <Label for="beschreibung" class="col-span-1 text-left">Beschreibung</Label>
              <textarea 
                id="beschreibung" 
                name="beschreibung"
                bind:value={selectedEventMaster!.beschreibung} 
                class="col-span-3 resize-y border rounded p-2"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
        <Sheet.Footer class="flex justify-end gap-4 mt-4">
          <Button formaction="?/deleteEvent" type="submit" variant="destructive">Löschen</Button>
          <Button formaction="?/updateEvent" type="submit">Speichern</Button>
        </Sheet.Footer>
    </form>
      </Sheet.Content>
    </Sheet.Root>
  {/if}
</div>




