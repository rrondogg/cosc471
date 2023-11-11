-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema registrationsystem
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema registrationsystem
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `registrationsystem` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `registrationsystem` ;

-- -----------------------------------------------------
-- Table `registrationsystem`.`classes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`classes` (
  `CRN` INT NOT NULL,
  `Capacity` INT NULL DEFAULT NULL,
  `StudentsEnrolled` INT NULL DEFAULT NULL,
  `MeetingTimes` VARCHAR(255) NULL DEFAULT NULL,
  `CourseNumber` VARCHAR(20) NULL DEFAULT NULL,
  `ClassName` VARCHAR(255) NULL DEFAULT NULL,
  `BuildingAndRoomNo` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`CRN`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `registrationsystem`.`department`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`department` (
  `DepartmentName` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`DepartmentName`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `registrationsystem`.`students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`students` (
  `Student_ID` INT NOT NULL,
  `Name` VARCHAR(255) NULL DEFAULT NULL,
  `GraduateOrUndergraduate` VARCHAR(20) NULL DEFAULT NULL,
  `PhoneNumber` VARCHAR(15) NULL DEFAULT NULL,
  `Major` VARCHAR(50) NULL DEFAULT NULL,
  `Gender` VARCHAR(100) NULL DEFAULT NULL,
  `Email` VARCHAR(255) NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) NULL DEFAULT 'UNINITIALIZED',
  PRIMARY KEY (`Student_ID`),
  INDEX `idx_Students_Major` (`Major` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `registrationsystem`.`enrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`enrollment` (
  `Enrollment_ID` INT NOT NULL,
  `Student_ID` INT NULL DEFAULT NULL,
  `CRN` INT NULL DEFAULT NULL,
  PRIMARY KEY (`Enrollment_ID`),
  INDEX `FK_Enrollment_Student` (`Student_ID` ASC) VISIBLE,
  INDEX `FK_Enrollment_Classes` (`CRN` ASC) VISIBLE,
  CONSTRAINT `enrollment_ibfk_1`
    FOREIGN KEY (`Student_ID`)
    REFERENCES `registrationsystem`.`students` (`Student_ID`),
  CONSTRAINT `enrollment_ibfk_2`
    FOREIGN KEY (`CRN`)
    REFERENCES `registrationsystem`.`classes` (`CRN`),
  CONSTRAINT `FK_Enrollment_Classes`
    FOREIGN KEY (`CRN`)
    REFERENCES `registrationsystem`.`classes` (`CRN`),
  CONSTRAINT `FK_Enrollment_Student`
    FOREIGN KEY (`Student_ID`)
    REFERENCES `registrationsystem`.`students` (`Student_ID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `registrationsystem`.`professors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`professors` (
  `EmployeeID` INT NOT NULL,
  `Name` VARCHAR(255) NULL DEFAULT NULL,
  `PhoneNumber` VARCHAR(15) NULL DEFAULT NULL,
  `Email` VARCHAR(255) NULL DEFAULT NULL,
  `DepartmentName` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`),
  INDEX `DepartmentName` (`DepartmentName` ASC) VISIBLE,
  CONSTRAINT `professors_ibfk_1`
    FOREIGN KEY (`DepartmentName`)
    REFERENCES `registrationsystem`.`department` (`DepartmentName`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `registrationsystem`.`teaches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `registrationsystem`.`teaches` (
  `Professor_ID` INT NOT NULL,
  `CRN` INT NOT NULL,
  PRIMARY KEY (`Professor_ID`, `CRN`),
  INDEX `idx_Teaches_Professor_ID` (`Professor_ID` ASC) VISIBLE,
  INDEX `idx_Teaches_CRN` (`CRN` ASC) VISIBLE,
  CONSTRAINT `teaches_ibfk_1`
    FOREIGN KEY (`Professor_ID`)
    REFERENCES `registrationsystem`.`professors` (`EmployeeID`),
  CONSTRAINT `teaches_ibfk_2`
    FOREIGN KEY (`CRN`)
    REFERENCES `registrationsystem`.`classes` (`CRN`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
