class ConnectionConfig:
    POSTGRES_USER: str = 'postgis'
    POSTGRES_PASSWORD = 'postgis'
    POSTGRES_SERVER: str = 'localhost'
    POSTGRES_PORT: str = 6543
    POSTGRES_DB: str = 'postgis'
    DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"