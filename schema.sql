DROP DATABASE IF EXISTS top_songsDB;

CREATE DATABASE top_songsDB;

USE top_songsDB;

CREATE TABLE top5000 (
	id INT NOT NULL AUTO_INCREMENT,
    position INT NOT NULL,
	artist_name VARCHAR(30) NOT NULL,
    song_name VARCHAR(30) NOT NULL,
    year INT NULL,
    rps_WORLD DECIMAL(10, 5) NULL,  
    rps_USA DECIMAL(10, 5) NULL,   
    rps_UK FLOAT(10, 5) NULL,  
    rps_EURO DECIMAL(10, 5) NULL,  
    rps_rest_world DECIMAL(10, 5) NULL,  
    PRIMARY KEY (id)
);