import RenderLib from "RenderLib";

// Toggle state for PD Route boxes
let pdRoutesEnabled = true;

// Command to toggle PD Route boxes
register("command", () => {
    pdRoutesEnabled = !pdRoutesEnabled;
    ChatLib.chat(`PD Routes are now ${pdRoutesEnabled ? "§aEnabled" : "§cDisabled"}§r.`);
}).setName("togglepdroutes");

// Create a constant array "pdroutes" with your specific coordinates and labels
const pdroutes = [
    { x: 68, y: 220, z: 37, label: "Chest" },
    { x: 90, y: 165, z: 41, label: "Wallwalk" },
    { x: 96, y: 119, z: 71, label: "Bonzo Near" },
    { x: 95, y: 120, z: 83, label: "Bonzo" },
    { x: 95, y: 122, z: 101, label: "Bonzo" },
    { x: 96, y: 121, z: 121, label: "Wallwalk" },
    { x: 65, y: 123, z: 141, label: "Jerry" },
    { x: 66, y: 110, z: 135, label: "Chest Bounce" },
    { x: 55, y: 133, z: 138, label: "Bonzo" },
    { x: 51, y: 132, z: 138, label: "Bonzo" },
    { x: 32, y: 132, z: 137, label: "Bonzo to Right" },
    { x: 20, y: 114, z: 128, label: "Wallwalk" }
];

function renderPDRoutes() {
  if (!pdRoutesEnabled) return;

  pdroutes.forEach(loc => {
    // Adjust positions so the render appears perfectly centered
    const boxCenterX = loc.x + 0.5; // Box center at the middle of the block
    const boxCenterY = loc.y + 0.5;
    const boxCenterZ = loc.z + 0.5;

    const labelX = boxCenterX; // Keep the label centered horizontally
    const labelY = boxCenterY + 1.2; // Offset the label slightly above the box
    const labelZ = boxCenterZ;

    // Determine the color based on the label
    let boxColor;
    switch (loc.label) {
      case "Chest":
      case "Chest Bounce": boxColor = 0x800080; break; // Purple
      case "Wallwalk":     boxColor = 0x008080; break; // Teal
      case "Jerry":        boxColor = 0x00FF00; break; // Green
      case "Bonzo":
      case "Bonzo Near":
      case "Bonzo to Right": boxColor = 0xFFFF00; break; // Yellow
      default:              boxColor = 0xFFFFFF; break; // Default White
    }

    // Draw a Baritone-style box at the PD Route location
    RenderLib.drawBaritoneEspBox(
      boxCenterX - 0.5, // Adjust x to match Baritone-style box rendering
      boxCenterY - 0.5, // Adjust y to match Baritone-style box rendering
      boxCenterZ - 0.5, // Adjust z to match Baritone-style box rendering
      1.0,              // Box width
      1.0,              // Box height
      (boxColor >> 16) & 0xff, 
      (boxColor >> 8) & 0xff, 
      boxColor & 0xff, 
      0.5 // Opacity
    );

    // Draw the label above the box
    const scale = 0.05;
    Tessellator.drawString(`§7(${loc.label})`, labelX, labelY, labelZ, 0xffffff, false, scale, false);
  });
}

register("renderWorld", renderPDRoutes);
console.log("PD Routes loaded successfully!");
