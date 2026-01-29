module.exports = {
  apps: [
    {
      name: "asseshub-v1",
      script: "npm",
      args: "start",
      exec_mode: "cluster",
      instances: "2", // pakai semua core CPU
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 4400,
      },
    },
  ],
};
