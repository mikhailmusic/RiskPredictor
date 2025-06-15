const requiredEnvVars = [
  'VITE_FLASK_API_URL',
  'VITE_YANDEX_API_KEY',
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    const message = `Отсутствуют обязательные переменные окружения: ${missing.join(', ')}`;
    throw new Error(message);
  }
}