/**
 * index.js for mod adu
 * This file contains all the code needed for testing your GUI.
 * The /adu command is registered at the very top.
 */

// ------------------- Command Registration -------------------
// Declare hudManager as a global variable so the command callback can access it.
let hudManager = null;

// Register the /adu command first using the proper method chain.
register("command", () => {
    if (hudManager) {
        hudManager.openGui();
    } else {
        ChatLib.chat("HUD Manager not loaded yet.");
    }
}).setName("adu");

// ------------------- Dummy Implementations -------------------
class Gui {
    constructor() {
        this.closedCallback = null;
    }
    open() {
        console.log("GUI opened.");
        // Simulate the GUI remaining open for 5 seconds then closing.
        setTimeout(() => {
            console.log("GUI closed.");
            if (this.closedCallback) this.closedCallback();
        }, 5000);
    }
    registerClosed(callback) {
        this.closedCallback = callback;
    }
}

class Text {
    constructor(str) {
        this.str = str;
        this.shadow = false;
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }
    setShadow(val) {
        this.shadow = val;
        return this;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setScale(scale) {
        this.scale = scale;
        return this;
    }
    setString(str) {
        this.str = str;
        return this;
    }
    getWidth() {
        // Simulate width based on string length
        return this.str.length * 5 * this.scale;
    }
    getHeight() {
        // Simulate fixed height factor
        return 10 * this.scale;
    }
    draw() {
        console.log(`Drawing text "${this.str}" at (${this.x}, ${this.y}) with scale ${this.scale} and shadow ${this.shadow}`);
    }
}

class Rectangle {
    constructor(color, x, y, width, height) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    setX(x) {
        this.x = x;
        return this;
    }
    setY(y) {
        this.y = y;
        return this;
    }
    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    draw() {
        console.log(`Drawing rectangle with color ${this.color} at (${this.x}, ${this.y}) with size ${this.width}x${this.height}`);
    }
}

const Renderer = {
    screen: {
        getWidth: () => 800,
        getHeight: () => 600
    },
    drawRect: (color, x, y, width, height) => {
        console.log(`Renderer drawing rect with color ${color} at (${x}, ${y}) with size ${width}x${height}`);
    }
};

const ChatLib = {
    chat: (msg) => console.log("ChatLib: " + msg),
    removeFormatting: (str) => str.replace(/§./g, '')
};

const Server = {
    getIP: () => "hypixel.net"
};

const Scoreboard = {
    getTitle: () => "§aSKYBLOCK Scoreboard"
};

const GlStateManager = {
    func_179147_l: () => console.log("GlStateManager: enabling blend"),
    func_179084_k: () => console.log("GlStateManager: disabling blend")
};

class TextComponent {
    constructor(text) {
        this.text = text;
        this.hover = "";
    }
    setHoverValue(value) {
        this.hover = value;
        return this;
    }
    toString() {
        return this.text + " " + this.hover;
    }
}

// Dummy register function that simulates event registration.
// For non-command events, it logs the event registration.
function register(event, callback) {
    if (event === "command") {
        // This branch is never used here since the command is registered above.
    } else {
        console.log(`Registered event: ${event}`);
    }
    return {
        event: event,
        callback: callback,
        unregister: () => {
            console.log(`Unregistered event: ${event}`);
        },
        register: () => {
            console.log(`Re-registered event: ${event}`);
        }
    };
}

// ------------------- Register Handling -------------------
let registers = [];
const registerWhen = (trigger, dependency, debugInfo = { type: '', name: '' }) => {
    registers.push([trigger.unregister(), dependency, false, debugInfo]);
};

const settings = {
    debugmode: true
};

const CHAT_PREFIX = "[Adu]";

const setRegisters = () => {
    let registerInfo = '';
    let unregisterInfo = '';
    let registerCount = 0;
    let unregisterCount = 0;
    registers.forEach((trigger) => {
        if (trigger[1]() && !trigger[2]) {
            trigger[0].register();
            trigger[2] = true;
            registerInfo += `${trigger[3].type} of ${trigger[3].name}, `;
            if (registerCount % 3 === 2) registerInfo += '\n';
            registerCount++;
        } else if (!trigger[1]() && trigger[2]) {
            trigger[0].unregister();
            trigger[2] = false;
            unregisterInfo += `${trigger[3].type} of ${trigger[3].name}, `;
            if (unregisterCount % 3 === 2) unregisterInfo += '\n';
            unregisterCount++;
        }
    });
    if (settings.debugmode) {
        if (!(registerCount === 0 && unregisterCount === 0)) {
            const debugMessage = new TextComponent(`${CHAT_PREFIX} [DEBUG] Registered or unregistered triggers.`)
                .setHoverValue(`Registered:\n${registerInfo}\n\nUnregistered:\n${unregisterInfo}`);
            ChatLib.chat(debugMessage.toString());
        }
    }
};

setTimeout(() => {
    setRegisters();
}, 1000);

// ------------------- HudManager Class -------------------
class HudManager {
    constructor() {
        this.gui = new Gui();
        this.isEditing = false;
        this.selectedHudName = '';
        this.gui.registerClosed(() => {
            this.isEditing = false;
            setRegisters();
        });
    }

