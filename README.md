# **TableTop Create**

A comprehensive application developed to help people of all skill levels design and playtest board games!

_Currently in development..._

## Features
### Complete:
- editor views for each asset type and ability to switch between open editors
- resizing for global editor window
- titlebar with menus (no functionality assigned to submenus) and close/max/restore/min buttons

### In Progress:
- bug fixes! known bugs:
    - application flicker on exiting modal window (Electron modals are weird, maybe just implement own modal)
- Editor Assets!
    - models: card, deck, board, token
    - angular component for each model: displaying / editing assets
- develop a JSON format for eventual saving/loading of projects
- project service for saving, loading, component work synchronization
- complete editor functionality for each asset editor
- titlebar menu functionality... they look nice, but buttons should do something
- polish modal view for opening a new editor

### TODO (unordered):
- settings service for user preferences
- dynamic updating of current editor mode in creator-window component (fancy for: actually update editor view when changing view)

### TODO... but in a very very distant future and possibly never:
- in application playtesting... would be local, turn-based multiplayer... not online- im not THAT cool
- importing 3d models from blender
