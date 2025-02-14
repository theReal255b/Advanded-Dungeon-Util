import RenderLib from "RenderLib";
import { shouldRenderTerminals } from "./bossbar";

// Toggle state for terminal waypoints
let terminalWaypointsEnabled = true;

// Command to toggle terminal waypoints
register("command", () => {
    terminalWaypointsEnabled = !terminalWaypointsEnabled;
    ChatLib.chat(`Terminal Waypoints are now ${terminalWaypointsEnabled ? "§aEnabled" : "§cDisabled"}§r.`);
}).setName("toggleterms");

// Terminal Locations (as provided)
const locations = [
  { x: 111, y: 112.5, z: 73,    label: "Tank 1" },
  { x: 111, y: 118.5, z: 79,    label: "Tank 2" },
  { x: 89,  y: 111.5, z: 92,    label: "Mage 3" },
  { x: 89,  y: 121.5, z: 101,   label: "Archer 4" },
  { x: 68,  y: 108.5, z: 121,   label: "Tank 1" },
  { x: 59,  y: 119.5, z: 122,   label: "Mage 2" },
  { x: 40,  y: 123.5, z: 122,   label: "Archer 3" },
  { x: 39,  y: 107.5, z: 143,   label: "Bers 4" },
  { x: -3,  y: 108.5, z: 112,   label: "Tank 1" },
  { x: -3,  y: 118.5, z: 93,    label: "Mage 2" },
  { x: 19,  y: 122.5, z: 93,    label: "Bers 3" },
  { x: -3,  y: 108.5, z: 77,    label: "Archer 4" },
  { x: 41,  y: 108.5, z: 29,    label: "Tank 1" },
  { x: 44,  y: 120.5, z: 29,    label: "Mage 2" },
  { x: 67,  y: 108.5, z: 29,    label: "Archer 3" },
  { x: 72,  y: 114.5, z: 48,    label: "Bers 4" }
];

function renderTerminals() {
  // Only render if toggled on and if the boss conditions are met.
  if (!terminalWaypointsEnabled || !shouldRenderTerminals()) return;

  locations.forEach(loc => {
    // Adjust positions so the render appears centered
    const baseX = loc.x + 0.5;
    const baseY = loc.y + 0.5;
    const baseZ = loc.z + 0.5;
    
    // Y offsets for the box and text
    const boxOffsetY = baseY;
    const classOffsetY = baseY + 2.0;
    const numberOffsetY = baseY + 1.5;
    
    // Scale for the text
    const scale = 0.05;
    
    // Split the label to get the class name and number
    const parts = loc.label.split(" ");
    let className = parts[0];
    let num = parseInt(parts[1]);
    if (isNaN(num)) num = 1;
    if (num > 4) num = 4;
    
    // Choose a box color based on the class name
    let boxColor;
    switch (className.toLowerCase()) {
      case "tank":   boxColor = 0x808080; break;
      case "mage":   boxColor = 0x0000FF; break;
      case "healer": boxColor = 0x800080; break;
      case "bers":   boxColor = 0xFFA500; break;
      case "archer": boxColor = 0xFF0000; break;
      default:       boxColor = 0xFFFFFF;
    }
    
    // Draw a box around the location
    RenderLib.drawInnerEspBox(
      baseX, 
      boxOffsetY, 
      baseZ, 
      1.01, 
      1.01, 
      (boxColor >> 16) & 0xff, 
      (boxColor >> 8) & 0xff, 
      boxColor & 0xff, 
      0.5
    );
    // Draw the class name and number
    Tessellator.drawString(`§7( ${className}§7 )`, baseX, classOffsetY, baseZ, 0xffffff, false, scale, false);
    Tessellator.drawString(`§8[ §f§l${num}§8 ]`, baseX, numberOffsetY, baseZ, 0xffffff, false, scale, false);
  });
}

register("renderWorld", renderTerminals);
console.log("main.js loaded successfully!");
