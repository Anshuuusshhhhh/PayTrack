USE assignment_db;

INSERT INTO user (username, password, balance) VALUES ('alice', 'password', 1000);
INSERT INTO user (username, password, balance) VALUES ('bob', 'password', 1000);

select * from audit_log;
select * from user;
delete  from user;
delete from audit_log;
delete from user;
