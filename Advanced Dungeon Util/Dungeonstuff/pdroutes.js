import RenderLib from "RenderLib";
const witherEntity = Java.type("net.minecraft.entity.boss.EntityWither");

// State flags and last-seen tick values for Maxor and Storm
let pdRoutesEnabled = true;
let maxorActive = false;
let maxorLastSeen = 0;
let stormActive = false;
let stormLastSeen = 0;
let tickCounter = 0;
const THRESHOLD = 40; // Number of ticks to wait before declaring an entity inactive

// PD route coordinates and labels
const pdroutes = [
    { x: 68, y: 220, z: 37, label: "Chest" },
    { x: 90, y: 165, z: 41, label: "Wallwalk" },
    { x: 94, y: 119, z: 70, label: "Bonzo Near" },
    { x: 95, y: 120, z: 85, label: "Bonzo" },
    { x: 95, y: 122, z: 101, label: "Bonzo" },
    { x: 96, y: 121, z: 121, label: "Wallwalk" },
    { x: 65, y: 123, z: 141, label: "Jerry" },
    { x: 66, y: 110, z: 135, label: "Chest Bounce" },
    { x: 55, y: 133, z: 138, label: "Bonzo" },
    { x: 51, y: 132, z: 138, label: "Bonzo" },
    { x: 32, y: 132, z: 137, label: "Bonzo to Right" },
    { x: 19, y: 120, z: 128, label: "Wallwalk" }
];

// Command to toggle PD route rendering
register("command", () => {
    pdRoutesEnabled = !pdRoutesEnabled;
    ChatLib.chat(`PD Routes are now ${pdRoutesEnabled ? "§aEnabled" : "§cDisabled"}§r.`);
}).setName("togglepdroutes");

// Boss detection logic (run every tick)
register("tick", () => {
    if (!Player.getPlayer() || !World.isLoaded()) return;

    tickCounter++;
    if (tickCounter % 40 !== 0) return; // Check every 40 ticks

    const withers = World.getAllEntitiesOfType(witherEntity.class);
    let maxorFound = false;
    let stormFound = false;

    withers.forEach(wither => {
        const name = wither.getName();
        if (name.includes("Maxor")) {
            maxorFound = true;
        }
        if (name.includes("Storm")) {
            stormFound = true;
        }
    });

    // Update Maxor state
    if (maxorFound) {
        maxorLastSeen = tickCounter;
        if (!maxorActive) {
            maxorActive = true;
        }
    } else if (maxorActive && tickCounter - maxorLastSeen >= THRESHOLD) {
        maxorActive = false;
    }

    // Update Storm state
    if (stormFound) {
        stormLastSeen = tickCounter;
        if (!stormActive) {
            stormActive = true;
        }
    } else if (stormActive && tickCounter - stormLastSeen >= THRESHOLD) {
        stormActive = false;
    }
});

// Render PD routes only when Maxor is active and Storm is not active
register("renderWorld", () => {
    if (!pdRoutesEnabled || !maxorActive || stormActive) return;

    pdroutes.forEach(loc => {
        const boxCenterX = loc.x + 0.5;
        const boxCenterY = loc.y + 0.5;
        const boxCenterZ = loc.z + 0.5;

        const labelX = boxCenterX;
        const labelY = boxCenterY + 1.2;
        const labelZ = boxCenterZ;

        let boxColor;
        switch (loc.label) {
            case "Chest":
            case "Chest Bounce":
                boxColor = 0x800080; break; // Purple
            case "Wallwalk":
                boxColor = 0x008080; break; // Teal
            case "Jerry":
                boxColor = 0x00FF00; break; // Green
            case "Bonzo":
            case "Bonzo Near":
            case "Bonzo to Right":
                boxColor = 0xFFFF00; break; // Yellow
            default:
                boxColor = 0xFFFFFF; break; // Default White
        }

        RenderLib.drawBaritoneEspBox(
            boxCenterX - 0.5,
            boxCenterY - 0.5,
            boxCenterZ - 0.5,
            1.0,
            1.0,
            (boxColor >> 16) & 0xff,
            (boxColor >> 8) & 0xff,
            boxColor & 0xff,
            0.5
        );

        const scale = 0.05;
        Tessellator.drawString(`§7(${loc.label})`, labelX, labelY, labelZ, 0xffffff, false, scale, false);
    });
});

