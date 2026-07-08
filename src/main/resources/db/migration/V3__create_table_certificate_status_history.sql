create table certificate_status_history(
    id BIGINT primary key AUTO_INCREMENT,
    changed_at DATETIME,
    previous_status varchar(8),
    new_status varchar(8),


    changed_by_id BIGINT,
    FOREIGN KEY(changed_by_id) references users(id),


    certificate_id BIGINT,
    FOREIGN KEY(certificate_id) references certificates(id)
);