const express = require("express")
const cors = require("cors")

const createDB = require("./config/db")
createDB();

require ("dotenv").config()


const app = express()

const questionsRouter = require("./routes/questions")
const authRouter = require("./routes/auth")
const materialsRouter = require("./routes/materials")
const answerRouter = require("./routes/answer")
const uploadRouter = require("./routes/uploadRoutes")

app.use(cors())
app.use(express.json())

app.use("/questions",questionsRouter)
app.use("/auth",authRouter)
app.use("/materials",materialsRouter)
app.use("/answers",answerRouter)
app.use("/upload", uploadRouter)



app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`)
})