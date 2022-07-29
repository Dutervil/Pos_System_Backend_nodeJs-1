
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

create category(
    id int not null auto_increment,
    name varchar(255) not null,
    primary key(id)
)

create table product(
  id int not null auto_increment,
  name varchar(255) not null,
  categoryId integer not null,
  description varchar(255),
  price integer,
  status varchar(20),
  primary key(id);
)

create table bill(
    id int not null auto_encrement,
    uuid varchar(255) not null ,
    name varchar(255) not null,
    email varchar(255) not null,
    contactNumber varchar(50) not null ,
    paymentMethod varchar(50) not null ,
    total int not null ,
    productDetails json default  null,
    createdBy varchar(255) not null ,
    primary key (id)
)