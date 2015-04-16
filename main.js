/**
 * Copyright (c) 2013 Miguel Castillo.
 *
 * Licensed under MIT
 */

define(function( require, exports, module ) {
  "use strict";

  var _                  = brackets.getModule("thirdparty/lodash");
  var AppInit            = brackets.getModule("utils/AppInit");
  var DocumentManager    = brackets.getModule("document/DocumentManager");
  var Commands           = brackets.getModule("command/Commands");
  var CommandManager     = brackets.getModule("command/CommandManager");
  var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
  var ProjectManager     = brackets.getModule("project/ProjectManager");
  var Menus              = brackets.getModule("command/Menus");
  var PREFERENCES_KEY    = "brackets-filetree-sync";
  var prefs              = PreferencesManager.getExtensionPrefs(PREFERENCES_KEY);
  var menu               = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
  var COMMAND_ID         = PREFERENCES_KEY;
  var command            = CommandManager.register("File Tree Sync", COMMAND_ID, setEnabled);


  prefs.definePreference("enabled", "boolean", false).on("change", function() {
    var value = prefs.get("enabled");
    if (value !== command.getChecked()) {
      command.setChecked(value);
    }
  });

  menu.addMenuDivider();
  menu.addMenuItem(COMMAND_ID);


  function setEnabled() {
    prefs.set("enabled", !command.getChecked());
  }


  function initialize() {
    command.setChecked(prefs.get("enabled"));
    DocumentManager.on("currentDocumentChange", _.debounce(function() {
      var doc = DocumentManager.getCurrentDocument();
      if (prefs.get("enabled") &&  doc) {
        ProjectManager.showInTree(doc.file);
      }
    }, 250));
  }


  AppInit.appReady(initialize);
});
