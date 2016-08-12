This is a system for building web adventure games. It is currently a work-in-progress, though the builder portion of the project is fully functional.

The project requires a PHP/MySQL server to function. It implements Backbone.js, Marionette.js, jQuery, and Bootstrap to drive the interface. All stylesheets are compiled via SASS. Eventually, all JavaScript files in this project will be compiled and minified.

## SETUP

The folder structure for this project assumes that the DocumentRoot of the server is pointed to the public directory, while the include_path in php.ini is pointed to the includes directory. If you lack the permissions to configure these settings, you will need to move the files to your server's site root and include folders, respectively.

You will need to set up a number of tables in a MySQL database. The queries to create and populate these tables can be found in tableSetup.sql, in the project root directory.

Additionally, you will need to modify includes/Adventure/DatabaseLogin.php. This file contains the MySQL connection login info, which you will need to provide. This information includes the host DSN, username and password for the MySQL user, and the name of the database containing the new tables.

## USAGE

When the project is set up, immediately run AdventureBuilder.php in public/Adventure/. You will see a login screen. When there are no users, then this login form will actually create an admin user, so be immediately prepared to create one. 

The adventure builder operates with a session-based login system. Only active users with an active session can save data. Sessions expire after an hour from the last activity. If a session expires, a login prompt will appear. Any unsaved changes will not be lost, provided the user does not navigate away from the page.

The admin user can create new users by clicking the New User button in the bottom left corner of the page.

In the bottom left corner, there is also a button to toggle effects. This will disable the blur filter and CSS animations of the interface.

In this system, an adventure is comprised of the following elements:
- The **Adventure** is the main root component. It contains all of its own elements. No two adventures share any elements.
- An adventure is composed of multiple **Pages**. These can be narratives, locations, dialogues, obstacles, endings, etc.
- Each page contains multiple **Actions**. These are shown to the player in the form of action choices and dialogue boxes. Selecting these will cause the user to change pages or trigger events.
- A **Requirement** is a condition applied to an action. Multiple requirements can be assigned to an action, and all must be fulfilled for the action to appear.
- A **Scene** is basically a collection of pages. Actions and events assigned to a scene will be applied on each page.
- A **Flag** is a variable used in an adventure. By default, it is a true or false value. It can optionally be a numeric counter, or serve as an inventory item visible to the player. A flag's value can influence the conditions of action requirements and events.
- An **Event** can be applied to any page, action, or scene. These trigger changes in flags, and can also change the current page under the proper conditions.
- An **Image** can be uploaded to be displayed above any page, or used as an icon for an inventory item.
- An **Effect** is a CSS animation that is applied to a page image.

The adventure builder manages the above elements in an organized fashion. After creating an adventure, you can create new pages, and from there, you can create new actions, and so on. Whenever you create an element from a parent element, a new form will appear over the parent form. You can proceed to input the attributes of the child element, and then either save it or delete it. With the exception of pages, any element type can be created from another element that utilizes it. From the main adventure edit form, you can access and edit the collections of scenes, images, effects, and flags.
