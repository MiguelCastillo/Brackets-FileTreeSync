/*
 * Copyright (c) 2013 Miguel Castillo.
 * Licensed under MIT
 */


define(function( require, exports, module ) {

  var AppInit             = brackets.getModule("utils/AppInit"),
      DocumentManager     = brackets.getModule("document/DocumentManager"),
      CommandManager      = brackets.getModule("command/CommandManager"),
      PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
      ProjectManager      = brackets.getModule("project/ProjectManager"),
      Menus               = brackets.getModule("command/Menus"),
      String              = brackets.getModule("strings");

  var PREFERENCES_KEY = "extensions.brackets-filetreesync";
  var preferences = PreferencesManager.getPreferenceStorage(PREFERENCES_KEY);
  var enabled = preferences.getValue("enabled") === true;
  var menu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
  var COMMAND_ID = "filetreesync.enable";

  // Register menu event...
  CommandManager.register("File Tree Sync", COMMAND_ID, function () {
    enabled = !enabled;
    preferences.setValue("enabled", enabled);
    this.setChecked(enabled);
  });

  // Add menu
  menu.addMenuDivider();
  menu.addMenuItem(COMMAND_ID);

  // Set value saved value in the menu
  CommandManager.get("filetreesync.enable").setChecked(enabled);

  // Make sure we persist the prefence value after we close brackets
  preferences.setValue("enabled", enabled);

  AppInit.appReady(function () {
    $(DocumentManager).on("currentDocumentChange", function(evt) {
      if ( enabled ) {
        ProjectManager.showInTree(DocumentManager.getCurrentDocument().file);
      }
    });
  });

});

