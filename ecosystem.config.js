module.exports = {
  apps: [
    {
      name: 'aquarian-gnosis-backend',
      cwd: './server',
      script: './start_backend.sh',
      env: {
        NODE_ENV: 'development',
        PORT: 5040,
        REDIS_URL: 'redis://localhost:6379'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5040,
        REDIS_URL: 'redis://localhost:6379'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    },
    {
      name: 'aquarian-gnosis-frontend',
      cwd: './client',
      script: 'npm',
      args: process.env.NODE_ENV === 'production' ? 'run preview' : 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        VITE_API_BASE_URL: 'http://localhost:5040/api/v1'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        VITE_API_BASE_URL: 'https://aquariangnosis.org/api/v1'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true
    },
    {
      name: 'aquarian-gnosis-worker',
      cwd: './server',
      script: 'python3',
      args: '-m app.workers.task_worker',
      env: {
        NODE_ENV: 'development',
        REDIS_URL: 'redis://localhost:6379'
      },
      env_production: {
        NODE_ENV: 'production',
        REDIS_URL: 'redis://localhost:6379'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log',
      log_file: './logs/worker-combined.log',
      time: true
    }
  ]
};