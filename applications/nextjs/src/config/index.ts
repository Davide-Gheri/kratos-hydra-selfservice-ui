
export const config = {
  self: 'http://id.kratos.com',
  kratos: {
    browser: 'http://id.kratos.com/k/kratos',
    public: 'http://kratos:4433',
    admin: 'http://kratos:4434',
  },
  hydra: {
    admin: 'http://hydra:4445',
  },
};

export type Config = typeof config;
