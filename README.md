# **TableTop Create**

A comprehensive application developed to help people of all skill levels design and playtest board games!

_Currently in development..._

## Features
### Complete:
- editor views for each asset type and ability to switch between open editors
- resizing for global editor window
- titlebar with menus (no functionality assigned to submenus) and close/max/restore/min buttons
    - Save / Load now opens a dialog for saving/loading project files
- Assets:
    - Token Asset functionality: Set background image, change Shape (Rectangle, Circle)

### In Progress:
- Refactor asset dragging/resizing
    - Parent AssetComponent that each asset will extend that deals with resizing and dragging. No longer use drag/resize directive
- bug fixes! known bugs:
    - application flicker on exiting modal window (Electron modals are weird, maybe just implement own modal)
    - assets don't save position/size on refreshing editor
- Refactor editor host based on redesign (will allow expanded work area beyond window with scrollbar to navigate editor)
- Token Asset, Token Component, Token Editor Components
- project service
    - Map from Asset Type to list of assets
    - saving, loading, component work synchronization

### TODO (unordered):
- Editor Assets!
    - models: card, deck, board
    - angular component for each model: displaying / editing assets
- titlebar menu functionality... they look nice, but buttons should do something
- switch to custom modal for opening a new editor
- settings service for user preferences

### TODO... but in a very very distant future and possibly never:
- in application playtesting... would be local, turn-based multiplayer... not online- im not THAT cool
- importing 3d models from blender
