import express from 'express'
import { requiresignIn , isAdmin } from '../middleware/authMiddleware.js'
import { createcategoryController , updateController , getAllController , getSingleController, deleteController} from '../controller/categoryController.js'
const router = express.Router()
router.post('/create-category' , requiresignIn , isAdmin , createcategoryController)

router.put('/update-category/:id',requiresignIn , isAdmin , updateController)

router.get('/get-category' , requiresignIn , getAllController)
router.get('/single-category/:slug' , requiresignIn , getSingleController)
router.delete('/delete-category/:id' , requiresignIn , isAdmin , deleteController)
export default router