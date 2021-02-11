
export const config = {
  self: 'http://127.0.0.1:4455',
  kratos: {
    browser: 'http://127.0.0.1:4433',
    public: 'http://127.0.0.1:4433',
    admin: 'http://127.0.0.1:4434',
  },
  hydra: {
    admin: 'http://localhost:4445',
  },
};

export type Config = typeof config;
