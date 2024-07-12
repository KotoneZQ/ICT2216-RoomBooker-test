#Add these for the sql to work in terminal
DROP DATABASE roombooker;
CREATE DATABASE roombooker;
C:\Users\Isaiah\Desktop\roombooker>mysql -u root -p roombooker < C:\Users\Isaiah\Desktop\ICT2216-RoomBooker\backend\sql_scripts\Create_table.sql
C:\Users\Isaiah\Desktop\roombooker>mysql -u root -p roombooker < C:\Users\Isaiah\Desktop\ICT2216-RoomBooker\backend\sql_scripts\roomtypes.sql
C:\Users\Isaiah\Desktop\roombooker>mysql -u root -p roombooker < C:\Users\Isaiah\Desktop\ICT2216-RoomBooker\backend\sql_scripts\roomdetails.sql

mysql> USE roombooker
Database changed
mysql> SHOW TABLES;

#To change user to admin
mysql> UPDATE user
    -> SET role = 'admin'
    -> WHERE email = 'tanzest12@gmail.com';





https://imgur.com/a/RUzvq7a
