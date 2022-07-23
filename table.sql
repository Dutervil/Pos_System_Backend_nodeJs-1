
create table user(
    id int primary key  auto_increment,
    name varchar(255),
    contactNumber varchar(20),
    email varchar (50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    unique (email)
);
insert into  user(name,contactNumber,email,password,status,role)values('Admin','31340028','admin@gmail.com','admin','true','admin');

