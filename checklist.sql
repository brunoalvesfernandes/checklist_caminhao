-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para checklist
DROP DATABASE IF EXISTS `checklist`;
CREATE DATABASE IF NOT EXISTS `checklist` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `checklist`;

-- Copiando estrutura para tabela checklist.checklist
DROP TABLE IF EXISTS `checklist`;
CREATE TABLE IF NOT EXISTS `checklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quest` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela checklist.checklist: ~1 rows (aproximadamente)
INSERT INTO `checklist` (`id`, `quest`) VALUES
	(1, '[\r\n    {\r\n        "id": 1,\r\n        "img": "https://scbrasil.com/wp-content/uploads/2018/06/2018-06-24-O-uso-do-cracha-funcional-e-sua-importancia-800x418.jpg",\r\n        "quest": "Portando Cartão de Habilitação ? Fazendo o uso em local visível ?"\r\n    },\r\n    {\r\n        "id": 2,\r\n        "img": "https://blog.acoplastbrasil.com.br/wp-content/uploads/2019/03/2-tipos-de-manuten%C3%A7%C3%A3o-preventiva.png",\r\n        "quest": "Verificou o cartão de preventiva ?"\r\n    },\r\n    {\r\n        "id": 3,\r\n        "img": "https://thumbs.dreamstime.com/b/as-pastilhas-dos-freios-e-o-acelerador-na-empilhadeira-115552398.jpg",\r\n        "quest": "Verificou os ferios ?"\r\n    },\r\n    {\r\n        "id": 4,\r\n        "img": "https://http2.mlstatic.com/botoeira-p-parada-de-emergncia-D_NQ_NP_6130-MLB5030285738_092013-F.jpg",\r\n        "quest": "Botão de Emergência funcionando ?"\r\n    },\r\n    {\r\n        "id": 5,\r\n        "img": "https://www.hiperfireextintores.com.br/blog/wp-content/uploads/2019/01/como-utilizar-os-extintores-de-incendio-corretamente.jpg",\r\n        "quest": "Extintor de incêndio tudo normal ?"\r\n    },\r\n    {\r\n        "id": 6,\r\n        "img": "https://doutormultas.com.br/wp-content/uploads/2017/11/vazamento-de-oleo-principais-causas-o-que-fazer-.jpg",\r\n        "quest": "Verificou vazamento de ôleo ?"\r\n    },\r\n    {\r\n        "id": 7,\r\n        "img": "https://www.juncaoequipamentos.com.br/wp-content/uploads/curva-300x300.jpg",\r\n        "quest": "Verificou corrente da torre ?"\r\n    },\r\n    {\r\n        "id": 8,\r\n        "img": "https://www.guia123achei.com.br/fotos_cliente/67115031_106832813973525_5772881481177235456_o.jpg",\r\n        "quest": "Verificou condições da mangueira hidráulica ?"\r\n    },\r\n    {\r\n        "id": 9,\r\n        "img": "https://lifttruckstuff.com/wp-content/uploads/2021/03/Magnetic-Fork-Covers4-300x300.png",\r\n        "quest": "Verificou condições dos garfos ?"\r\n    },\r\n    {\r\n        "id": 10,\r\n        "img": "https://www.marianopneus.com.br/template/imagens/palavras-chave/pneus-pneumaticos-para-empilhadeiras.jpg",\r\n        "quest": "Verificou condições das rodas ?"\r\n    },\r\n    {\r\n        "id": 11,\r\n        "img": "https://sibratel.com.br/home/wp-content/uploads/2020/04/saiba-a-importancia-do-painel-de-instrumentos.jpg",\r\n        "quest": "Esta funcionando o painel ?"\r\n    },\r\n    {\r\n        "id": 12,\r\n        "img": "https://www.equipolog.com.br/images/pintura-empilhadeira-01.jpg",\r\n        "quest": "Situação de pintura e faixas ?"\r\n    },\r\n    {\r\n        "id": 13,\r\n        "img": "https://ae01.alicdn.com/kf/HTB1VlBKzwaTBuNjSszfq6xgfpXa2/10W-High-quality-Blue-LED-Forklift-Safety-Light-Spot-Light-Warehouse-Safe-Warning-Light-9V-60V.jpg",\r\n        "quest": "Situação das lâmpadas, sinalização e buzina ?"\r\n    },\r\n    {\r\n        "id": 14,\r\n        "img": "https://www.jchiquitto.com.br/assets/images/protetor-500x500.jpg",\r\n        "quest": "Protetor de carga esta ok ?"\r\n    }\r\n]');

-- Copiando estrutura para tabela checklist.inspec
DROP TABLE IF EXISTS `inspec`;
CREATE TABLE IF NOT EXISTS `inspec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `res` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando estrutura para tabela checklist.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `truck` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `admin` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela checklist.users: ~1 rows (aproximadamente)
INSERT INTO `users` (`id`, `login`, `password`, `firstName`, `lastName`, `truck`, `token`, `avatar`, `admin`) VALUES
	(1, '77074599', '45c48cce2e2d7fbdea1afc51c7c6ad26', 'Bruno', 'Alves', '31', '0ade7c2cf97f75d009975f4d720d1fa6c19f4897', NULL, 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
