# Cloning WhatsApp to chatting client on web interface
# Using WebStorm IDE and Chrome as a browser to test and debug the application.
Actions:
- Design main screen interface.
- Adding important files for AngularJS.
- Adding ng-embed library to use it as directive or filter while message rendering.

Challenges:
- Designing the interfaces to be responsive.
- Extracting WhatsApp needed icons from the APK.
- Loading javascript files without blocking the UI.
- Loading three pages in parallel or according to selection? ng-switch remove and add the DOM elements,
so I went to load the subviews using ng-switch and ng-include.
- ng-switch doesn't work with ui.router module, I went back to ng-if.