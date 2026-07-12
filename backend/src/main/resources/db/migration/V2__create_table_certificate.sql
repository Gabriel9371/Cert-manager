create table certificates(
    id BIGINT primary key AUTO_INCREMENT,
    cnpj varchar(18) unique not null,
    company_name varchar (100) not null,
    valid_until DATE,
    update_at DATETIME,
    status varchar(8) not null,
    valid_from DATETIME,
    contact_phone varchar(30),
    contact_name varchar(90),
    issuer varchar(50),
    issued_by_us BOOLEAN DEFAULT FALSE,
    renewal_value double,
    created_at DATETIME,


    created_by_id BIGINT,
    FOREIGN KEY(created_by_id) references users(id),

    renewed_by_id BIGINT,
    FOREIGN KEY(renewed_by_id) references users(id)

);