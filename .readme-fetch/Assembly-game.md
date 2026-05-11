# Assembly Platformer Game

A 2D pixel platformer written entirely in **MIPS Assembly** for the [MARS](http://courses.missouristate.edu/KenVollmar/MARS/) simulator. The game uses MARS's Bitmap Display and Keyboard MMIO to render three increasingly difficult levels packed with hazards, power-ups, and moving platforms.

Built as the final project for **CSCB58 (Winter 2025)** at the University of Toronto Scarborough.

[Video demonstration](https://play.library.utoronto.ca/watch/91fbfccf68d6ac0fa3e91a8bdc80c8ec)

---

## Gameplay

You control a blue character that must navigate from the starting tile to a **gold goal tile** to advance to the next level. Reach the end of all three levels to win.

- Avoid red hazards (each touch costs one heart).
- Collect power-ups for an edge on harder levels.
- Stand on white platforms to walk and jump from them.
- Some platforms move or disappear on a timer, so plan your jumps carefully.

You start with **3 hearts**. Run out of hearts and it's game over.

### Controls

| Key | Action          |
|-----|-----------------|
| `A` | Move left       |
| `D` | Move right      |
| `W` | Jump            |
| `R` | Restart         |
| `Q` | Quit / end game |

### Power-ups

| Color  | Power-up           | Effect                                 |
|--------|--------------------|----------------------------------------|
| Pink   | Extra health       | Restores / grants an additional heart  |
| Green  | Super jump         | Significantly increased jump height    |
| Other  | Invincibility      | Temporarily ignore hazards             |

### Levels

The game ships with **3 hand-designed levels** stored as raw bitmap data in the `.data` section:

1. **Level 1** &ndash; Introduction to movement, jumping, and basic hazards.
2. **Level 2** &ndash; Adds power-up pickups and more complex platforming.
3. **Level 3** &ndash; Introduces moving / disappearing platforms on a 60-tick timer.

Win and game-over screens (`win` and `finish` bitmaps) are drawn from the same memory layout.

---

## Implemented Features

This submission completes **all four milestones** of the course assignment.

**Milestone 3 features:**
- Player health system
- Win condition (reaching the goal on level 3)
- Fail condition (running out of health)

**Milestone 4 features:**
- Disappearing platforms (timer-based)
- 3 distinct levels
- 3 collectible pick-ups

---

## Running the Game

This project is designed for the **MARS MIPS Simulator** (tested with MARS 4.5).

1. Open MARS.
2. Open `game.asm`.
3. Open the **Bitmap Display** tool (`Tools` &rarr; `Bitmap Display`) and configure it as follows:
   - Unit width in pixels: **8**
   - Unit height in pixels: **8**
   - Display width in pixels: **512**
   - Display height in pixels: **512**
   - Base address for display: **`0x10008000` (`$gp`)**
   - Click **Connect to MIPS**.
4. Open the **Keyboard and Display MMIO Simulator** (`Tools` &rarr; `Keyboard and Display MMIO Simulator`) and click **Connect to MIPS**.
5. Assemble (`F3`) and run (`F5`) the program.
6. Click into the MMIO simulator's input box so it receives keystrokes, then play using the controls above.

> If the character does not respond to input, make sure the MMIO simulator is connected and focused. Keyboard input is read from memory address `0xFFFF0000` / `0xFFFF0004`.

---

## Project Structure

```
Assembly-game/
├── game.asm     # Full game source (data, levels, and code in a single file)
└── README.md
```

The single source file is organized as:

- **Equates / constants** &ndash; colors, base addresses, key positions for power-ups and moving platforms.
- **`.data` section** &ndash; mutable game state (`health`, `level`, `timer`, pickup flags) and the three level bitmaps plus `win` / `finish` screens.
- **`.text` section** &ndash; entry point and routines:
  - `boot` / `level1` / `level2` / `level3` &ndash; level loaders.
  - `key_input` / `key_pressed` &ndash; main input loop.
  - `left` / `right` / `jump_up` / `fall` &ndash; movement and gravity.
  - `mp` / `disappear` / `appear_p` &ndash; moving / disappearing platforms.
  - `add_health` / `add_jump` / `add_in` &ndash; power-up pickup logic.
  - `draw_heart` / `print_heart` &ndash; HUD rendering.
  - `hurt` / `end_game` / `pass` / `win_s` &ndash; win/lose flow.

---

## Technical Details

- **Architecture:** MIPS32 (MARS-compatible subset).
- **Display:** Memory-mapped bitmap at `0x10008000`, 64&times;64 cells of 8&times;8 pixels, RGB stored as 32-bit words.
- **Input:** Memory-mapped keyboard at `0xFFFF0000`; keycode read from `0xFFFF0004`.
- **Collision detection:** Color-based &mdash; the game inspects neighbouring pixels (e.g. `WHITE` = ground, `DANGER` = red spikes, `GOLD` = goal) to determine what the character is standing on or moving into.
- **Animation timing:** Tight `delay` busy-wait loop tuned for the MARS simulator's run speed.

---

## Author

**Alexander Zhang** &ndash; University of Toronto Scarborough &ndash; CSCB58 Winter 2025
