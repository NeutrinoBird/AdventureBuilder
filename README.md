This is a system for building web adventure games. It is currently a work-in-progress, though the builder portion of the project is fully functional.

## SETUP

The folder structure for this project assumes that the DocumentRoot of the server is pointed to the public directory, while the include_path in php.ini is pointed to the includes directory. If you lack the permissions to configure these settings, you will need to move the files to your server's site root and include folders, respectively.

You will need to set up a number of tables in a MySQL database. The queries to create and populate these tables can be found in tableSetup.sql, in the project root directory.

Additionally, you will need to modify includes/Adventure/DatabaseLogin.php. This file contains the MySQL connection login info, which you will need to provide. This information includes the host DSN, username and password for the MySQL user, and the name of the database containing the new tables.

## USAGE

When the project is set up, immediately run AdventureBuilder.php in public/Adventure/. You will see a login screen. When there are no users, then this login form will actually create an admin user, so be immediately prepared to create one. 
The adventure builder operates with a session-based login system. Only active users with an active session can save data. Sessions expire after an hour from the last activity. If a session expires, a login prompt will appear. Any unsaved changes will not be lost, provided the user does not navigate away from the page.
The admin user can create new users by clicking the New User button in the bottom left corner of the page.
In the bottom left corner, there is also a button to toggle effects. This will disable the blur filter and CSS animations of the interface.
