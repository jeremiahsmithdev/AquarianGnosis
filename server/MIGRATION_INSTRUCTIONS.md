# Database Migration Instructions

## Running Migrations

To run the database migrations for the new community features:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the migrations:
   ```bash
   alembic upgrade head
   ```

## Migration Order

The migrations should be run in this order:
1. forum_migration.py - Creates forum tables
2. study_group_migration.py - Creates study group tables
3. resource_migration.py - Creates shared resources table

## Verifying Migrations

To check the current migration status:
```bash
alembic current
```

To view all available migrations:
```bash
alembic branches
```

## Creating New Migrations

If you need to create additional migrations:
```bash
alembic revision -m "description of changes"
```

Then edit the generated file in `migrations/versions/` and run:
```bash
alembic upgrade head
```
