CREATE TABLE clients (
	id SERIAL PRIMARY KEY NOT NULL,
	first_name VARCHAR,
	last_name VARCHAR,
	address VARCHAR,
	city VARCHAR,
	state VARCHAR,
	email VARCHAR,
	phone VARCHAR
);


CREATE TABLE insurers(
	id SERIAL PRIMARY KEY NOT NULL,
	provider VARCHAR,
	first_name VARCHAR,
	last_name VARCHAR,
	phone VARCHAR,
	email VARCHAR
);

INSERT INTO insurers (first_name, last_name, provider, phone, email) VALUES ('Juanamaria', 'CordonesCook', 'MetLife', '6125552525', 'JCordonesCook@Metlife.com');


INSERT INTO clients (first_name, last_name, address, city, state, email, phone) VALUES ('Aesop', 'P.W. Corgi', '522 Dog Way', 'Minneapolis', 'MN', 'BallinAesop818@gmail.com', '9525551212');

SELECT * FROM clients WHERE id=1;
