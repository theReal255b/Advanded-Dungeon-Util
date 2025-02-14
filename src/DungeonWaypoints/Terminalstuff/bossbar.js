const witherEntity = Java.type("net.minecraft.entity.boss.EntityWither");

// State flags and last-seen tick values for each boss type.
let goldorActive = false, necronActive = false, stormActive = false, maxorActive = false;
let goldorLastSeen = 0, necronLastSeen = 0, stormLastSeen = 0, maxorLastSeen = 0;
let tickCounter = 0;
const THRESHOLD = 40; // Number of ticks to wait before declaring a boss dead

register("tick", () => {
  if (!Player.getPlayer() || !World.isLoaded()) return;
  
  tickCounter++;
  // Process every 40 ticks
  if (tickCounter % 40 !== 0) return;

  // Get all wither entities in the world.
  let withers = World.getAllEntitiesOfType(witherEntity.class);

  // Initialize flags for this tick.
  let goldorFound = false;
  let necronFound = false;
  let stormFound = false;
  let maxorFound = false;

  // Check each wither's name.
  withers.forEach(wither => {
    let name = wither.getName().toLowerCase();
    if (name.includes("goldor")) goldorFound = true;
    if (name.includes("necron")) necronFound = true;
    if (name.includes("storm")) stormFound = true;
    if (name.includes("maxor")) maxorFound = true;
  });

  // Goldor detection.
  if (goldorFound) {
    goldorLastSeen = tickCounter;
    if (!goldorActive) {
      ChatLib.chat("&8[ADU] Boss Goldor has spawned.");
      goldorActive = true;
    }
  } else {
    if (goldorActive && (tickCounter - goldorLastSeen >= THRESHOLD)) {
      ChatLib.chat("&8[ADU] Boss Goldor has died.");
      goldorActive = false;
    }
  }

  // Necron detection.
  if (necronFound) {
    necronLastSeen = tickCounter;
    if (!necronActive) {
      ChatLib.chat("&c[ADU] Boss Necron has spawned.");
      necronActive = true;
    }
  } else {
    if (necronActive && (tickCounter - necronLastSeen >= THRESHOLD)) {
      ChatLib.chat("&c[ADU] Boss Necron has died.");
      necronActive = false;
    }
  }

  // Storm detection.
  if (stormFound) {
    stormLastSeen = tickCounter;
    if (!stormActive) {
      ChatLib.chat("&9[ADU] Boss Storm has spawned.");
      stormActive = true;
    }
  } else {
    if (stormActive && (tickCounter - stormLastSeen >= THRESHOLD)) {
      ChatLib.chat("&9[ADU] Boss Storm has died.");
      stormActive = false;
    }
  }

  // Maxor detection.
  if (maxorFound) {
    maxorLastSeen = tickCounter;
    if (!maxorActive) {
      ChatLib.chat("&5[ADU] Boss Maxor has spawned.");
      maxorActive = true;
    }
  } else {
    if (maxorActive && (tickCounter - maxorLastSeen >= THRESHOLD)) {
      ChatLib.chat("&5[ADU] Boss Maxor has died.");
      maxorActive = false;
    }
  }
});

export function shouldRenderTerminals() {
  return goldorActive && !necronActive;
}
