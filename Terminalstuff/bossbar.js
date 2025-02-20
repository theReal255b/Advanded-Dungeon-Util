const witherEntity = Java.type("net.minecraft.entity.boss.EntityWither");
let tickCounter = 0;

// Define the boss names.
const bosses = {
  goldor: { active: false, name: "goldor" },
  necron: { active: false, name: "necron" },
  storm:  { active: false, name: "storm" },
  maxor:  { active: false, name: "maxor" }
};

register("tick", () => {
  if (!Player.getPlayer() || !World.isLoaded()) return;
  
  tickCounter++;
  // Process every 40 ticks.
  if (tickCounter % 40 !== 0) return;
  
  // Get all wither entities.
  let withers = World.getAllEntitiesOfType(witherEntity.class);
  
  // Reset boss active flags.
  for (let key in bosses) {
    bosses[key].active = false;
  }
  
  // Loop through the withers and mark the bosses as active if their name includes the keyword.
  withers.forEach(wither => {
    let name = wither.getName().toLowerCase();
    for (let key in bosses) {
      if (name.includes(bosses[key].name)) {
        bosses[key].active = true;
      }
    }
  });
});

// Example render function: only render terminals if Goldor is active and Necron is not.
export function shouldRenderTerminals() {
  return bosses.goldor.active && !bosses.necron.active;
}