    /**
     * Open hud edit gui.
     */
    openGui = () => {
        this.gui.open();
        this.isEditing = true;
    }

    /**
     * Select hud for editing.
     * @param {string} name 
     */
    selectHud = (name) => {
        this.selectedHudName = name;
    }

    /**
     * Release hud selection.
     */
    unselectHud = () => {
        this.selectedHudName = '';
    }
}

// ------------------- Hud Class -------------------
class Hud {
    /**
     * Class for text hud.
     * @param {string} name 
     * @param {string} defaultText 
     * @param {HudManager} hudManager 
     * @param {any} data 
     * @param {boolean} [isCustom=false] 
     * @param {boolean} [background=false] 
     * @param {any} [color=null] 
     */
    constructor(name, defaultText, hudManager, data, isCustom = false, background = false, color = null) {
        this.name = name;
        this.defaultText = defaultText;
        this.hudManager = hudManager;
        this.saveData = () => {
            data.save();
        }
        if (isCustom) {
            this.data = data.data.filter(d => d.name === name)[0];
        } else {
            this.data = data[name];
        }
        this.background = background;
        this.color = color;
        this.currentText = new Text(defaultText).setShadow(true);
        this.editBox = new Rectangle(0x9696964d, 0, 0, 0, 0);
        this.dragTrigger = register('dragged', (dx, dy) => {
            if (!this.hudManager.isEditing) return;
            if (hudManager.selectedHudName === this.name) {
                const [current_x, current_y] = this.getCoords();
                this.setCoords(current_x + dx, current_y + dy);
            }
        });
        this.scrollTrigger = register('scrolled', (x, y, d) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                const scale = this.getScale();
                if (d === 1 && scale < 10)
                    this.setScale(scale + 0.1);
                else if (scale > 0.5)
                    this.setScale(scale - 0.1);
            }
        });
        this.renderOverlayTrigger = register('renderOverlay', () => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const scale = this.getScale();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            this.editBox.setX(current_x - 3).setY(current_y - 3).setWidth(width + 3).setHeight(height + 3).draw();
            this.currentText.setX(current_x).setY(current_y).setScale(scale).draw();
        });
        this.clickTrigger = register('clicked', (x, y, b, isDown) => {
            if (!this.hudManager.isEditing) return;
            const [current_x, current_y] = this.getCoords();
            const width = this.currentText.getWidth();
            const height = this.currentText.getHeight();
            if (x >= current_x - 3 && x <= current_x + width + 3 && y >= current_y - 3 && y <= current_y + height + 3) {
                if (isDown && hudManager.selectedHudName === '') {
                    hudManager.selectHud(this.name);
                } else {
                    hudManager.unselectHud();
                }
            }
            if (!isDown) {
                hudManager.unselectHud();
            }
        });
    }

    /**
     * Remove this hud.
     */
    remove = () => {
        this.dragTrigger.unregister();
        this.scrollTrigger.unregister();
        this.renderOverlayTrigger.unregister();
        this.clickTrigger.unregister();
        this.name = null;
        this.defaultText = null;
        this.hudManager = null;
        this.saveData = null;
        this.currentText = null;
        this.editBox = null;
    }

    /**
     * Get hud coords.
     * @returns 
     */
    getCoords = () => {
        const x = this.data.x;
        const y = this.data.y;
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        return [width * x, height * y];
    }

    /**
     * Set hud coords.
     * @param {number} x 
     * @param {number} y 
     */
    setCoords = (x, y) => {
        const width = Renderer.screen.getWidth();
        const height = Renderer.screen.getHeight();
        this.data.x = x / width;
        this.data.y = y / height;
        this.saveData();
    }

    /**
     * Get hud scale.
     * @returns {number} scale
     */
    getScale = () => {
        return this.data.scale;
    }

    /**
     * Set hud scale.
     * @param {number} scale 
     */
    setScale = (scale) => {
        this.data.scale = scale;
        this.saveData();
    }

    /**
     * Set text. (mainly for custom hud)
     * @param {string} text 
     */
    setText = (text) => {
        this.currentText.setString(text);
    }

    /**
     * Draw hud.
     * @param {string} text 
     * @param {boolean} skyblockOnly
     */
    draw = (text, skyblockOnly = true) => {
        if (!this.hudManager.isEditing) {
            if (skyblockOnly) {
                if (Server.getIP().includes('hypixel') && ChatLib.removeFormatting(Scoreboard.getTitle()).includes('SKYBLOCK')) {
                    GlStateManager.func_179147_l();
                    const [x, y] = this.getCoords();
                    const scale = this.getScale();
                    if (this.background) {
                        Renderer.drawRect(
                            this.color,
                            x - 3,
                            y - 3,
                            this.currentText.getWidth() + 3,
                            this.currentText.getHeight() + 3
                        );
                    }
                    this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
                    GlStateManager.func_179084_k();
                }
            } else {
                GlStateManager.func_179147_l();
                const [x, y] = this.getCoords();
                const scale = this.getScale();
                if (this.background) {
                    Renderer.drawRect(
                        this.color,
                        x - 3,
                        y - 3,
                        this.currentText.getWidth() + 3,
                        this.currentText.getHeight() + 3
                    );
                }
                this.currentText.setString(text).setX(x).setY(y).setScale(scale).draw();
                GlStateManager.func_179084_k();
            }
        }
    }
}

// ------------------- Testing Code -------------------

// Dummy hud data for testing. In a real mod this would be saved/loaded data.
const hudData = {
    myHud: {
        x: 0.1,
        y: 0.1,
        scale: 1,
        save: () => { console.log("HUD data saved for myHud"); }
    }
};

// Create an instance of Hud for testing.
const myHud = new Hud("myHud", "Hello, Adu!", (hudManager = new HudManager()), hudData);

// Simulate drawing the hud every 2 seconds.
setInterval(() => {
    myHud.draw("Hello, Adu!");
}, 2000);

// Expose global functions for testing.
// Use openHudGui() in your console to open the HUD edit GUI.
global.openHudGui = () => {
    console.log("Opening HUD GUI...");
    hudManager.openGui();
};

// For testing: simulate a click event on the hud by calling simulateClick(x, y, isDown)
// Example: simulateClick(90, 90, true);
global.simulateClick = (x, y, isDown) => {
    if (myHud.clickTrigger && myHud.clickTrigger.callback) {
        myHud.clickTrigger.callback(x, y, 0, isDown);
    }
};

console.log("Adu mod loaded. Use /adu to open the HUD editor.");
