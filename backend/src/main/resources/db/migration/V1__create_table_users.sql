create table users(
    id BIGINT primary key AUTO_INCREMENT,
    name varchar(100) not null,
    email varchar(100) unique,
    role varchar(20),
    password varchar(255) not null
);
