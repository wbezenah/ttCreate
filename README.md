# **TableTop Create**

A comprehensive application developed to help people of all skill levels design and playtest board games!

_Currently in development..._

## Features
### Complete:
- Editor views for each asset type and ability to switch between open editors
- Dynamic and flexible resizing for global editor window and subwindows
- Titlebar with menus (no functionality assigned to submenus) and close/max/restore/min buttons
    - Save / Load now opens a dialog for saving/loading project files
- Assets:
    - Token Asset functionality: Set background image, change Shape (Rectangle, Circle)
- Custom modal for creating a new Asset/Editor

### In Progress:
- Refactor asset dragging/resizing
    - Parent AssetComponent that each asset will extend that deals with resizing and dragging. No longer use drag/resize directive
- bug fixes! known bugs:
    - assets don't save position/size on refreshing editor
- Refactor editor host based on redesign (will allow expanded work area beyond window with scrollbar to navigate editor)
- Token Asset, Token Component, Token Editor Components
- Project service
    - Map from Asset Type to list of assets
    - saving, loading, component work synchronization
- Make custom modal API more flexible to allow for different modals in different contexts

### TODO (unordered):
- Editor Assets!
    - models: card, deck, board
    - angular component for each model: displaying / editing assets
- Titlebar menu functionality... they look nice, but buttons should do something
- Settings service for user preferences

### TODO... but in a very very distant future and possibly never:
- in application playtesting... would be local, turn-based multiplayer... not online- im not THAT cool
- importing 3d models from blender
