drop table moods;
drop table users;

create table users (
  id serial,
  primary key (id)
);

create table moods (
  id serial,
  user_id integer,
  primary key (id),
  foreign key (user_id) references users(id)
);
