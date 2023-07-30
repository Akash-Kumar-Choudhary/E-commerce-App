import express from "express";
import { isAdmin, requiresignIn } from "../middleware/authMiddleware.js";
import {
  ProductFilterController,
  braintreePaymentController,
  braintreeTokenController,
  createproductController,
  deleteProductController,
  getPhotoController,
  getallProduct,
  productCountCountroller,
  productPageController,
  productcategoryController,
  searchProductController,
  similarProductController,
  singleProduct,
  updateController,
} from "../controller/productController.js";
import formidable from "express-formidable";

const router = express.Router();
router.post(
  "/create-product",
  requiresignIn,
  isAdmin,
  formidable(),
  createproductController
);
router.put(
  "/update-product/:id",
  requiresignIn,
  isAdmin,
  formidable(),
  updateController
);

router.get("/get-product", getallProduct);
router.get("/single-product/:slug", requiresignIn, singleProduct);
router.get("/product-photo/:id", getPhotoController);
router.delete("/product-delete/:id", deleteProductController);
router.post("/product-filter", ProductFilterController);
router.get("/product-count", productCountCountroller);
router.get("/product-list/:page", productPageController);
router.get("/search/:keyword", searchProductController);
router.get("/similar-product/:pid/:cid", similarProductController);
router.get("/product-category/:slug" , productcategoryController)
router.get('/braintree/token' , braintreeTokenController)
router.post('/braintree/payment' ,requiresignIn, braintreePaymentController)
export default router;
