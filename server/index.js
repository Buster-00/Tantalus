import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'

const PORT = process.env.PORT || 3001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/awwwards'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

async function start() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log(`✓ MongoDB 已连接: ${MONGO_URI}`)
    app.listen(PORT, () => {
      console.log(`✓ 服务器运行在: http://localhost:${PORT}`)
      console.log(`  POST  /api/auth/register  — 注册`)
      console.log(`  POST  /api/auth/login     — 登录`)
      console.log(`  GET   /api/auth/me        — 获取用户信息 (需 token)`)
      console.log(`  PUT   /api/auth/profile   — 更新资料 (需 token)`)
      console.log(`  PUT   /api/auth/password  — 修改密码 (需 token)`)
    })
  } catch (err) {
    console.error('启动失败:', err.message)
    process.exit(1)
  }
}

start()
