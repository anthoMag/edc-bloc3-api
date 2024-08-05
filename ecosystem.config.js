module.exports = {
  apps: [
    {
      name: 'app',
      script: './www/app.js',
      instances: 3,
      exec_mode: 'cluster',
      max_memory_restart: '200M',
      error_file: './logs/errors.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

// La commande à utiliser pour démarrer l'application avec les 3 instances :
// pm2 start ecosystem.config.js
