drop table hugs;
drop table days;
drop table moods;
drop table caretaker;
drop table users;

create table users (
  id serial,
  name varchar(50),
  username varchar(50),
  friends serial[],
  primary key (id)
);

create table cares (
  id serial,
  name varchar(50),
  primary key (id)
);

create table moods (
  id serial,
  user_id integer,
  ts timestamp,
  comment text,
  location text,
  feel integer,
  primary key (id),
  foreign key (user_id) references users(id)
);

create table days (
  id serial,
  user_id integer,
  day date,
  primary key (user_id, day),
  foreign key (user_id) references users(id),
  day_type varchar(50)
);

create table hugs (
  id serial,
  user_id integer,
  ts timestamp,
  from_name varchar(50),
  primary key (id),
  foreign key (user_id) references users(id)
);
