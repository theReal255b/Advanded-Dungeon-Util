let bossHighlightEnabled = true; // Default: Enabled

// Command to toggle boss highlighting
register("command", () => {
    bossHighlightEnabled = !bossHighlightEnabled;
    ChatLib.chat(`Boss Highlighting is now ${bossHighlightEnabled ? "§aEnabled" : "§cDisabled"}§r.`);
}).setName("toggleBossHighlight");

const witherEntity = Java.type("net.minecraft.entity.boss.EntityWither");

// Helper function to remove Minecraft color codes
function stripColorCodes(text) {
    return text.replace(/§[0-9A-FK-OR]/gi, "");
}

register("renderWorld", () => {
    if (!bossHighlightEnabled) return;

    World.getAllEntitiesOfType(witherEntity.class).forEach(entity => {
        let name = entity.getName();
        let cleanName = stripColorCodes(name);
        let color = getWitherColor(cleanName);
        if (!color) return; // Skip if the Wither isn't one of the bosses

        // Use actual world coordinates instead of render coordinates
        let x = entity.getX();
        let y = entity.getY();
        let z = entity.getZ();
        let rotationYaw = entity.getYaw(); // Get Wither rotation angle

        let bodyWidth = 1.5;
        let bodyHeight = 2.0;
        let headSize = 1.2;
        let ribOffset = 0.5;

        // Convert rotation angle to radians for calculations
        let rad = (-rotationYaw) * (Math.PI / 180);

        // Function to rotate coordinates around the Y-axis
        function rotateOffset(xOffset, zOffset) {
            return {
                x: xOffset * Math.cos(rad) - zOffset * Math.sin(rad),
                z: xOffset * Math.sin(rad) + zOffset * Math.cos(rad),
            };
        }

        GL11.glPushMatrix();
        GL11.glLineWidth(3.0);
        GL11.glEnable(GL11.GL_BLEND);
        GL11.glDisable(GL11.GL_TEXTURE_2D);
        GL11.glDisable(GL11.GL_DEPTH_TEST);
        GL11.glColor4f(color[0], color[1], color[2], 1.0);
        Tessellator.begin(3);

        // Draw main body (torso)
        drawWireBox(x, y, z, bodyWidth, bodyHeight, bodyWidth);

        // Draw three heads (with rotation applied)
        let leftHead = rotateOffset(-1.5, 0);
        let centerHead = rotateOffset(0, 0);
        let rightHead = rotateOffset(1.5, 0);
        drawWireBox(x + leftHead.x, y + 2, z + leftHead.z, headSize, headSize, headSize);
        drawWireBox(x + centerHead.x, y + 2.5, z + centerHead.z, headSize, headSize, headSize);
        drawWireBox(x + rightHead.x, y + 2, z + rightHead.z, headSize, headSize, headSize);

        // Draw ribs (with rotation applied)
        let leftRib = rotateOffset(-ribOffset, 0);
        let rightRib = rotateOffset(ribOffset, 0);
        drawWireBox(x + leftRib.x, y + 1, z + leftRib.z, 0.3, 0.8, 0.3);
        drawWireBox(x + rightRib.x, y + 1, z + rightRib.z, 0.3, 0.8, 0.3);

        Tessellator.draw();

        GL11.glEnable(GL11.GL_TEXTURE_2D);
        GL11.glEnable(GL11.GL_DEPTH_TEST);
        GL11.glDisable(GL11.GL_BLEND);
        GL11.glPopMatrix();
    });
});

// Returns a custom color for boss withers based on their name (using stripped names).
// Returns null if the Wither isn't one of the bosses.
function getWitherColor(name) {
    if (name.includes("Necron")) return [1.0, 0.5, 0.0]; // Orange
    if (name.includes("Storm"))  return [0.0, 0.5, 1.0]; // Blue
    if (name.includes("Maxor"))  return [0.5, 0.0, 1.0]; // Purple
    if (name.includes("Goldor")) return [0.5, 0.5, 0.5]; // Grey
    return null;
}

// Helper function to draw a wireframe box at a given position and size.
function drawWireBox(x, y, z, width, height, depth) {
    let w = width / 2;
    let h = height / 2;
    let d = depth / 2;

    // Bottom square
    Tessellator.pos(x - w, y - h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y - h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y - h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y - h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y - h, z - d).tex(0, 0);

    // Top square
    Tessellator.pos(x - w, y + h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y + h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y + h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y + h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y + h, z - d).tex(0, 0);

    // Vertical edges connecting top and bottom squares
    Tessellator.pos(x - w, y - h, z - d).tex(0, 0);
    Tessellator.pos(x - w, y + h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y - h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y + h, z - d).tex(0, 0);
    Tessellator.pos(x + w, y - h, z + d).tex(0, 0);
    Tessellator.pos(x + w, y + h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y - h, z + d).tex(0, 0);
    Tessellator.pos(x - w, y + h, z + d).tex(0, 0);
}
