/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 8.0.36 : Database - carzone
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`carzone` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `carzone`;

/*Table structure for table `automobili` */

DROP TABLE IF EXISTS `automobili`;

CREATE TABLE `automobili` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marka` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `godina` int NOT NULL,
  `cijena` decimal(10,2) NOT NULL,
  `slika` varchar(255) NOT NULL,
  `kilometri` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `automobili` */

insert  into `automobili`(`id`,`marka`,`model`,`godina`,`cijena`,`slika`,`kilometri`) values 
(2,'BMW','M3',2021,80000.00,'images/3-Series-Howard-54-.avif',45000.00),
(5,'Lamborghini','Urus',2023,210000.00,'images/urus.jpg',23000.00),
(6,'Porsche','911 GT3 RS',2019,215000.00,'images/gt3rs.webp',44400.00),
(11,'Audi','RS7 Performance',2024,131000.00,'images/rs7.jpg',11000.00),
(14,'Ferrari','Purosangue',2024,710000.00,'images/ferrari.webp',350.00),
(19,'Ford','Mustang GT',2022,44000.00,'images/mustang.jpg',450.00);

/*Table structure for table `kupnje` */

DROP TABLE IF EXISTS `kupnje`;

CREATE TABLE `kupnje` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korisnik_id` int DEFAULT NULL,
  `automobil_id` int DEFAULT NULL,
  `datum` datetime DEFAULT CURRENT_TIMESTAMP,
  `cijena` decimal(10,2) DEFAULT NULL,
  `nacin_placanja` enum('gotovina','kredit','leasing') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `korisnik_id` (`korisnik_id`),
  KEY `automobil_id` (`automobil_id`),
  CONSTRAINT `kupnje_ibfk_1` FOREIGN KEY (`korisnik_id`) REFERENCES `users` (`id`),
  CONSTRAINT `kupnje_ibfk_2` FOREIGN KEY (`automobil_id`) REFERENCES `automobili` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `kupnje` */

insert  into `kupnje`(`id`,`korisnik_id`,`automobil_id`,`datum`,`cijena`,`nacin_placanja`) values 
(12,1,11,'2025-02-17 19:37:53',131000.00,'gotovina'),
(14,1,6,'2025-02-17 20:15:42',223000.00,'gotovina'),
(16,1,5,'2025-02-17 20:24:43',210000.00,'gotovina'),
(18,2,14,'2025-02-17 21:52:32',720000.00,'leasing'),
(19,3,2,'2025-02-17 21:59:25',80000.00,'kredit'),
(20,4,5,'2025-02-17 23:37:52',210000.00,'leasing'),
(21,5,5,'2025-02-18 00:03:10',210000.00,'gotovina'),
(22,1,19,'2025-02-18 00:05:55',44000.00,'leasing');

/*Table structure for table `specifikacije` */

DROP TABLE IF EXISTS `specifikacije`;

CREATE TABLE `specifikacije` (
  `id` int NOT NULL AUTO_INCREMENT,
  `automobil_id` int DEFAULT NULL,
  `motor` int DEFAULT NULL,
  `snaga` int DEFAULT NULL,
  `boja` varchar(255) DEFAULT NULL,
  `gorivo` enum('benzin','dizel','električni','hibrid') DEFAULT NULL,
  `mjenjac` enum('manualni','automatski') DEFAULT NULL,
  `pogon` enum('FWD','RWD','AWD') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `automobil_id` (`automobil_id`),
  CONSTRAINT `specifikacije_ibfk_1` FOREIGN KEY (`automobil_id`) REFERENCES `automobili` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `specifikacije` */

insert  into `specifikacije`(`id`,`automobil_id`,`motor`,`snaga`,`boja`,`gorivo`,`mjenjac`,`pogon`) values 
(3,2,3000,480,'siva s nijansom plave','benzin','automatski','RWD'),
(5,5,4000,650,'crna','benzin','automatski','AWD'),
(6,6,4000,530,'svijetloplava','benzin','manualni','RWD'),
(7,11,4000,630,'tamnoplava','benzin','automatski','AWD'),
(10,14,6500,735,'crna','benzin','automatski','RWD'),
(15,19,5000,450,'plava','benzin','automatski','RWD');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`name`,`email`,`role`) values 
(1,'dcirko','$2b$12$kJWnOR976LkKcD.mscvN4uWYcZ/JK2e57XkPj/afUAKjWoWWEz54u','Domagoj','domagoj.cirko@gmail.com','admin'),
(2,'1234','$2b$12$vgXeTlHlzanwbrHKtP8QVe65xztVNpHKZHUp9TF6cUZig5y/fFBGi','123','1234@gmail.com','user'),
(3,'dc','$2b$12$aOb0rtGlgzYp2KQz00Gu9edPvq5j.8V4OPZAtjBbm3WnDHlT8wbKO','dc','dcirko@tvz.hr','user'),
(4,'ivo123','$2b$12$vDS7vFjffwXyhc3jC5ql6.l7hBj6V4adMOSPi8Lhe.gutBIN4uH9S','ivo','ivo@gmail.com','user'),
(5,'josip123','$2b$12$VszpTdNsb.SiZItgDJuuOeetVXFggnfnYT0ctW/vVVrh//9IkLabK','josip','josip123@gmail.com','user');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
