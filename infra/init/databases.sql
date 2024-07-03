CREATE DATABASE IF NOT EXISTS `gs_certificates`;
CREATE DATABASE IF NOT EXISTS `gs_certificates_shadow`;

# create root user and grant rights
CREATE USER 'root'@'localhost' IDENTIFIED BY 'local';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';