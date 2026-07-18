import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: '请填写所有必填字段' })
    if (password.length < 6) return res.status(400).json({ message: '密码至少需要 6 位' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: '该邮箱已被注册' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    const token = generateToken(user._id)

    res.status(201).json({ user, token })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: '注册失败，请稍后重试' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: '请输入邮箱和密码' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: '邮箱或密码错误' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ message: '邮箱或密码错误' })

    const token = generateToken(user._id)
    res.json({ user, token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: '登录失败，请稍后重试' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json({ user })
  } catch (err) {
    console.error('Get me error:', err)
    res.status(500).json({ message: '获取用户信息失败' })
  }
})

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body
    const updates = {}
    if (name) updates.name = name
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.userId } })
      if (existing) return res.status(409).json({ message: '该邮箱已被使用' })
      updates.email = email
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json({ user })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ message: '更新资料失败' })
  }
})

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: '请填写当前密码和新密码' })
    if (newPassword.length < 6) return res.status(400).json({ message: '新密码至少需要 6 位' })

    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: '用户不存在' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: '当前密码不正确' })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: '密码修改成功' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ message: '修改密码失败' })
  }
})

export default router
