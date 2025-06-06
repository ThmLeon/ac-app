<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  // Props for the event master
  export let showSheet: boolean; // Unique identifier for the event master
  export let selectedEventMaster: { id: string; master_name: string; beschreibung: string } | null = null;


</script>

<Sheet.Root open={showSheet}>
      <Sheet.Content side="right" class="min-w-[500px] flex flex-col justify-between h-full">
        <div>
          <Sheet.Header>
            <Sheet.Title>Event Master bearbeiten</Sheet.Title>
            <Sheet.Description>
              Ändere die Details des Event Masters unten. Klicke auf "Speichern", wenn du fertig bist.
            </Sheet.Description>
          </Sheet.Header>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 gap-4 items-center">
              <Label for="master_name" class="col-span-1 text-left">Master Name</Label>
              <Input 
                id="master_name" 
                bind:value={selectedEventMaster!.master_name} 
                class="col-span-3" 
              />
            </div>
            <div class="grid grid-cols-4 gap-4 items-start">
              <Label for="beschreibung" class="col-span-1 text-left">Beschreibung</Label>
              <textarea 
                id="beschreibung" 
                bind:value={selectedEventMaster!.beschreibung} 
                class="col-span-3 resize-y border rounded p-2"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
        <Sheet.Footer class="flex justify-end gap-4 mt-4">
          <Button variant="destructive" onclick={() => console.log("Delete")}>Löschen</Button>
          <Button onclick={() => console.log("Save")}>Speichern</Button>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>