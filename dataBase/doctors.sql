\echo 'Delete and recreate doctorsdb db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE doctorsdb;
CREATE DATABASE doctorsdb;
\connect doctorsdb

\i doctorsdb-schema.sql
\i doctorsdb-seed.sql

\echo 'Delete and recreate doctorsdb_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE doctorsdb_test;
CREATE DATABASE doctorsdb_test;
\connect doctorsdb_test

\i doctorsdb-schema.sql