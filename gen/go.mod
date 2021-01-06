module github.com/Mojashi/RicochetRobotsWeb/gen

go 1.15

replace github.com/Mojashi/RicochetRobotsWeb/api => ../api

require (
	github.com/Mojashi/RicochetRobotsWeb/api v0.0.0-00010101000000-000000000000
	github.com/go-sql-driver/mysql v1.5.0
	github.com/jmoiron/sqlx v1.2.0
	github.com/joho/godotenv v1.3.0
)
