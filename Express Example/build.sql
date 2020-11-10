SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `redis_demo` DEFAULT CHARACTER SET latin1 ;
USE `redis_demo` ;

-- -----------------------------------------------------
-- Table `redis_demo`.`user_login`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `redis_demo`.`user_login` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '',
  `user_email` VARCHAR(50) NOT NULL COMMENT '',
  `user_password` VARCHAR(50) NOT NULL COMMENT '',
  `user_name` VARCHAR(50) NOT NULL COMMENT '',
  PRIMARY KEY (`user_id`)  COMMENT '',
  UNIQUE INDEX `user_email` (`user_email` ASC)  COMMENT '')
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = latin1;

-- -----------------------------------------------------
-- Table `redis_demo`.`user_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `redis_demo`.`user_status` (
  `user_id` INT(11) NOT NULL COMMENT '',
  `user_status` TEXT NOT NULL COMMENT '',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '',
  INDEX `user_id` (`user_id` ASC)  COMMENT '',
  CONSTRAINT `user_status_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `redis_demo`.`user_login` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;