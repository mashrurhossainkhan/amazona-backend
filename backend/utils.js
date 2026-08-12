import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          console.log(err);
          res.status(401).send(err);
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'Please logout and signin again1' });
  }
};

// Accept authenticated customers when a token is present, while also allowing
// guest checkout requests to continue without manufacturing a user account.
export const optionalAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    req.user = null;
    next();
    return;
  }

  const token = authorization.slice(7, authorization.length);
  jwt.verify(
    token,
    process.env.JWT_SECRET || 'somethingsecret',
    (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Your session has expired. Please try again.' });
      } else {
        req.user = decode;
        next();
      }
    }
  );
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Please logout and signin again2' });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: 'Please logout and signin again3' });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Please logout and signin again4' });
  }
};
