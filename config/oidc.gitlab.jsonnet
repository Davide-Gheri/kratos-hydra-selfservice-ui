local claims = {
  email_verified: false
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if "email" in claims && claims.email_verified then "email" else null]: claims.email,

      [if "picture" in claims then "avatar" else null]: claims.picture,
    },
  },
}
