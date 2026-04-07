import { spawnSync } from 'node:child_process';
import net from 'node:net';

function getEnvNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

async function waitForTcp(
  host: string,
  port: number,
  timeoutMs: number,
): Promise<void> {
  const started = Date.now();

  while (true) {
    const elapsed = Date.now() - started;
    if (elapsed > timeoutMs) {
      throw new Error(
        `Timeout waiting for TCP ${host}:${port} after ${timeoutMs}ms`,
      );
    }

    const ok = await new Promise<boolean>((resolve) => {
      const socket = net.connect({ host, port });

      const done = (result: boolean) => {
        socket.removeAllListeners();
        try {
          socket.end();
        } catch {
          // ignore
        }
        resolve(result);
      };

      socket.once('connect', () => done(true));
      socket.once('error', () => done(false));
      socket.setTimeout(500, () => done(false));
    });

    if (ok) return;
    await new Promise((r) => setTimeout(r, 500));
  }
}

async function main() {
  const composeFile = process.env.E2E_COMPOSE_FILE ?? '../docker-compose.yml';
  const service = process.env.E2E_DB_SERVICE ?? 'postgres';

  const host = process.env.DB_HOST ?? 'localhost';
  const port = getEnvNumber('DB_PORT', 5432);
  const timeoutMs = getEnvNumber('E2E_DB_WAIT_TIMEOUT_MS', 60_000);

  if (process.env.E2E_SKIP_DB_BOOTSTRAP !== '1') {
    const up = spawnSync(
      'docker',
      ['compose', '-f', composeFile, 'up', '-d', service],
      { stdio: 'inherit' },
    );

    if (up.status !== 0) {
      console.warn(
        [
          'Could not start Postgres via Docker Compose.',
          'If you have Postgres running already, we will try to connect to it.',
          'Otherwise, start Docker Desktop (or run Postgres) then rerun e2e.',
          'You can also set E2E_SKIP_DB_BOOTSTRAP=1 to skip docker compose up.',
        ].join(' '),
      );
    }
  }

  try {
    await waitForTcp(host, port, timeoutMs);
  } catch (err) {
    throw new Error(
      `Postgres is not reachable at ${host}:${port}. ` +
        `Start Docker Desktop (compose file: ${composeFile}, service: ${service}) ` +
        `or run a local Postgres with matching DB_* env. Original error: ${String(err)}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
