const verifyRoles = (req, res, ...allowedRoles) => {
  if (!req?.roles) return res.sendStatus(401); // Unauthorized

  const rolesArray = [...allowedRoles];

  console.log("rolesArray", rolesArray);
  console.log("roles", req.roles);

  const result = req.roles
    .map((role) => rolesArray.includes(role))
    .find((roleValue) => roleValue === true);

  if (!result) return res.sendStatus(401); // Unauthorized
};

module.exports = verifyRoles;
