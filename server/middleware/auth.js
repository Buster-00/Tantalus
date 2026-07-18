import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'awwwards-jwt-secret-dev'

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录，请先登录' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch {
    return res.status(401).json({ message: '登录已过期，请重新登录' })
  }
}
