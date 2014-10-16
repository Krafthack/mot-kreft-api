drop table hugs;
drop table days;
drop table moods;
drop table users;

create table users (
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
  primary key (id),
  foreign key (user_id) references users(id)
);

create table days (
  id serial,
  user_id integer,
  primary key (id),
  foreign key (user_id) references users(id),
  day_type varchar(50)
);

create table hugs (
  id serial,
  user_id integer,
  day_id integer,
  from_name varchar(50),
  primary key (id),
  foreign key (day_id) references days(id),
  foreign key (user_id) references users(id)
);
